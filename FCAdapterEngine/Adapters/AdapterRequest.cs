using FCHttpRequestEngine.TextMappers;

namespace FCHttpRequestEngine.Adapters
{
    public class AdapterRequest : HasUniqueId
    {
        Requester _requester = new Requester();
        TextEngine _textEngine = new TextEngine();

        public string Code { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public Dictionary<string, string> Headers = new();
        public string Content { get; set; }
        public string ContentType { get; set; } = "application/json";
        public string Method { get; set; } = "POST";
        public JsonTextMapper RequestMapper { get; set; }
        public JsonTextMapper ResponseMapper { get; set; }

        public string LastSuccessResponse { get; set; }
        public string LastFailureResponse { get; set; }


        private AdapterRequest()
        {

        }

        public static AdapterRequest Create(string code, string url)
        {
            return new AdapterRequest()
            {
                Code = code,
                Url = url,
                IsCustomResponse = false,
                CustomResponse = "{}",
                Content = "{}",
                ContentType = "application/json",
                Headers = new Dictionary<string, string>()
                {
                    { "accept", "application/json" },
                    { "cache-control", "no-cache" }
                },
                LastFailureResponse = "{}",
                LastSuccessResponse = "{}",
                Method = "GET",
                RequestMapper = null,
                ResponseMapper = null,
                Title = "yeni istek : " + code
            };
        }
        public AdapterRequest WithMethod(string method)
        {
            Method = method;
            return this;
        }

        public AdapterRequest WithTitle(string title)
        {
            Title = title;
            return this;
        }


        public AdapterRequest WithBody(string content, string contentType = "application/json")
        {
            Content = content;
            ContentType = contentType;
            return this;
        }

        public AdapterRequest WithHeaders(params (string key, string value)[] headers)
        {
            foreach (var header in headers)
            {
                Headers[header.key] = header.value;
            }
            return this;
        }

        public (int code, string response, object description) Execute(Adapter adapter)
        {
            if (IsCustomResponse)
            {
                _textEngine.ValidateVariables(CustomResponse, adapter);
                var filledCustomResponse = _textEngine.Fill(CustomResponse, adapter);
                return (200, filledCustomResponse, new
                {
                    request = new { },
                    response = filledCustomResponse
                });
            }

            HttpMethod method = HttpMethod.Post;
            if (Method == "GET") method = HttpMethod.Get;
            if (Method == "PUT") method = HttpMethod.Put;
            if (Method == "DELETE") method = HttpMethod.Delete;


            string strHeaders = string.Join(" ", Headers.Values);
            _textEngine.ValidateVariables(Content, adapter);
            _textEngine.ValidateVariables(Url, adapter);
            _textEngine.ValidateVariables(strHeaders, adapter);

            var filledContent = Content;
            if (!string.IsNullOrWhiteSpace(Content))
            {
                filledContent = _textEngine.Fill(Content, adapter);
            }

            var filledUrl = _textEngine.Fill(Url, adapter);
            var filledHeaders = _textEngine.Fill(Headers, adapter);

            // TODO : Not sure this one
            // if (RequestMapper != null) filledContent = RequestMapper.Map(filledContent);

            var (code, response) = _requester
                .WithUrl(filledUrl)
                .WithBody(filledContent, ContentType)
                .WithHeaders(filledHeaders)
                .Execute(method);

            var desc = _requester.Describe();

            return (code, response, desc);
        }

        public AdapterRequest WithRequestMapper(JsonTextMapper mapper)
        {
            RequestMapper = mapper;
            return this;
        }

        public AdapterRequest WithResponseMapper(JsonTextMapper mapper)
        {
            ResponseMapper = mapper;
            return this;
        }

        public AdapterRequest EnableCustomResponse(string mockResponse)
        {
            IsCustomResponse = true;
            CustomResponse = mockResponse;
            return this;
        }
        public bool IsCustomResponse { get; set; }
        public string CustomResponse { get; set; }
    }
}
