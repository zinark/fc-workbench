using FCHttpRequestEngine.Adapters;
using FCMicroservices.Extensions;
using Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure;

namespace FCWorkbench.Api.Data;

public class Workbench
{
    public int Id { get; set; }
    public string AdaptersJson { get; set; } = "[]";
    public string ScreensJson { get; set; } = "[]";

    public List<Adapter> Adapters() => AdaptersJson?.ParseJson<List<Adapter>>();
    public List<Screen> Screens() => ScreensJson?.ParseJson<List<Screen>>();

    public List<object> Variables()
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
                        PartId = part.Id,
                        PartName = part.Name,
                        AdapterId = adapter.Id,
                        AdapterName = adapter.Name
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