namespace FCHttpRequestEngine.Adapters;

public class Screen
{
    public string Id { get; set; } = Guid.NewGuid().ToString().Replace("-", "").ToUpper();
    public string Title { get; set; } = "Undefined Screen";
    public List<ScreenItem> Items { get; set; } = new List<ScreenItem>();
}