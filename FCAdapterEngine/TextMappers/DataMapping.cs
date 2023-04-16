namespace FCHttpRequestEngine.TextMappers
{
    public class DataMapping
    {
        public string _Type { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public List<DataMapping> Mappings { get; set; } = new();

        public DataMapping()
        {
            _Type = GetType().Name;
        }

        public static DataMapping CreateStandard(string from, string to)
        {
            return new StandardMapping()
            {
                From = from,
                To = to
            };
        }
        public static DataMapping CreateCollection(string from, string to, params StandardMapping[] mappings)
        {
            var mapping = new CollectionMapping()
            {
                From = from,
                To = to
            };

            foreach (var m in mappings)
            {
                mapping.AddMapping(m);
            }
            return mapping;
        }

        public DataMapping AddMapping(DataMapping mapping)
        {
            Mappings.Add(mapping);
            return this;
        }
    }
}
