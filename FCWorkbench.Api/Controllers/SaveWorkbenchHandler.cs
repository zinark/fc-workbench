using FCMicroservices.Components.EnterpriseBUS;
using FCWorkbench.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace FCWorkbench.Api.Controllers;

public class SaveWorkbenchHandler : Handler<SaveWorkbench, SaveWorkbenchReply>
{
    private readonly IDbContextFactory<WorkbenchDbContext> _ctxFactory;

    public override SaveWorkbenchReply Handle(SaveWorkbench input)
    {
        using var ctx = _ctxFactory.CreateDbContext();
        Workbench bench;

        if (input.Id == null || input.Id == 0)
        {
            // new
            bench = new Workbench();
            ctx.Add(bench);
        }
        else
        {
            bench = ctx.Set<Workbench>().First(x => x.Id == input.Id);
            ctx.Update(bench);
        }

        bench.Description = input.Description;
        bench.Parameters = input.Parameters;
        bench.Title = input.Title;
        bench.AdaptersJson = input.Adapters;
        bench.ScreensJson = input.Screens;
        ctx.SaveChanges();

        return new SaveWorkbenchReply()
        {
            Id = bench.Id
        };
    }

    public SaveWorkbenchHandler(IDbContextFactory<WorkbenchDbContext> ctxFactory)
    {
        _ctxFactory = ctxFactory;
    }
}