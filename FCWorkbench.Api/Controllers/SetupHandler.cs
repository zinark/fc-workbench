using FCHttpRequestEngine.Adapters;
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

        Screen screenLogin = MakeScreenLogin();
        Screen screenResetPassword = MakeScreenResetPassword();
        Screen screenRegistration = MakeScreenRegistration();
        Screen screenHome = MakeScreenHome(screenLogin.Id, screenResetPassword.Id, screenRegistration.Id);

        bench.AddScreen(screenHome);
        bench.AddScreen(screenResetPassword);
        bench.AddScreen(screenRegistration);
        bench.AddScreen(screenLogin);

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

    private Screen MakeScreenRegistration()
    {
        return new Screen()
        {
            Title = "Yeni uyelik"
        };
    }

    private Screen MakeScreenResetPassword()
    {
        return new Screen()
        {
            Title = "Parola sifirla"
        };
    }

    private Screen MakeScreenLogin()
    {
        return new Screen()
        {
            Title = "Uye Giris",
            Items = new List<ScreenItem>()
            {
                new ScreenItem()
                {
                    Type = "Input",
                    Text = "Telefon",
                    X = 1, Y = 1, Width = 5, Height = 1
                },
                new ScreenItem()
                {
                    Type = "Input",
                    Text = "Parola",
                    X = 1, Y = 2, Width = 5, Height = 1
                },
                new ScreenItem()
                {
                    Type = "Button",
                    Text = "Devam",
                    X = 1, Y = 3, Width = 5, Height = 1,
                }
            }
        };
    }

    private Screen MakeScreenHome(string loginScreenId, string resetPasswordScreenId, string newMemberScreenId)
    {
        return new Screen()
        {
            Title = "Ana sayfa",
            Items = new List<ScreenItem>()
            {
                new ScreenItem()
                {
                    Type = "Label",
                    Text = "Ana Sayfa",
                    X = 1, Y = 1, Width = 5, Height = 1,
                    Align = "Center"
                },
                new ScreenItem()
                {
                    Type = "Link",
                    Text = "Giris Yap",
                    X = 1, Y = 2, Width = 5, Height = 1,
                    Align = "Center",
                    TargetScreenId = loginScreenId
                },
                new ScreenItem()
                {
                    Type = "Link",
                    Text = "Parola Unuttum",
                    X = 1, Y = 3, Width = 5, Height = 1,
                    Align = "Center",
                    TargetScreenId = resetPasswordScreenId
                },
                new ScreenItem()
                {
                    Type = "Link",
                    Text = "Yeni uyelik",
                    X = 1, Y = 4, Width = 5, Height = 1,
                    Align = "Center",
                    TargetScreenId = newMemberScreenId
                }
            }
        };
    }

    public SetupHandler(IDbContextFactory<WorkbenchContext> ctxFactory, EnterpriseBus bus)
    {
        _ctxFactory = ctxFactory;
        _bus = bus;
    }
}