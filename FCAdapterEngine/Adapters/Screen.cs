namespace FCHttpRequestEngine.Adapters;

public class Screen : HasRefNo
{
    public string Tag { get; set; } = "user";
    public string Title { get; set; } = "Undefined Screen";
    public List<ScreenItem> Items { get; set; } = new List<ScreenItem>();
}