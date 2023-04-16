using FCHttpRequestEngine;
using FCMicroservices.Components.EnterpriseBUS;
using FCWorkbench.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace FCWorkbench.Api.Controllers;

public class GetWorkbenchHandler : Handler<GetWorkbench, GetWorkbenchReply>
{
    private readonly OpenApiImporter _importer;
    private readonly IDbContextFactory<WorkbenchContext> _ctxFactory;

    public override GetWorkbenchReply Handle(GetWorkbench input)
    {
        using var ctx = _ctxFactory.CreateDbContext();
        using HttpClient client = new HttpClient();
        var bench = ctx.Set<Workbench>().First(x => x.Id == input.Id);

        return new GetWorkbenchReply()
        {
            Id = bench.Id,
            Adapters = bench.Adapters(),
            Screens = bench.Screens()
        };
    }

    public GetWorkbenchHandler(OpenApiImporter importer, IDbContextFactory<WorkbenchContext> ctxFactory)
    {
        _importer = importer;
        _ctxFactory = ctxFactory;
    }
}