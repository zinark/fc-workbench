using FCHttpRequestEngine.Adapters.Suggestions;
using FCHttpRequestEngine.Extensions;

namespace FCHttpRequestEngine.Adapters.Executors
{
    public class CollectionMultiplyExecutor : Executor, ISuggestable
    {
        public string CollectionVariableKey { get; set; }
        public string InnerKeyLeft { get; set; } // Desi
        public string InnerKeyRight { get; set; } // Weight
        public string Aras_Icin_Sifira_Izin_Verme { get; set; } = "hayir";

        public Suggestion BuildSuggestions(Adapter adapter)
        {
            var result = new Suggestion();
            result["CollectionVariableKey"] = adapter.AllRootVariables().Where(x => x.IsCollectable).Select(x => new SuggestionValue()
            {
                Value = x.AdapterKey,
                Description = x.Label
            });

            result["InnerKeyLeft"] = adapter.AllRootVariables().Where(x => x.IsCollectable).SelectMany(x => x.Variables)
                .Select(x => new SuggestionValue()
                {
                    Value = x.AdapterKey,
                    Description = x.Label
                });

            result["InnerKeyRight"] = adapter.AllRootVariables().Where(x => x.IsCollectable).SelectMany(x => x.Variables)
                .Select(x => new SuggestionValue()
                {
                    Value = x.AdapterKey,
                    Description = x.Label
                });

            result["Aras_Icin_Sifira_Izin_Verme"] = new List<SuggestionValue>()
            {
                new SuggestionValue(){ Value = "evet" },
                new SuggestionValue(){ Value = "hayir" }
            };
            return result;
        }

        public override string Execute(ExecutorContext ctx)
        {
            var items = ctx.ValueStore.GetCollection(CollectionVariableKey);
            decimal valueLeft = 0, valueRight = 0;
            decimal result = 0;

            ValidateInnerKeys(items);

            foreach (var item in items)
            {
                foreach (var v in item.Values)
                {
                    if (v.Key == InnerKeyLeft.ToLowerInvariant())
                    {
                        var (success, value) = v.Value.ParseDecimal();
                        if (!success) throw new AdapterException("Verilen {0} sayi degil!", new { v.Value });
                        valueLeft = value;
                    }

                    if (v.Key == InnerKeyRight.ToLowerInvariant())
                    {
                        var (success, value) = v.Value.ParseDecimal();
                        if (!success) throw new AdapterException("Verilen {0} sayi degil!", new { v.Value });
                        valueRight = value;
                    }
                }
                result += valueLeft * valueRight;
            }

            if (result == 0 && Aras_Icin_Sifira_Izin_Verme == "evet") return "1";

            return result.ToString();
        }

        private void ValidateInnerKeys(List<AdapterValueStore> items)
        {
            foreach (var item in items)
            {
                if (!item.Values.Keys.Contains(InnerKeyLeft) || !item.Values.Keys.Contains(InnerKeyRight))
                    throw new AdapterException("Geçersiz key! Verilen {0} ve {1} keylerin her ikisi de collection da olmak zorundadir!", new { InnerKeyLeft, InnerKeyRight });
            }
        }
    }
}