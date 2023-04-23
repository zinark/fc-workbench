using FCHttpRequestEngine;
using FCMicroservices;
using FCWorkbench.Api.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

Microservice
    .Create(args)
    .UseDbContext<WorkbenchDbContext>()
    .WithComponents(x => { x.AddTransient<OpenApiImporter>(); })
    .OverrideServices(svc =>
    {
        svc.AddCors(x => x.AddDefaultPolicy(p => p.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod()));
    })
    .OverrideApp(app => app.UseCors())
    .Run();