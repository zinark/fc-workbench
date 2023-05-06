namespace FCWorkbench.Api.Controllers;

public class SearchWorkbenchsReply
{
    public class Bench
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Dictionary<string, string> Parameters { get; set; }
        public int AdapterCount { get; set; }
        public int ScreenCount { get; set; }
    }

    public List<Bench> Items { get; set; }
    public int Total { get; set; }
}