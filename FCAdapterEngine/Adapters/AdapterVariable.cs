using FCHttpRequestEngine.Adapters.Executors;
using FCHttpRequestEngine.Adapters.Reducers;
using FCHttpRequestEngine.Extensions;

namespace FCHttpRequestEngine.Adapters
{
    public class AdapterVariable
    {
        public string Type { get; set; }
        public bool IsRequired { get; set; } = false;
        public bool IsHidden { get; set; } = false;
        public string AdapterKey { get; set; }
        public string Label { get; set; }
        public string Value { get; set; }
        public string DefaultValue { get; set; }
        public string Hint { get; set; }

        public static AdapterVariable Create(int order, string key, string label, string type)
        {
            var variable = new AdapterVariable()
            {
                Order = order,
                AdapterKey = key.ToLowerInvariant(),
                Label = label,
                Type = type
            };

            return variable;
        }

        public AdapterVariable Required()
        {
            IsRequired = true;
            return this;
        }
        public AdapterVariable Hidden()
        {
            IsHidden = true;
            return this;
        }

        public AdapterVariable WithDefaultValue(string defaultValue)
        {
            DefaultValue = defaultValue;
            return this;
        }

        public AdapterVariable WithValue(string value)
        {
            Value = value;
            return this;
        }

        public AdapterVariable WithHint(string hint)
        {
            Hint = hint;
            return this;
        }

        public AdapterVariable WithType(Func<AdapterVariableTypes, string> ftext)
        {
            var types = new AdapterVariableTypes();
            Type = ftext(types);
            return this;
        }

        public static AdapterVariable Create(string key, string label)
        {
            var variable = new AdapterVariable()
            {
                Order = 1,
                AdapterKey = key.ToLowerInvariant(),
                Label = label,
                Type = AdapterVariableTypes.Text
            };

            return variable;
        }

        public static AdapterVariable CreateCollectable(string key, string template, string seperator, params AdapterVariable[] variables)
        {
            return new AdapterVariable()
            {
                Order = 1,
                AdapterKey = key.ToLowerInvariant(),
                IsCollectable = true,
                CollectionTemplate = template,
                Variables = variables,
                CollectionSeperator = seperator
            };
        }

        [Obsolete("yenisi kullanılacak")]
        public static AdapterVariable CreateCollectable(int order, string key, string template, string seperator, params AdapterVariable[] variables)
        {
            return new AdapterVariable()
            {
                Order = order,
                AdapterKey = key.ToLowerInvariant(),
                IsCollectable = true,
                CollectionTemplate = template,
                Variables = variables,
                CollectionSeperator = seperator
            };
        }

        public static AdapterVariable CreateExecutable(string key, string label)
        {
            var variable = new AdapterVariable()
            {
                Order = 1,
                AdapterKey = key.ToLowerInvariant(),
                Label = label,
                Type = AdapterVariableTypes.Text,
                IsExecutable = true
            };

            return variable;
        }

        [Obsolete("yenisi kullanılacak")]
        public static AdapterVariable CreateExecutable(int order, string key, string label, string valueType)
        {
            return new AdapterVariable(order, key, label, valueType)
            {
                IsExecutable = true
            };
        }

        public int Order { get; set; }
        public List<AdapterVariableOption> Options { get; set; } = new List<AdapterVariableOption>();

        public AdapterVariable WithLength(int maxLen)
        {
            MaxLength = maxLen;
            return this;
        }

        public AdapterVariable WithLength(int minLen, int maxLen)
        {
            MinLength = minLen;
            MaxLength = maxLen;
            return this;
        }

        public int MaxLength { get; set; }
        public int MinLength { get; set; }

        public AdapterVariable AddOption(AdapterVariableOption option)
        {
            Options.Add(option);
            return this;
        }

        public AdapterVariable AddOption(string key, string label)
        {
            Options.Add(new AdapterVariableOption(key, label));
            return this;
        }

        protected AdapterVariable()
        {

        }

        [Obsolete("yenisi kullanılacak")]
        public AdapterVariable(int order, string key, string label, string valueType)
        {
            Order = order;
            AdapterKey = key?.ToLowerInvariant();
            Label = label;
            Type = valueType;
        }

        #region IsExecutable
        public bool IsExecutable { get; set; }

        IExecutor _executor;
        IReducer _reducer;

        public IExecutor GetExecutor() => _executor;
        public IReducer GetReducer() => _reducer;

        public IDictionary<string, object> Executor
        {
            get { return _executor.ToDict(); }
            set { _executor = value.DictToInstance<IExecutor>(); }
        }

        public IDictionary<string, object> Reducer
        {
            get { return _reducer.ToDict(); }
            set { _reducer = value.DictToInstance<IReducer>(); }
        }

        public AdapterVariable WithExecutor(IExecutor executor)
        {
            _executor = executor;
            IsExecutable = true;
            return this;
        }

        public AdapterVariable WithReducer(IReducer reducer)
        {
            _reducer = reducer;
            return this;
        }

        public string ExecuteAndReduceValue(ExecutorContext ctx)
        {
            if (!IsExecutable) throw new AdapterException("Degisken executable degil!");
            if (ctx.Adapter == null) throw new AdapterException("adapter bos olamaz!");
            if (_reducer == null) throw new AdapterException("Reducer bos olamaz!");
            if (_executor == null) throw new AdapterException("Executor bos olamaz!");

            FillPropsOf(_executor, ctx.Adapter);
            FillPropsOf(_reducer, ctx.Adapter);

            var executionResult = _executor.Execute(ctx);
            var reducedResult = _reducer.Reduce(executionResult);

            Value = reducedResult;
            return reducedResult;
        }

