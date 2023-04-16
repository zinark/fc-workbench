using FCHttpRequestEngine.Adapters;
using FCMicroservices.Extensions;
using Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure;

namespace FCWorkbench.Api.Data;

public class Workbench
{
    public int Id { get; set; }
    public string AdaptersJson { get; set; } = "[]";
    public string ScreensJson { get; set; } = "[]";

    public List<Adapter> Adapters () => AdaptersJson?.ParseJson<List<Adapter>>();

    public void AddAdapter(Adapter adapter)
    {
        var adapters = Adapters();
        adapters.Add(adapter);
        AdaptersJson = adapters.ToJson();
    }
}