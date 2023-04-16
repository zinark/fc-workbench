using FCHttpRequestEngine.Adapters.Suggestions;

namespace FCHttpRequestEngine.Adapters.Executors
{
    public class TargetFieldExecutor : Executor, ISuggestable
    {
        public string TargetField { get; set; } = "target_field";

        public override string Execute(ExecutorContext ctx)
        {
            return ctx.Adapter.FindValue(TargetField);
        }

        public Suggestion BuildSuggestions(Adapter adapter)
        {
            var targetFields = adapter.AllVariables()
                .Select(x => new SuggestionValue()
                {
                    Value = x.AdapterKey,
                    Description = x.Label
                })
                .ToList();

            var result = new Suggestion();
            result["TargetField"] = targetFields;
            return result;
        }

    }
}