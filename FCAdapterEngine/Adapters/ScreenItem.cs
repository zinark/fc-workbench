namespace FCHttpRequestEngine.Adapters;

public class ScreenItem
{
    public int X { get; set; } = 0;
    public int Y { get; set; } = 0;
    public int Width { get; set; } = 5;
    public int Height { get; set; } = 1;
    public string Text { get; set; } = "Text";
    public string Align { get; set; }
    public string Type { get; set; }
    
    public string? AdapterVariableId { get; set; }
    public string? AdapterRequestCode { get; set; }
    public string? OnSuccess { get; set; }
    public string? OnFailed { get; set; }
}