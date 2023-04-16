using FCHttpRequestEngine.Adapters.Executors;
using FCHttpRequestEngine.Adapters.Reducers;

namespace FCHttpRequestEngine.Extensions
{
    public static class DictionaryExtensions
    {
        public static void ValidateKeys(this IDictionary<string, object> dict, params string[] requiredKeys)
        {
            var missingKeys = dict.Keys.Except(requiredKeys);
            if (missingKeys.Count() == 0) return;
            throw new AdapterException("Eksik alanlar : {0}", new { missingKeys });
        }

        public static IDictionary<string, object> ToDict(this object obj)
        {
            if (obj == null) return null;
            Dictionary<string, object> dict = new Dictionary<string, object>();

            var props = obj.GetType().GetProperties();
            foreach (var prop in props)
            {
                dict[prop.Name] = prop.GetValue(obj);
            }

            // TODO : Recursive will be implemented if needed
            return dict;
        }

        public static T DictToInstance<T>(this IDictionary<string, object> values)
        {
            if (values == null) return default;
            if (!values.ContainsKey("_Type")) throw new AdapterException("_Token alani bekleniyor, fakat bulunamadi!", new { VerilenAlanlar = values });

            string type = values["_Type"].ToString();

            var executorsOrReducers = typeof(T).Assembly.GetTypes()
                .Where(x =>
                    x.BaseType == typeof(Executor) ||
                    x.BaseType == typeof(Reducer)
                    )
                .ToList();

            var foundType = executorsOrReducers
                .Where(x => x.Name.ToLowerInvariant() == type.ToLowerInvariant())
                .FirstOrDefault();

            if (foundType == null) throw new AdapterException("DictToInstance icin bulunamayan bir tip var. {0}", new { type });
            var inst = (T)Activator.CreateInstance(foundType);
            var props = foundType.GetProperties();

            foreach (var key in values.Keys)
            {
                object value = values[key];
                var foundProp = props.Where(x => x.Name.ToLowerInvariant() == key.ToLowerInvariant()).FirstOrDefault();
                if (foundProp == null) throw new AdapterException("'{0}' tipi icin, json koda uygun degil! alinamayan ozellik adi: '{1}'", new { foundType.Name, key });
                foundProp.SetValue(inst, value);
            }
            return inst;
        }
    }
}
