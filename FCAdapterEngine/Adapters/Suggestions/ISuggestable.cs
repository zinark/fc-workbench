namespace FCHttpRequestEngine.Adapters.Suggestions
{
    public class Suggestion : Dictionary<string, IEnumerable<SuggestionValue>>
    {

    }

    public class SuggestionValue
    {
        public string Value { get; set; }
        public string Description { get; set; }
    }

    public interface ISuggestable
    {
        Suggestion BuildSuggestions(Adapter adapter);
    }
}
