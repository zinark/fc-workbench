namespace FCHttpRequestEngine.Adapters
{
    public class AdapterValueStore
    {
        public Dictionary<string, string> Values { get; set; } = new();
        public Dictionary<string, List<AdapterValueStore>> Rows { get; set; } = new();

        public AdapterValueStore()
        {

        }


        public AdapterValueStore AddValue(string key, string value)
        {
            Values[key] = value;
            return this;
        }

        public AdapterValueStore AddValues(Dictionary<string, string> dict)
        {
            foreach (var key in dict.Keys)
            {
                Values[key] = dict[key];
            }
            return this;
        }

        public AdapterValueStore AddValues(params (string key, string value)[] kvs)
        {
            foreach (var kv in kvs)
            {
                Values[kv.key] = kv.value;
            }
            return this;
        }

        public AdapterValueStore AddCollection(string key, params AdapterValueStore[] valueStores)
        {
            Rows[key.ToLowerInvariant()] = valueStores.ToList();
            return this;
        }

        public static AdapterValueStore Create()
        {
            return new AdapterValueStore();
        }

        public void FillAdapter(Adapter adapter)
        {
            var given_keys = Values.Keys.Select(x => x.ToLowerInvariant()).ToList();
            var existing_keys = adapter.AllRootVariables()
                .Where(x => !x.IsCollectable)
                .Select(x => x.AdapterKey).ToList();

            foreach (var key in Values.Keys)
            {
                var value = Values[key];
                adapter.SetValue(key, value);
            }

            foreach (var colkey in Rows.Keys)
            {
                List<AdapterValueStore> valueStores = Rows[colkey];
            }
        }

        internal List<AdapterValueStore> GetCollection(string collectionKey)
        {
            if (Rows == null) return new List<AdapterValueStore>();
            collectionKey = collectionKey.ToLowerInvariant();
            if (!Rows.ContainsKey(collectionKey)) return new List<AdapterValueStore>();
            return Rows[collectionKey];
        }
    }
}
