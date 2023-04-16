using FCHttpRequestEngine.Extensions;
using Newtonsoft.Json.Linq;

namespace FCHttpRequestEngine.Adapters.Reducers
{
    public class JsonResponseReducer : Reducer
    {
        public string TargetField { get; set; } = "target_field";
        public string NullValue { get; set; }
        public override string Reduce(string text)
        {
            if (string.IsNullOrWhiteSpace(TargetField)) throw new AdapterException("JsonResponseReducer.TargetField bos olamaz!");
            if (string.IsNullOrWhiteSpace(text)) throw new AdapterException("JsonResponseReducer'e verilen text bos olamaz!");

            var (success, obj) = text.TryToParseJson<Dictionary<string, object>>();
            if (!success) throw new AdapterException("Gönderilen verinin json obje olmasi gerekiyor! {0}", new { gonderilen = text });

            JObject jObj = JObject.Parse(text);
            var targetFieldObj = jObj.SelectToken(TargetField);

            if (targetFieldObj is null)
            {
                if (string.IsNullOrWhiteSpace(NullValue))
                {
                    throw new AdapterException("JsonResponseReducer'da Gonderilen hedef alan {0} json object icinde bulunamadi! Nullvalue verip bos oldugu durumlar icin standart bir sonuc verebilirsiniz", new { TargetField });
                }
                return NullValue;
            }

            switch (targetFieldObj.Type)
            {
                case JTokenType.Array: var jArray = (JArray)targetFieldObj; return jArray.ToString();

                case JTokenType.Object: var jObject = (JObject)targetFieldObj; return jObject.ToString();

                default: var targetFieldValue = ((JValue)targetFieldObj).Value; return targetFieldValue.ToString();
            }
        }
    }
}