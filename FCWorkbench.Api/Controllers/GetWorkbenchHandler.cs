using FCHttpRequestEngine;
using FCMicroservices.Components.EnterpriseBUS;
using FCWorkbench.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace FCWorkbench.Api.Controllers;

public class GetWorkbenchHandler : Handler<GetWorkbench, GetWorkbenchReply>
{
    private readonly OpenApiImporter _importer;
    private readonly IDbContextFactory<WorkbenchDbContext> _ctxFactory;

    public override GetWorkbenchReply Handle(GetWorkbench input)
    {
        using var ctx = _ctxFactory.CreateDbContext();
        using HttpClient client = new HttpClient();
        Workbench bench = ctx.Set<Workbench>().First(x => x.Id == input.Id);

        return new GetWorkbenchReply()
        {
            Id = bench.Id,
            Title = bench.Title,
            Parameters = bench.Parameters,
            Adapters = bench.Adapters(),
            Screens = bench.Screens(),
            AllVariables = bench.AllVariables(),
            Description = bench.Description
        };
    }

    public GetWorkbenchHandler(OpenApiImporter importer, IDbContextFactory<WorkbenchDbContext> ctxFactory)
    {
        _importer = importer;
        _ctxFactory = ctxFactory;
    }
}