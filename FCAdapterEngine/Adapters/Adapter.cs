using FCHttpRequestEngine.Adapters.Executors;
using FCHttpRequestEngine.Extensions;

namespace FCHttpRequestEngine.Adapters
{
    public class Adapter : HasRefNo
    {
        public (int code, string response, object description) Execute(string requestCode, AdapterValueStore valueStore)
        {
            var request = Requests.FirstOrDefault(x => x.Code == requestCode);
            if (request == null) throw new AdapterException("{0} bulunamadi! {1}", new
            {
                VerilenIstekKodu = requestCode,
                KullanilabilirIstekKodlari = Requests.Select(x => x.Code).ToList()
            });


            // var requiredPart = Parts.Where(x => x.Name == request.RequiredPart).FirstOrDefault();

            FillDefaultValuesIfValueEmpty();
            FillValues(valueStore);
            FillWithExecutables(ExecutorContext.Create(this, valueStore), request);
            ValidateMissingFields(request);


            (int code, string response, object description) = request.Execute(this);

            return (code, response, description);

        }
        protected Adapter()
        {

        }
        public static Adapter Empty(string name)
        {
            return new Adapter()
            {
                Name = name
            };
        }
        public static Adapter Create(string name)
        {
            var adapter = new Adapter()
            {
                Name = name
            };

            //adapter.CreatePart("CONNECTION-UI")
            //    .AddVariable(AdapterVariable.Create("user", "Kullanıcı").Required().WithLength(3, 255).WithHint("Servise login olurken gereken kullanıcı adı"))
            //    .AddVariable(AdapterVariable.Create("password", "Parola").Required().WithLength(3, 255).WithHint("Servise login olurken gereken parola"))
            //    .AddVariable(AdapterVariable.Create("apikey", "API Anahtarı").Required().WithLength(3, 255).WithHint("Servise login olurken gereken anahtar"))
            //    ;

            //adapter.CreatePart("ORDER-UI");
            //adapter.CreatePart("INTERNAL-PARAMS")
            //    .AddVariable(AdapterVariable.Create("baseUrl", "Servis Adresi")
            //    .Hidden()
            //    .Required()
            //    .WithDefaultValue("https://dev.api.com")
            //    .WithHint("Servis Adresi")
            //    .WithType(x => x.SELECT)
            //    .AddOption(new AdapterVariableOption("https://dev.api.com", "dev"))
            //    .AddOption(new AdapterVariableOption("https://live.api.com", "prod")));

            //adapter.CreatePart("SHARED-PARAMS");

            //adapter.CreatePart("SEND-PARAMS");
            //adapter.CreatePart("QUERY-PARAMS");
            //adapter.CreatePart("BARCODE-PARAMS");

            //adapter.CreatePart("PICKUP-PARAMS");
            //adapter.CreatePart("HTS-PARAMS");

            //adapter.CreateRequest("send", "${baseUrl}/send")
            //    .WithTitle("Kargo Olustur");

            //adapter.CreateRequest("query", "${baseUrl}/query")
            //    .WithTitle("Kargo Sorgula");

            //adapter.CreateRequest("barcode", "${baseUrl}/barcode")
            //    .WithTitle("Barkod olustur");

            //adapter.CreateRequest("hts", "${baseUrl}/hts")
            //    .WithTitle("HTS olustur");

            //adapter.CreateRequest("pickup", "${baseUrl}/pickup")
            //    .WithTitle("Kargo Iade");
            return adapter;
        }

        public AdapterRequest FindRequest(string requestCode)
        {
            return Requests.FirstOrDefault(x => x.Code == requestCode);
        }

        public bool ContainsRequest(string requestCode)
        {
            return Requests.Where(x => x.Code == requestCode).Count() > 0;
        }

        public AdapterPart CreatePart(string partName)
        {
            var part = new AdapterPart()
            {
                Name = partName
            };
            Parts.Add(part);
            return part;
        }

        public AdapterRequest CreateRequest(string code, string url)
        {
            var found = Requests.Where(x => x.Code == code).FirstOrDefault();
            if (found != null) throw new AdapterException("{0} istek zaten var!", new { code });

            var req = AdapterRequest.Create(code, url);
            Requests.Add(req);
            return req;
        }

        public void FillValues(AdapterValueStore valueStore)
        {
            if (valueStore == null) return;
            var collectableVars = AllRootVariables().Where(x => x.IsCollectable);
            foreach (var collectableVariable in collectableVars)
            {
                collectableVariable.Value = collectableVariable.Collect(valueStore);
            }

            valueStore.FillAdapter(this);
        }

        public Adapter SetValue(string key, string value)
        {
            var found = AllRootVariables().FirstOrDefault(x => x.AdapterKey.ToLowerInvariant() == key.ToLowerInvariant());
            if (found != null)
            {
                found.Value = value;
            }

            return this;
        }

        public IEnumerable<AdapterVariable> FindRootVariables(params string[] variableKeyNames) //FindRootVariables
        {
            return AllRootVariables().Where(x => variableKeyNames.Select(x => x.ToLowerInvariant()).Contains(x.AdapterKey.ToLowerInvariant())).ToList();
        }

