namespace FCHttpRequestEngine.Adapters.Executors
{
    public class TodayDateExecutor : Executor
    {
        public string Days { get; set; } = "0";
        public override string Execute(ExecutorContext ctx)
        {
            Adapter adapter = ctx.Adapter;
            AdapterVariable variable = ctx.Variable;

            var days = 0;

            if (!int.TryParse(Days, out days))
            {
                throw new AdapterException("Verilen {0} sayi oldugundan emin olun! {1}", new { Days, variable.AdapterKey });
            }

            return DateTime.Now.AddDays(days).ToString("yyyy-MM-dd HH:mm:ss");
        }
    }
}