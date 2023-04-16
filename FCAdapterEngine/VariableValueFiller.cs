using FCHttpRequestEngine.Adapters;
using FCHttpRequestEngine.Extensions;

namespace FCHttpRequestEngine
{
    internal class VariableValueFiller
    {
        private IEnumerable<AdapterVariable> _variables;
        private AdapterValueStore _store;
        TextEngine _textEngine = new TextEngine();

        public Dictionary<string, AdapterVariable> VarHash = new Dictionary<string, AdapterVariable>();

        public VariableValueFiller(AdapterValueStore store, params AdapterVariable[] variables)
        {
            _variables = variables;
            _store = store;

            foreach (var variable in variables)
            {
                FillVarDict(null, new[] { variable });
            }
        }

        public void FillVarDict(AdapterVariable parent, IEnumerable<AdapterVariable> variables)
        {
            foreach (var variable in variables)
            {
                var parentkey = "";
                if (parent != null) parentkey = parent.AdapterKey;
                string genKey = parentkey + "/" + variable.AdapterKey;
                VarHash[genKey] = variable;

                if (variable.Variables == null) continue;
                FillVarDict(variable, variable.Variables);
            }
        }

        public AdapterVariable FindRelatedTemplate(string key)
        {
            Console.WriteLine("find related template : " + key);
            //foreach (var v in _variables)
            //{
            //    Console.WriteLine(key + " : " + v);
            //}

            return null;

        }

        public void Traverse(AdapterValueStore store = null)
        {
            if (store == null) store = _store;

            Console.WriteLine("Store : " + store.ToJson());

            var rows = store.Rows;
            foreach (var row in rows)
            {
                var key = row.Key;
                var foundVariable = FindRelatedTemplate(key);

                Console.WriteLine("\t" + key + " => " + row.Value.ToJson());

                var innerStores = row.Value;
                if (innerStores == null) return;
                if (innerStores.Count() == 0) return;

                foreach (var innerStore in innerStores)
                {
                    Traverse(innerStore);
                }
            }
            Console.WriteLine();
            Console.WriteLine();
        }
    }
}