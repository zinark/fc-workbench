using FCHttpRequestEngine.Adapters.Executors;

namespace FCHttpRequestEngine.Adapters;

public class AdapterValueStoreGenerator
{
    private TextEngine _textEngine;
    public AdapterValueStoreGenerator(TextEngine textEngine)
    {
        _textEngine = textEngine;
    }

    public AdapterValueStore Generate(ExecutorContext ctx, AdapterRequest req)
    {
        Adapter adapter = ctx.Adapter;
        IEnumerable<string> fields = _textEngine.FindVariables(req);
        IEnumerable<AdapterVariable> allvars = adapter.FindRootVariables(fields.ToArray()).ToList();

        List<AdapterVariable> vars = new();
        foreach (var variable in allvars.Where(x => x.IsExecutable))
        {
            string requestCode = GetRequestCode(variable);
            if (string.IsNullOrEmpty(requestCode)) continue;

            AdapterRequest foundRequest = adapter.FindRequest(requestCode);
            if (foundRequest == null) continue;

            IEnumerable<string> foundVarNames = _textEngine.FindVariables(foundRequest);
            IEnumerable<AdapterVariable> foundVars = adapter.FindRootVariables(foundVarNames.ToArray());
            vars.AddRange(foundVars);
        }

        vars.AddRange(allvars);

        vars = vars.Where(x => !x.CanFillValue()).ToList();
        vars = vars.Distinct().ToList();

        var store = AdapterValueStore.Create();
        foreach (var variable in vars)
        {
            if (variable.IsCollectable)
            {
                var subValue = AdapterValueStore.Create();
                foreach (var subvar in variable.Variables.Where(x => !x.CanFillValue()))
                {
                    subValue.AddValues((subvar.AdapterKey, subvar.FillValue(ctx)));
                }
                store.AddCollection(variable.AdapterKey, subValue);
            }
            else
            {
                store.AddValues((variable.AdapterKey, variable.FillValue(ctx)));
            }
        }

        return store;
    }

    private string GetRequestCode(AdapterVariable variable)
    {
        IExecutor executor = variable.GetExecutor();
        if (executor is not RequestExecutor) return null;
        string requestCode = ((RequestExecutor)executor).RequestCode;
        return requestCode;
    }
}