        public IEnumerable<AdapterVariable> FindAllVariables(params string[] variableKeyNames)
        {
            return AllVariables().Where(x => variableKeyNames.Select(x => x.ToLowerInvariant()).Contains(x.AdapterKey.ToLowerInvariant())).ToList();
        }

        public Adapter WithoutRequests()
        {
            Adapter clone = (Adapter)MemberwiseClone();
            clone.Requests = null;
            return clone;
        }

        void FillDefaultValuesIfValueEmpty()
        {
            Dictionary<string, string> log = new Dictionary<string, string>();

            foreach (var v in AllRootVariables())
            {
                var default_value_is_not_empty = !string.IsNullOrWhiteSpace(v.DefaultValue);
                var value_is__empty = string.IsNullOrWhiteSpace(v.Value);

                if (default_value_is_not_empty && value_is__empty)
                {
                    v.Value = v.DefaultValue;
                    log[v.AdapterKey] = v.DefaultValue;
                }
            }
            OnFillDefaultValuesIfEmpty("FillDefaultValuesIfValueEmpty", "default degerle doldurulanlar", log.ToJson(true));
        }

        void FillWithExecutables(ExecutorContext ctx, AdapterRequest request)
        {
            List<string> executionLog = new();
            var varnames = _textEngine.FindVariables(request);

            var executable_variables = ExecutableVariables().Where(x => varnames.Contains(x.AdapterKey.ToLowerInvariant())).ToList();

            foreach (AdapterVariable exec_var in executable_variables)
            {
                executionLog.Add("Executor of : " + exec_var.AdapterKey + " " + exec_var.Executor.ToJson(true));
                executionLog.Add("Reducer of : " + exec_var.AdapterKey + " " + exec_var.Reducer.ToJson(true));
                ctx = ctx.WithVariable(exec_var);

                var value = exec_var.ExecuteAndReduceValue(ctx);
                executionLog.Add("Result : " + value);
            }

            OnFillWithExecutable("FillWithExecutables", "çalışma logu", executionLog.ToJson(true));
        }

        void ValidateMissingFields(AdapterRequest request)
        {
            var varnames = _textEngine.FindVariables(request);

            var vars = AllRootVariables().Where(x => varnames.Contains(x.AdapterKey.ToLowerInvariant())).ToList();

            List<string> missingFields = new List<string>();
            foreach (var v in vars)
            {
                if (v.IsRequired && string.IsNullOrWhiteSpace(v.Value))
                {
                    var title = $"*** {v.AdapterKey} [{v.Type}] ({v.MaxLength})" + Environment.NewLine;
                    title += $"{v.Hint}" + Environment.NewLine;
                    title += $"{string.Join(Environment.NewLine, v.Options.Select(x => x.Value + " : " + x.Label))}" + Environment.NewLine;

                    title += Environment.NewLine;
                    title += Environment.NewLine;
                    missingFields.Add(title);
                }
            }

            if (missingFields.Count > 0)
            {
                throw new AdapterException($"Gerekli alanlar :" + Environment.NewLine +
                    $"{string.Join("", missingFields)}");
            }
        }

        public string FindValue(string key)
        {
            var found = AllRootVariables().FirstOrDefault(x => x.AdapterKey.ToLowerInvariant() == key.ToLowerInvariant());
            if (found == null)
            {
                throw new AdapterException("Adapter'deki key bulunamadi! {0}", new { key });
            }

            return found.Value?.ToString();
        }

        TextEngine _textEngine = new TextEngine();
        public List<AdapterPart> Parts { get; set; } = new List<AdapterPart>();
        public List<AdapterRequest> Requests { get; set; } = new List<AdapterRequest>();
        public string Name { get; set; }

        public AdapterPart FindPart(AdapterVariable variable)
        {
            foreach (var part in Parts)
            {
                foreach (var v in part.Variables)
                {
                    if (variable.AdapterKey == v.AdapterKey) return part;
                }
            }

            return null;
        }

        public IEnumerable<AdapterVariable> AllRootVariables() => Parts.SelectMany(x => x.Variables).ToList();

        public IEnumerable<AdapterVariable> AllVariables()
        {
            var traverser = new Traverser<AdapterVariable>();
            traverser.TraverseAll(AllRootVariables(), x => x.Variables);
            IEnumerable<AdapterVariable> result = traverser.GetStack();
            return result;
        }

        public IEnumerable<AdapterVariable> ExecutableVariables()
        {
            var traverser = new Traverser<AdapterVariable>();
            traverser.TraverseAll(AllRootVariables(), x => x.Variables);
            IEnumerable<AdapterVariable> result = traverser.GetStack();
            result = result.Where(x => x.IsExecutable);
            return result;
        }

        protected virtual void OnFillDefaultValuesIfEmpty(string label, string desc, string body)
        {
        }
        protected virtual void OnFillWithExecutable(string label, string desc, string body)
        {
        }

    }
}
