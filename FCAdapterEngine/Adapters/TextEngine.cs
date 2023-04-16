
using System.Text.RegularExpressions;

namespace FCHttpRequestEngine.Adapters
{
    public class TextEngine
    {
        public string Fill(string text, IEnumerable<AdapterVariable> variables)
        {
            var counts = variables.GroupBy(x => x.AdapterKey.ToLowerInvariant())
                .Select(x => new { adapterkey = x.Key, count = x.Count() });

            var more_than_one_key = counts.Where(x => x.count > 1);
            if (more_than_one_key.Count() > 0)
            {
                throw new AdapterException("Ayni key birden fazla kullanilmis! {0}", new
                {
                    keys = string.Join(",", more_than_one_key.Select(x => x.adapterkey).ToList())
                });
            }

            var dict = variables.ToDictionary(x => x.AdapterKey.ToLowerInvariant(), x => x.Value ?? x.DefaultValue);
            return ReplaceWithValues(text, dict);
        }

        public string Fill(string text, Adapter adapter)
        {
            var fieldNames = FindFieldNames(text);
            var allVars = adapter.AllRootVariables();
            var all = allVars.Select(x => x.AdapterKey.ToLowerInvariant()).ToList();
            var requireds = fieldNames;
            var exists = requireds.Where(x => all.Contains(x)).Count();
            if (requireds.Count() != exists)
            {
                throw new AdapterException("Template icindeki parametre adapter icinde tanimli degil! Gerekli={0}, Olanlar={1}", new { requireds, exists });
            }

            var result = Fill(text, allVars);
            return result;
        }

        public IEnumerable<string> FindFieldNames(string text, bool ignoreCase = true)
        {
            var result = new List<string>();
            string pattern = @"\$\{(\w+)\}";
            RegexOptions options = RegexOptions.Multiline;
            foreach (Match m in Regex.Matches(text, pattern, options))
            {
                if (ignoreCase)
                {
                    result.Add(m.Groups[1].Value.ToLowerInvariant());
                    continue;
                }

                result.Add(m.Groups[1].Value);
            }

            return result;
        }

        public void ValidateVariables(string text, Adapter adapter)
        {
            if (string.IsNullOrWhiteSpace(text)) return;

            var variables = FindFieldNames(text);
            var allKeys = adapter.AllRootVariables().Select(x => x.AdapterKey.ToLowerInvariant());

            var missingVariables = variables.Except(allKeys);
            if (missingVariables.Count() > 0)
            {
                throw new AdapterException("Eksik degiskenler var! Adapter icinde degisken acmaniz gerekiyor! \r\n {0}", new { Eksikler = missingVariables });
            }
        }

        public Dictionary<string, string> Fill(Dictionary<string, string> headers, Adapter adapter)
        {

            var result = new Dictionary<string, string>();

            foreach (var key in headers.Keys)
            {
                result[key] = Fill(headers[key], adapter);
            }

            return result;
        }

        public IEnumerable<string> FindVariables(AdapterRequest request)
        {
            var varnames = new List<string>();
            string text = "";
            if (!string.IsNullOrWhiteSpace(request.Content))
            {
                text += request.Content + " ";
            }

            if (request.Headers != null)
            {
                var headValues = request.Headers.Select(x => x.Value);
                text += string.Join(" ", headValues) + " ";
            }

            if (!string.IsNullOrWhiteSpace(request.Url))
            {
                text += request.Url + " ";
            }

            if (request.IsCustomResponse)
            {
                text += request.CustomResponse + " ";
            }


            if (!string.IsNullOrWhiteSpace(text))
            {
                var foundVars = FindFieldNames(text);
                varnames.AddRange(foundVars);
            }

            return varnames.Select(x => x.ToLowerInvariant());

        }

        public string ReplaceWithValues(string text, Dictionary<string, string> dict)
        {
            text = LowercaseFieldNamesInText(text);

            foreach (var key in dict.Keys)
            {
                var target = "${" + key + "}";
                if (text.Contains(target))
                {
                    text = text.Replace(target, dict[key]);
                }
            }
            return text;

        }

        string LowercaseFieldNamesInText(string text)
        {
            var fields = FindFieldNames(text, false);
            foreach (var field in fields)
            {
                text = text.Replace("${" + field + "}", "${" + field.ToLowerInvariant() + "}");
            }
            return text;
        }
    }
}