using FCHttpRequestEngine.Extensions;

namespace FCHttpRequestEngine.TextMappers
{
    public class StandardMapping : DataMapping, IDataMapping
    {
        public StandardMapping()
        {
        }

        public string Map(string source, string target)
        {
            string value = null;

            value = source.GetValueFromJsonText(From);

            if (target.ContainsJsonPath(To))
            {
                target = target.SetValueOfJsonText(To, value);
            }
            return target;
        }

    }
}
