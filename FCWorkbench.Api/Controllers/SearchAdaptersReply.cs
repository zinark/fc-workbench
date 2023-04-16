using FCHttpRequestEngine.Adapters;

namespace FCWorkbench.Api.Controllers;

public class SearchAdaptersReply
{
    public List<Adapter> Adapters { get; set; }
}