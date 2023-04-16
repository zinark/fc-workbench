namespace FCHttpRequestEngine.Adapters
{
    public class AdapterVariableOption
    {
        public string Label { get; set; }
        public string Value { get; set; }

        public AdapterVariableOption(string value, string label)
        {
            Value = value;
            Label = label;
        }
    }
}
