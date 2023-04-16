namespace FCHttpRequestEngine.Adapters.Reducers
{

    public class FormatPhoneReducer : Reducer
    {
        public string InputFormat { get; set; } = "############";
        public string OutputFormat { get; set; } = "{0:+## (###) ### ## ##}";

        public override string Reduce(string text)
        {
            if (string.IsNullOrEmpty(text)) return text;

            try
            {
                string phoneNumber = text;

                if (phoneNumber[0] == '5')
                    phoneNumber = phoneNumber.Insert(0, "90");
                else if (phoneNumber[0] == '0')
                    phoneNumber = phoneNumber.Insert(0, "9");
                else if (phoneNumber[0] == '+')
                    phoneNumber = phoneNumber.Remove(0, 1);

                if (phoneNumber.Length != 12)
                    throw new AdapterException("telefon no 12 haneli degil! {0} {1}", new
                    {
                        text,
                        InputFormat
                    });

                var result = string.Format("{0:+## (###) ### ## ##}", double.Parse(phoneNumber));
                return result;
            }
            catch (Exception)
            {
                throw new AdapterException("Telefon numarası 5XXXXXXXXX formatında olmalı ve sadece sayılardan oluşmalı! {0} {1}", new
                {
                    text,
                    InputFormat
                });
            }
        }
    }
}