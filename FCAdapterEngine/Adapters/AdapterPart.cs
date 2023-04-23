namespace FCHttpRequestEngine.Adapters
{
    public class AdapterPart : HasRefNo
    {
        public string Name { get; set; }
        public List<AdapterVariable> Variables { get; set; } = new();

        public AdapterPart AddVariable(AdapterVariable variable)
        {
            variable.Order = Variables.Count + 1;
            Variables.Add(variable);
            return this;
        }
    }
}