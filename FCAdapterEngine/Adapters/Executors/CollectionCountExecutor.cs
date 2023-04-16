namespace FCHttpRequestEngine.Adapters.Executors
{
    public class CollectionCountExecutor : Executor
    {
        public string CollectionVariableKey { get; set; }

        public override string Execute(ExecutorContext ctx)
        {
            //Adapter adapter = ctx.Adapter;
            //IEnumerable<AdapterVariable> founds = adapter.FindRootVariables(CollectableVariableKey);
            //if (founds == null || founds.Count() == 0) throw new ApiException("Collectable Degisken bulunamadi {0}", new { CollectableVariableKey });
            var count = ctx.ValueStore.GetCollection(CollectionVariableKey).Count();
            if (count == 0) return string.Empty;
            return count.ToString();
        }
    }
}