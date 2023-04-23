using FCHttpRequestEngine.Adapters;
using FCMicroservices.Extensions;

namespace FCWorkbench.Api.Data;

public class Workbench : HasRefNo
{
    public int Id { get; set; }
    public string Title { get; set; } = "E-Wallet Sample";
    public string AdaptersJson { get; set; } = "[]";
    public string ScreensJson { get; set; } = "[]";
    public string Description { get; set; } = "A sample workbench for an e-wallet system";

    public Dictionary<string, string> Parameters { get; set; } = new()
    {
        { "api", "http://dev.vepara.com.tr" },
        { "admin_ApiKey", "admin" },
        { "admin_ApiKey_Password", "1234" },
        { "user1_Mail", "user1@mail.com" },
        { "user1_Phone", "5070414877" },
        { "user1_Password", "1000" },
        { "user2_Mail", "user2@mail.com" },
        { "user2_Phone", "5070414888" },
        { "user2_Password", "2000" },
        { "user1_walletCode", "W-1" },
        { "user2_walletCode", "W-2" },
        { "partner_walletCode", "W-P" }
    };

    public List<Adapter> Adapters() => AdaptersJson?.ParseJson<List<Adapter>>();
    public List<Screen> Screens() => ScreensJson?.ParseJson<List<Screen>>();

    public List<object> AllVariables()
    {
        var list = new List<object>();

        var adapters = Adapters();
        foreach (var adapter in adapters)
        {
            foreach (var part in adapter.Parts)
            {
                var variables = part.Variables;

                foreach (var variable in variables)
                {
                    list.Add(new
                    {
                        Variable = variable,
                        PartRefNo = part.RefNo,
                        PartName = part.Name,
                        AdapterRefNo = adapter.RefNo,
                        AdapterName = adapter.Name,
                    });
                }
            }
        }

        return list;
    }

    public void AddAdapter(Adapter adapter)
    {
        var adapters = Adapters();
        adapters.Add(adapter);
        AdaptersJson = adapters.ToJson();
    }

    public void AddScreen(Screen adapter)
    {
        var screens = Screens();
        screens.Add(adapter);
        ScreensJson = screens.ToJson();
    }
}