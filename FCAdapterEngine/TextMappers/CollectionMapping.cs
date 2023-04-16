using FCHttpRequestEngine.Extensions;
using Newtonsoft.Json.Linq;

namespace FCHttpRequestEngine.TextMappers
{
    public class CollectionMapping : DataMapping, IDataMapping
    {
        public CollectionMapping()
        {
        }

        public string Map(string source, string target)
        {
            Console.WriteLine($"{From} -> {To}");

            var targetObject = JObject.Parse(target);
            var targetRow = targetObject.SelectToken(To).ToArray().FirstOrDefault();
            if (targetRow == null) throw new AdapterException("Liste icinde bir item tanimlanmis olmali! Liste bos! {0}", new { To });
            var js_target = targetRow.ToString();

            List<string> targetKeys = new();
            foreach (var row in targetRow)
            {
                var key = row.Path.Split(".").Last().Trim();
                targetKeys.Add(key);
            }

            var sourceObject = JObject.Parse(source);
            if (sourceObject.SelectToken(From) == null)
            {
                throw new AdapterException("{0} yolu {1} icinde yok!", new { From, source });
            }
            var sourceRows = sourceObject.SelectToken(From).ToList();


            var targetRows = new List<object>();
            foreach (var token in sourceRows)
            {
                var srcJson = token.ToString();

                var parent = new Dictionary<string, Dictionary<string, string>>();
                var targetDict = new Dictionary<string, string>();
                string nameParent = "";
                object toAdd = targetDict;

                foreach (var mapping in Mappings)
                {

                    if (!srcJson.ContainsJsonPath(mapping.From)) continue;
                    var value = srcJson.GetValueFromJsonText(mapping.From);

                    var targetJson = targetRow.ToString();
                    if (!targetJson.ContainsJsonPath(mapping.To)) continue;


                    if (mapping.To.Contains("."))
                    {
                        nameParent = mapping.To.Split(".").First();
                        string keypart = mapping.To.Split(".").Skip(1).First();

                        targetDict.Add(mapping.To.Split(".").Last(), value);
                        if (!parent.ContainsKey(nameParent)) parent = new Dictionary<string, Dictionary<string, string>>() {
                            { nameParent, new Dictionary<string, string>() }
                        };
                        parent[nameParent][keypart] = value;
                        toAdd = parent;
                    }
                    else
                    {
                        targetDict[mapping.To] = value;
                    }
                }



                targetRows.Add(toAdd);
            }

            var builtJson = targetRows.ToJson(true).ParseJson<object>();

            JToken? finalObj = targetObject.SelectToken(To);
            finalObj.Replace(JToken.FromObject(builtJson));
            return targetObject.ToJson(true);
        }
    }
}
