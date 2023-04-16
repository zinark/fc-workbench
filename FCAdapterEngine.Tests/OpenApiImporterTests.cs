using FCHttpRequestEngine;
using FCHttpRequestEngine.Extensions;
using Microsoft.OpenApi.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NJsonSchema;

namespace FCAdapterEngine.Tests;

[TestClass]
public class OpenApiImporterTests
{
    [TestMethod]
    public void import_test()
    {
        var content = File.ReadAllText("public-openapi3.json");
        // var schema = JsonSchema.FromSampleJson(content);
        // schema.ToJson(true).Dump();
        var adapter = new OpenApiImporter().Import("https://dev.vepara.com.tr/public", content);
        adapter.ToJson(true).Dump();
    }
}