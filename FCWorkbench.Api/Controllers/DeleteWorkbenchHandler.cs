using FCMicroservices.Components.EnterpriseBUS;
using FCWorkbench.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace FCWorkbench.Api.Controllers;

public class DeleteWorkbenchHandler : Handler<DeleteWorkbench, DeleteWorkbenchReply>
{
    private readonly IDbContextFactory<WorkbenchDbContext> _ctxFactory;

    public override DeleteWorkbenchReply Handle(DeleteWorkbench input)
    {
        using var ctx = _ctxFactory.CreateDbContext();
        var found = ctx.Set<Workbench>().FirstOrDefault(x => x.Id == input.Id);
        ctx.Remove(found);
        ctx.SaveChanges();
        return new DeleteWorkbenchReply();
    }

    public DeleteWorkbenchHandler(IDbContextFactory<WorkbenchDbContext> ctxFactory)
    {
        _ctxFactory = ctxFactory;
    }
}