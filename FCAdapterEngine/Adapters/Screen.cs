namespace FCHttpRequestEngine.Adapters;

public class Screen : HasUniqueId
{
    public string Title { get; set; } = "Undefined Screen";
    public List<ScreenItem> Items { get; set; } = new List<ScreenItem>();
}