        private void FillPropsOf(object target, Adapter adapter)
        {
            var props = target.GetType().GetProperties();
            foreach (var prop in props)
            {
                var value = prop.GetValue(target)?.ToString();
                if (value == null) continue;
                if (value.Contains("${"))
                {
                    string newValue = _textEngine.Fill(value, adapter);
                    prop.SetValue(target, newValue);
                }
            }
        }
        #endregion

        #region IsCollectable 
        public bool IsCollectable { get; set; } = false;
        public string CollectionTemplate { get; set; } = "";
        public string CollectionTemplateContentType { get; set; } = "application/json";

        public IEnumerable<AdapterVariable> Variables { get; set; } = new List<AdapterVariable>();
        public string CollectionSeperator { get; set; }

        public string Collect(AdapterValueStore valstore)
        {
            if (!IsCollectable) throw new Exception("Degisken collectable degil!");

            List<AdapterValueStore> stores = valstore.GetCollection(AdapterKey);

            var templates = new List<string>();
            foreach (AdapterValueStore store in stores)
            {
                var storeVals = store.Values;
                storeVals = storeVals.ToDictionary(x => x.Key.ToLowerInvariant(), x => x.Value);
                var replacedTemplate = _textEngine.ReplaceWithValues(CollectionTemplate, storeVals);
                templates.Add(replacedTemplate);
            }
            var collectedValue = string.Join(CollectionSeperator, templates);
            Value = collectedValue;
            return Value;
        }

        public string FillValueWithCollection(IEnumerable<AdapterValueStore> rows)
        {
            if (!IsCollectable) throw new Exception("Degisken executable degil!");

            var templates = new List<string>();
            foreach (AdapterValueStore row in rows)
            {
                var storeVals = row.Values;
                var replacedTemplate = _textEngine.ReplaceWithValues(CollectionTemplate, storeVals);
                templates.Add(replacedTemplate);
            }
            var collectedValue = string.Join(CollectionSeperator, templates);
            Value = collectedValue;
            return collectedValue;
        }
        #endregion

        TextEngine _textEngine = new TextEngine();

        public override string ToString()
        {
            return AdapterKey + $"(CanFillValue:{CanFillValue()}) (Collectable:{IsCollectable}) (Executable:{IsExecutable}) {CollectionTemplate}" + " : " + Value;
        }

        public Stack<(AdapterVariable, List<AdapterValueStore>)> Collect2(AdapterValueStore store, Stack<(AdapterVariable, List<AdapterValueStore>)> stack)
        {
            var all = AllCollectableVariables();

            foreach (var row in store.Rows)
            {
                Console.WriteLine(row.Key);
                Console.WriteLine(row.Value.ToJson());

                List<AdapterValueStore> rowValues = row.Value;

                AdapterVariable? foundVar = all.FirstOrDefault(x => x.AdapterKey == row.Key);

                if (foundVar != null)
                {
                    Console.WriteLine(foundVar.ToJson());
                    Console.WriteLine(foundVar.Value);
                    stack.Push((foundVar, row.Value));
                }

                Console.WriteLine();

                var nestedStores = row.Value;

                foreach (var nestedStore in nestedStores)
                {
                    Collect2(nestedStore, stack);
                }
            }

            return stack;
        }
        public IEnumerable<AdapterVariable> AllCollectableVariables(IEnumerable<AdapterVariable> given = null)
        {
            var result = new List<AdapterVariable>();
            if (given == null)
            {
                var temp = new List<AdapterVariable>();
                temp.AddRange(Variables);
                temp.Add(this);
                given = temp;
            }
            result.AddRange(given);

            foreach (var variable in given)
            {
                if (variable.Variables == null) continue;
                if (variable.Variables.Count() == 0) continue;

                IEnumerable<AdapterVariable> nestedResult = AllCollectableVariables(variable.Variables);
                result.AddRange(nestedResult);
            }
            return result.Where(x => x.IsCollectable).Distinct();
        }

        public bool CanFillValue()
        {
            if (!string.IsNullOrWhiteSpace(Value)) return true;
            if (!string.IsNullOrWhiteSpace(DefaultValue)) return true;
            if (Executor is not null)
            {
                Executor.TryGetValue("_Type", out var _executorType);

                if (_executorType is "TargetFieldExecutor")
                {
                    return false;
                }
                return true;

            }
            return false;
        }

        public string FillValue(ExecutorContext ctx)
        {
            if (!string.IsNullOrWhiteSpace(Value)) return Value;
            if (string.IsNullOrWhiteSpace(Value))
            {
                if (!string.IsNullOrWhiteSpace(DefaultValue)) return DefaultValue;
                if (Executor != null)
                {
                    return ExecuteAndReduceValue(ctx) == "" ? Type : ExecuteAndReduceValue(ctx);
                }
            }
            return Type;
        }

        public AdapterPart FindPart(Adapter adapter)
        {
            foreach (var part in adapter.Parts)
            {
                foreach (var variable in part.Variables)
                {
                    if (variable.AdapterKey.ToLowerInvariant() == AdapterKey.ToLowerInvariant())
                    {
                        return part;
                    }
                }
            }

            return null;
        }
    }
}
