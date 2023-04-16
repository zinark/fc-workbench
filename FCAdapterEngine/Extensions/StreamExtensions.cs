namespace FCHttpRequestEngine.Extensions
{
    public static class StreamExtensions
    {
        public static T Parse<T>(this Stream stream)
        {
            using (var reader = new StreamReader(stream))
            {
                var content = reader.ReadToEndAsync().Result;
                // var content = reader.ReadToEnd();
                return content.ParseJson<T>();
            }
        }
    }
}
