using FCMicroservices.Components.EnterpriseBUS;
using Microsoft.AspNetCore.Mvc;

namespace FCWorkbench.Api.Controllers;

[ApiController]
public class WorkbenchController : Controller
{
    private readonly EnterpriseBus _bus;

    public WorkbenchController(EnterpriseBus bus)
    {
        _bus = bus;
    }

    [HttpPost("import-adapter")]
    public ImportAdapterReply ImportAdapter(ImportAdapter input)
    {
        return _bus.Handle(input) as ImportAdapterReply;
    }

    [HttpPost("search-adapters")]
    public SearchAdaptersReply SearchAdapters(SearchAdapters input)
    {
        return _bus.Handle(input) as SearchAdaptersReply;
    }

    [HttpPost("setup")]
    public SetupReply Setup(Setup input)
    {
        return _bus.Handle(input) as SetupReply;
    }

    [HttpPost("get-workbench")]
    public GetWorkbenchReply GetWorkbench(GetWorkbench input)
    {
        return _bus.Handle(input) as GetWorkbenchReply;
    }

    [HttpPost("save-workbench")]
    public SaveWorkbenchReply SaveWorkbench(SaveWorkbench input)
    {
        return _bus.Handle(input) as SaveWorkbenchReply;
    }

    [HttpPost("search-workbenchs")]
    public SearchWorkbenchsReply SearchWorkbenchs(SearchWorkbenchs input)
    {
        return _bus.Handle(input) as SearchWorkbenchsReply;
    }
}