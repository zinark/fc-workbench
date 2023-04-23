using FCHttpRequestEngine;
using FCMicroservices.Components.EnterpriseBUS;
using FCWorkbench.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace FCWorkbench.Api.Controllers;

public class SearchAdaptersHandler : Handler<SearchAdapters, SearchAdaptersReply>
{
    private readonly OpenApiImporter _importer;
    private readonly IDbContextFactory<WorkbenchDbContext> _ctxFactory;

    public override SearchAdaptersReply Handle(SearchAdapters input)
    {
        using var ctx = _ctxFactory.CreateDbContext();
        using HttpClient client = new HttpClient();
        var bench = ctx.Set<Workbench>().First(x => x.Id == input.WorkbenchId);
        var adapters = bench.Adapters();
        
        return new SearchAdaptersReply()
        {
            Adapters = adapters
        };
    }

    public SearchAdaptersHandler(OpenApiImporter importer, IDbContextFactory<WorkbenchDbContext> ctxFactory)
    {
        _importer = importer;
        _ctxFactory = ctxFactory;
    }
}