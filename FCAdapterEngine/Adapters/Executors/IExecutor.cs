namespace FCHttpRequestEngine.Adapters.Executors
{

    public interface IExecutor
    {
        public string _Type { get; set; }
        string Execute(ExecutorContext ctx);
    }


    public abstract class Executor : IExecutor
    {
        public string _Type { get; set; }
        public Executor()
        {
            _Type = GetType().Name;
        }
        public abstract string Execute(ExecutorContext ctx);
    }
}