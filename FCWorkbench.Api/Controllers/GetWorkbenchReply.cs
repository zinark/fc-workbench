using FCHttpRequestEngine.Adapters;
using FCWorkbench.Api.Data;

namespace FCWorkbench.Api.Controllers;

public class GetWorkbenchReply
{
    public int Id { get; set; }
    public List<Adapter> Adapters { get; set; }
    public List<Screen> Screens { get; set; }
    public List<object> Variables { get; set; }
}