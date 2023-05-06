using FCMicroservices.Components.EnterpriseBUS;
using FCWorkbench.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace FCWorkbench.Api.Controllers;

public class SearchWorkbenchsHandler : Handler<SearchWorkbenchs, SearchWorkbenchsReply>
{
    private readonly IDbContextFactory<WorkbenchDbContext> _ctxFactory;

    public override SearchWorkbenchsReply Handle(SearchWorkbenchs input)
    {
        var reply = new SearchWorkbenchsReply();
        using var ctx = _ctxFactory.CreateDbContext();
        var q = ctx.Set<Workbench>().AsQueryable();
        var total = q.Count();

        if (input.Take == null) input.Take = 10;
        if (input.Take > 10) input.Take = 10;
        if (input.Skip == null) input.Skip = 0;

        if (input.Take != null && input.Take > 0)
        {
            q = q.Take(input.Take.Value);
        }

        if (input.Skip != null && input.Skip > 0)
        {
            q = q.Skip(input.Skip.Value);
        }

        reply.Items = q.Select(x => new SearchWorkbenchsReply.Bench()
        {
            Title = x.Title,
            Parameters = x.Parameters,
            Description = x.Description,
            Id = x.Id,
            AdapterCount = x.Adapters().Count(),
            ScreenCount = x.Screens().Count()
        }).ToList();

        reply.Total = total;
        return reply;
    }

    public SearchWorkbenchsHandler(IDbContextFactory<WorkbenchDbContext> ctxFactory)
    {
        _ctxFactory = ctxFactory;
    }
}