using Microsoft.EntityFrameworkCore;

namespace FCWorkbench.Api.Data;

public class WorkbenchDbContext : DbContext
{
    public WorkbenchDbContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder builder)
    {
        builder.EnableSensitiveDataLogging(true);
        builder.EnableDetailedErrors();
        builder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
        base.OnConfiguring(builder);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Workbench>();
        base.OnModelCreating(builder);
    }
}