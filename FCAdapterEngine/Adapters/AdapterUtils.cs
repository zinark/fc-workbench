using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace FCHttpRequestEngine.Adapters
{
    public class AdapterUtils
    {
        JsonSerializerSettings _jsonSettings = new JsonSerializerSettings
        {
            NullValueHandling = NullValueHandling.Ignore,
            Formatting = Formatting.Indented,
            ContractResolver = new ShouldSerializeContractResolver()
        };

        public Adapter Merge(Adapter adapter, Adapter customerAdapter)
        {
            var adapterPoolParts = adapter.Parts;
            var customerAdapterParts = customerAdapter.Parts;

            foreach (var part in adapterPoolParts)
            {
                var foundPart = customerAdapterParts.Where(x => x.Name == part.Name).FirstOrDefault();
                if (foundPart != null)
                {
                    foreach (var customerVar in foundPart.Variables)
                    {
                        var poolVar = part.Variables.Where(x => x.AdapterKey == customerVar.AdapterKey).FirstOrDefault();
                        if (poolVar != null) poolVar.Value = customerVar.Value;
                    }
                }
            }

            return adapter;
        }

        public string Optimize(Adapter adapter)
        {
            var partsToInsert = adapter.Parts.Where(x => x.Name.EndsWith("-UI")).ToList();
            var partsToRemove = adapter.Parts.Where(x => !x.Name.EndsWith("-UI")).ToList();

            foreach (var part in partsToRemove)
            {
                adapter.Parts.Remove(part);
            }

            foreach (var part in partsToInsert)
            {
                foreach (var v in part.Variables)
                {
                    v.CollectionSeperator = null;
                    v.CollectionTemplate = null;
                    v.Executor = null;
                    v.Hint = null;
                    v.Label = null;
                    v.Options = null;
                    v.Reducer = null;
                    v.Type = null;
                    v.CollectionTemplateContentType = null;
                    v.Variables = null;

                    if (v.Value == null)
                        v.Value = v.DefaultValue ?? "undefined";

                    v.DefaultValue = null;
                }
            }

            return JsonConvert.SerializeObject(adapter, _jsonSettings);
        }
    }

    public class ShouldSerializeContractResolver : DefaultContractResolver
    {
        protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
        {
            string[] fields = { "IsRequired", "IsHidden", "Order", "MaxLength", "MinLength", "IsExecutable", "IsCollectable", "CanFillValue", "Requests", "BaseUrl" };

            foreach (string field in fields)
            {
                if (member.Name.ToLowerInvariant() == field.ToLowerInvariant())
                    return null;
            }

            return base.CreateProperty(member, memberSerialization);
        }
    }
}
