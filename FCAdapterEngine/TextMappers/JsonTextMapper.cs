using FCHttpRequestEngine.Extensions;

namespace FCHttpRequestEngine.TextMappers
{

    public class JsonTextMapper
    {
        public string Source { get; set; }
        public string Target { get; set; }

        public List<DataMapping> Mappings = new();

        private JsonTextMapper()
        {

        }

        public static JsonTextMapper Create()
        {
            return new JsonTextMapper()
            {
                Source = "{ src : null }",
                Target = "{ target : null }"
            };
        }

        public JsonTextMapper FromSource(string source)
        {
            Source = source;
            return this;
        }

        public JsonTextMapper ToTarget(string target)
        {
            Target = target;
            return this;
        }

        public string Map(string src)
        {
            string result = Target;

            foreach (DataMapping map in Mappings)
            {
                IDataMapping castedMap = null;
                if (map._Type == typeof(StandardMapping).Name)
                {
                    castedMap = map.ToJson().ParseJson<StandardMapping>();
                }

                if (map._Type == typeof(CollectionMapping).Name)
                {
                    castedMap = map.ToJson().ParseJson<CollectionMapping>();
                }

                result = castedMap.Map(src, result);
            }

            return result;
        }

        public JsonTextMapper AddMapping(DataMapping mapping)
        {
            Mappings.Add(mapping);
            return this;
        }

        public JsonTextMapper AddMapping(params DataMapping[] mappings)
        {
            foreach (var mapping in mappings)
            {
                AddMapping(mapping);
            }

            return this;
        }

        //public string DumpJson()
        //{
        //    return new
        //    {
        //        Source = _source,
        //        Target = _target,
        //        Mappings = _mappings.Select(x => new
        //        {
        //            _Type = x.GetType().Name,
        //            Params = x.ToJson(true).ParseJson<object>()
        //        })
        //    }.ToJson(true);
        //}



    }
}
