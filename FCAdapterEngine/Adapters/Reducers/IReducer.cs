namespace FCHttpRequestEngine.Adapters.Reducers
{
    public interface IReducer
    {
        public string _Type { get; set; }
        string Reduce(string text);
    }

    public abstract class Reducer : IReducer
    {
        public string _Type { get; set; }
        public Reducer()
        {
            _Type = GetType().Name;
        }
        public abstract string Reduce(string text);
    }
}