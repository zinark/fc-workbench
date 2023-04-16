using FCHttpRequestEngine;
using FCHttpRequestEngine.Adapters;
using FCHttpRequestEngine.Extensions;
using FCMicroservices.Components.EnterpriseBUS;
using FCWorkbench.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace FCWorkbench.Api.Controllers;

public class ImportAdapterHandler : Handler<ImportAdapter, ImportAdapterReply>
{
    private readonly OpenApiImporter _importer;
    private readonly IDbContextFactory<WorkbenchContext> _ctxFactory;

    public override ImportAdapterReply Handle(ImportAdapter input)
    {
        using var ctx = _ctxFactory.CreateDbContext();
        using HttpClient client = new HttpClient();
        var content = client.GetStringAsync(input.OpenApiUrl).Result;
        Adapter adapter = _importer.Import(input.BaseUrl, content);

        var bench = ctx.Set<Workbench>().First(x => x.Id == input.WorkbenchId);
        bench.AddAdapter(adapter);
        
        ctx.Update(bench);
        ctx.SaveChanges();
        return new ImportAdapterReply()
        {
            AdapterId = bench.Id
        };
    }

    public ImportAdapterHandler(OpenApiImporter importer, IDbContextFactory<WorkbenchContext> ctxFactory)
    {
        _importer = importer;
        _ctxFactory = ctxFactory;
    }
}