using System.Globalization;
using FCHttpRequestEngine.Adapters.Suggestions;

namespace FCHttpRequestEngine.Adapters.Reducers
{
    public class FormatDateReducer : Reducer, ISuggestable
    {
        public string InputFormat { get; set; } = "yyyy-MM-dd HH:mm:ss";
        public string OutputFormat { get; set; } = "dd.MM.yy";

        public override string Reduce(string text)
        {
            if (string.IsNullOrEmpty(text)) return text;

            try
            {
                var date = DateTime.ParseExact(text, InputFormat, CultureInfo.InvariantCulture);
                var result = date.ToString(OutputFormat);
                return result;
            }
            catch (Exception)
            {

                throw new AdapterException("Tarih formati inputformata gore okunamadi! {0} {1}", new
                {
                    text,
                    InputFormat
                });
            }
        }

        public Suggestion BuildSuggestions(Adapter adapter)
        {
            var outputFormats = new List<SuggestionValue>()
            {
                new SuggestionValue()
                {
                    Value = "dd.MM.yy",
                    Description = "gun2.ay2.yil2"
                },
                new SuggestionValue()
                {
                    Value = "dd.MM.yy HH:mm:ss",
                    Description = "gun2.ay2.yil2 saat:dakika:saniye"
                },
                new SuggestionValue()
                {
                    Value = "dd.MM.yyyy",
                    Description = "gun2.ay2.yil4"
                },
                new SuggestionValue()
                {
                    Value = "dd-MM-yyyy",
                    Description = "gun2-ay2-yil4"
                },
                new SuggestionValue()
                {
                    Value = "yyyy-MM-dd",
                    Description = "yil4-ay2-gun2"
                }
            };

            return new Suggestion()
            {
                { "OutputFormat", outputFormats }
            };
        }
    }
}