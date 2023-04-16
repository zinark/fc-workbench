using System.Globalization;

namespace FCHttpRequestEngine.Adapters.Reducers
{
    public class FormatMoneyReducer : Reducer
    {
        public string Format { get; set; } = "{0:#.00}";
        public override string Reduce(string text)
        {
            var money = Convert.ToDecimal(text, CultureInfo.InvariantCulture);
            Console.WriteLine(money);
            return string.Format(CultureInfo.InvariantCulture, Format, money);
        }
    }
}