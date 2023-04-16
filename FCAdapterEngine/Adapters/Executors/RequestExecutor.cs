using FCHttpRequestEngine.Adapters.Suggestions;

namespace FCHttpRequestEngine.Adapters.Executors
{
    public class RequestExecutor : Executor, ISuggestable
    {
        public string RequestCode { get; set; } = "request_code";

        public override string Execute(ExecutorContext ctx)
        {
            if (string.IsNullOrWhiteSpace(RequestCode))
            {
                throw new AdapterException("{0} degiskeni icin kullanilan 'RequestExecutor' RequestCode bos verilmis!", new
                {
                    Variable = ctx.Variable.AdapterKey
                });
            }

            var foundRequest = ctx.Adapter.Requests.Where(x => x.Code == RequestCode).FirstOrDefault();
            if (foundRequest == null) throw new AdapterException("Request bulunamadi!", RequestCode);

            var (code, response, desc) = foundRequest.Execute(ctx.Adapter);
            if (code != 200) throw new AdapterException("Request basarili sekilde calismadi!", desc);
            return response;
        }

        public Suggestion BuildSuggestions(Adapter adapter)
        {
            var requestCodes = adapter.Requests
                .Select(x => new SuggestionValue()
                {
                    Value = x.Code,
                    Description = $"{x.Title} {x.Method} {x.Url}"
                })
                .ToList();

            return new Suggestion()
            {
                { "RequestCode", requestCodes }
            };
        }
    }
}