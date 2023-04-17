namespace FCHttpRequestEngine.Adapters;

public abstract class HasUniqueId
{
    public string Id { get; set; } = Guid.NewGuid().ToString().Replace("-", "").ToUpper();
}