namespace FCHttpRequestEngine.Adapters.Executors
{
    public class ExecutorContext
    {
        public Adapter Adapter { get; set; }
        public AdapterVariable Variable { get; set; }
        public AdapterValueStore ValueStore { get; set; } = new();

        public static ExecutorContext Create(Adapter adapter, AdapterValueStore valueStore)
        {
            return new ExecutorContext()
            {
                Adapter = adapter,
                ValueStore = valueStore
            };
        }
        public static ExecutorContext Create(Adapter adapter)
        {
            return new ExecutorContext()
            {
                Adapter = adapter,
            };
        }

        public ExecutorContext WithVariable(AdapterVariable variable)
        {
            Variable = variable;
            return this;
        }
    }
}