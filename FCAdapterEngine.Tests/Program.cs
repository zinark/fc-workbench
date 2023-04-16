// See https://aka.ms/new-console-template for more information

using FCHttpRequestEngine.Adapters;

Console.WriteLine("Hello, World!");
var adapter = Adapter.Create("direct");
adapter.Parts = new List<AdapterPart>();

var reqCall = adapter
    .CreateRequest("call", "http://localhost:12313")
    .WithMethod("POST")
    .WithBody("{}");

//adapter.Execute("call", AdapterValueStore.Create());

var valueStore = AdapterValueStore.Create()
    .AddValue("url", "asdf");

var (code, response, description) = adapter.Execute("call", valueStore);