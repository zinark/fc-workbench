namespace FCHttpRequestEngine.Adapters;

public class ScreenItem : HasRefNo
{
    public string Text { get; set; } = "Text";
    public string Type { get; set; } = ScreenItemTypes.LABEL;

    public Dictionary<string, object> Properties { get; set; }
    public Dictionary<string, string> Scripts { get; set; }
}