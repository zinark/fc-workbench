namespace FCHttpRequestEngine.TextMappers
{
    public class CollectionSelector
    {
        public string SourceField { get; set; }
        public string TargetField { get; set; }

        public static CollectionSelector Create(string sourceField, string targetField)
        {
            return new CollectionSelector()
            {
                SourceField = sourceField,
                TargetField = targetField
            };
        }
    }
}
