namespace FCHttpRequestEngine.Adapters;

public abstract class HasRefNo
{
    public string RefNo { get; set; } = Guid.NewGuid().ToString().Replace("-", "").ToUpper();
}