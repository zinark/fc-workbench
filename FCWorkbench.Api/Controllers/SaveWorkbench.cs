namespace FCWorkbench.Api.Controllers;

public class SaveWorkbench
{
    public int? Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public Dictionary<string, string> Parameters { get; set; }
    public string Adapters { get; set; }
    public string Screens { get; set; }
}