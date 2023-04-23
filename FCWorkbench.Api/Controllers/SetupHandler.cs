using FCHttpRequestEngine.Adapters;
using FCMicroservices.Components.EnterpriseBUS;
using FCWorkbench.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace FCWorkbench.Api.Controllers;

public class SetupHandler : Handler<Setup, SetupReply>
{
    private readonly IDbContextFactory<WorkbenchDbContext> _ctxFactory;
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
        Screen screenHome = MakeScreenHome(screenLogin.RefNo, screenResetPassword.RefNo, screenRegistration.RefNo);

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
            OpenApiUrl = "https://dev.vepara.com.tr/public/swagger/1.0.0.2/swagger.json"
        });
        _bus.Handle(new ImportAdapter()
        {
            WorkbenchId = 1,
            BaseUrl = "https://dev.vepara.com.tr/wallet",
            OpenApiUrl = "https://dev.vepara.com.tr/wallet/swagger/1.0.0.2/swagger.json"
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
                    Properties = new Dictionary<string, object>()
                    {
                        { "AdapterVariableRefNo", "" }
                    }
                },
                new ScreenItem()
                {
                    Type = "Input",
                    Text = "Parola",
                    Properties = new Dictionary<string, object>()
                    {
                        { "AdapterVariableRefNo", "" }
                    }
                },
                new ScreenItem()
                {
                    Type = "Button",
                    Text = "Devam",
                    Properties = new Dictionary<string, object>()
                    {
                        { "AdapterRequestRefNo", "" }
                    }
                },
                new ScreenItem()
                {
                }
            }
        };
    }

    private Screen MakeScreenHome(string loginScreenRefNo, string resetPasswordScreenRefNo, string newMemberScreenRefNo)
    {
        return new Screen()
        {
            Title = "Ana sayfa",
            Items = new List<ScreenItem>()
            {
                new ScreenItem()
                {
                    Type = "Label",
                    Text = "Ana Sayfaya Hosgeldiniz",
                },
                new ScreenItem()
                {
                    Type = "Link",
                    Text = "Giris Yap",
                    Properties = new Dictionary<string, object>()
                    {
                        { "LinkScreenRefNo", loginScreenRefNo }
                    }
                },
                new ScreenItem()
                {
                    Type = "Link",
                    Text = "Parola Unuttum",
                    Properties = new Dictionary<string, object>()
                    {
                        { "LinkScreenRefNo", resetPasswordScreenRefNo }
                    }
                },
                new ScreenItem()
                {
                    Type = "Link",
                    Text = "Yeni uyelik",
                    Properties = new Dictionary<string, object>()
                    {
                        { "LinkScreenRefNo", newMemberScreenRefNo }
                    }
                }
            }
        };
    }

    public SetupHandler(IDbContextFactory<WorkbenchDbContext> ctxFactory, EnterpriseBus bus)
    {
        _ctxFactory = ctxFactory;
        _bus = bus;
    }
}