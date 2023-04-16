using FCHttpRequestEngine.Extensions;

namespace FCHttpRequestEngine
{
    public class AdapterException : Exception
    {
        public string Message { get; set; }
        public object Data { get; set; }
        public string ErrorCode { get; private set; }

        public AdapterException(string message, object data = null) : base(string.Format(message, GetArgs(data)))
        {
            ErrorCode = string.Format("{0:X}", message.GetHashCode());
            Message = string.Format(message, GetArgs(data));
            Data = data;

        }

        private static object[] GetArgs(object data)
        {
            if (data is string) return new[] { data };
            if (data is int) return new[] { data };

            var result = new List<string>();
            if (data == null) return result.ToArray();

            var props = data.GetType().GetProperties();
            foreach (var prop in props)
            {
                var key = prop.Name.ToString();
                var value = prop.GetValue(data)?.ToJson();

                result.Add($"{key}={value}");
            }

            return result.ToArray();
        }
    }
}
