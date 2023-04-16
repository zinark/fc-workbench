using FCHttpRequestEngine.Extensions;
using Newtonsoft.Json.Linq;

namespace FCHttpRequestEngine.Adapters.Reducers
{
    public class XmlResponseReducer : Reducer
    {
        public string TargetField { get; set; } = "target_field";
        public string NullValue { get; set; }
        public string TrimValue { get; set; } = "yes";

        public override string Reduce(string text)
        {
            if (string.IsNullOrWhiteSpace(TargetField)) throw new AdapterException("XmlResponseReducer.TargetField bos olamaz!");
            if (string.IsNullOrWhiteSpace(text)) throw new AdapterException("XmlResponseReducer.text bos olamaz!");

            string jsonText = text.XmlToJson();

            JObject jObj = JObject.Parse(jsonText);
            var targetFieldObj = jObj.SelectToken(TargetField);

            var (success, obj) = jsonText.TryToParseJson<Dictionary<string, object>>();
            if (!success) throw new AdapterException("Verilen metin json obje olmasi gerekiyor! {0}", new { jsonText });

            if (targetFieldObj is null)
            {
                if (string.IsNullOrWhiteSpace(NullValue))
                {
                    throw new AdapterException("Gonderilen hedef alan {0} json object icinde bulunamadi! NullValue Degerini doldurup bulunmadigi durumda deger verebilirsiniz!", new { TargetField });
                }
                return Trim(NullValue);
            }

            switch (targetFieldObj.Type)
            {
                case JTokenType.Array:
                    var jArray = (JArray)targetFieldObj; return Trim(jArray.ToString());
                case JTokenType.Object:
                    var jObject = (JObject)targetFieldObj; return Trim(jObject.ToString());
                default:
                    var targetFieldValue = ((JValue)targetFieldObj).Value; return Trim(targetFieldValue.ToString());
            }
        }

        private string Trim(string value)
        {
            if (string.IsNullOrWhiteSpace(value)) return value;
            if (string.IsNullOrWhiteSpace(TrimValue)) return value;
            if (TrimValue.ToLowerInvariant() != "yes") return value;
            return value.Trim();
        }
    }
}