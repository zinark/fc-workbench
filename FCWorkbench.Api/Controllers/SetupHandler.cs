using FCMicroservices.Components.EnterpriseBUS;
using FCWorkbench.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace FCWorkbench.Api.Controllers;

public class SetupHandler : Handler<Setup, SetupReply>
{
    private readonly IDbContextFactory<WorkbenchContext> _ctxFactory;
    private readonly EnterpriseBus _bus;

    public override SetupReply Handle(Setup input)
    {
        using var ctx = _ctxFactory.CreateDbContext();
        ctx.Database.EnsureDeleted();
        ctx.Database.EnsureCreated();

        var bench = new Workbench();
        ctx.Add(bench);
        ctx.SaveChanges();

        _bus.Handle(new ImportAdapter()
        {
            WorkbenchId = 1,
            BaseUrl = "https://dev.vepara.com.tr/public",
            OpenApiUrl = "https://dev.vepara.com.tr/public/swagger/1.0.0.1/swagger.json"
        });
        _bus.Handle(new ImportAdapter()
        {
            WorkbenchId = 1,
            BaseUrl = "https://dev.vepara.com.tr/wallet",
            OpenApiUrl = "https://dev.vepara.com.tr/wallet/swagger/1.0.0.1/swagger.json"
        });

        return new SetupReply();
    }

    public SetupHandler(IDbContextFactory<WorkbenchContext> ctxFactory, EnterpriseBus bus)
    {
        _ctxFactory = ctxFactory;
        _bus = bus;
    }
}