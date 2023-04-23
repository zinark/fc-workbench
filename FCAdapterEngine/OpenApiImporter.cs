using FCHttpRequestEngine.Adapters;
using FCHttpRequestEngine.Extensions;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Extensions;
using Microsoft.OpenApi.Models;
using Microsoft.OpenApi.Readers;
using Microsoft.OpenApi.Writers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;

namespace FCHttpRequestEngine;

public class OpenApiImporter
{
    public Adapter Import(string url, string definitionContent)
    {
        OpenApiDiagnostic diagnostic;
        var doc = new OpenApiStringReader().Read(definitionContent, out diagnostic);

        Adapter adapter = Adapter.Create(doc.Info.Title);

        AdapterPart part = adapter.CreatePart("INTERNAL");
        foreach (KeyValuePair<string, OpenApiPathItem> pathitem in doc.Paths)
        {
            var pathUrl = pathitem.Key;
            OpenApiPathItem path = pathitem.Value;
            // Console.WriteLine("[ ] " + pathUrl);
            // Console.WriteLine("==================================");
            IDictionary<OperationType, OpenApiOperation>? operations = path.Operations;

            AdapterRequest req = adapter.CreateRequest(pathUrl, "${BASE_URL}" + pathUrl);
            var modPath = pathUrl.Replace("/", "_").Replace("-", "").ToLowerInvariant().Trim('_');

            req.Title = pathUrl;

            foreach (var operationItem in operations)
            {
                OperationType opType = operationItem.Key;
                OpenApiOperation op = operationItem.Value;

                OpenApiRequestBody? request = op.RequestBody;
                OpenApiResponse? response = op.Responses.Where(x => x.Key == "200").FirstOrDefault().Value;

                // Console.WriteLine("METHOD " + opType);
                req.WithMethod(opType.ToString().ToUpper());

                string jsRequest = "", jsResponse = "";
                if (request != null)
                {
                    foreach (KeyValuePair<string, OpenApiMediaType> bc in request?.Content.Where(x =>
                                 x.Key == "application/json"))
                    {
                        var contentType = bc.Key;
                        OpenApiSchema? schema = bc.Value.Schema;

                        // Console.WriteLine("* REQUEST " + schema.Reference.ReferenceV3);
                        var dict = ConvertToProps(schema.Properties);

                        foreach (var (prop, type) in dict)
                        {
                            var modProp = modPath + "_" + prop;
                            modProp = modProp.ToLowerInvariant();
                            AdapterVariable variable = null;
                            if (type.ToString() == "integer")
                                variable = AdapterVariable
                                    .Create(modProp, modProp)
                                    .WithType(x => x.NUMBER)
                                    .Required();

                            if (type.ToString() == "float")
                                variable = AdapterVariable
                                    .Create(modProp, modProp)
                                    .WithType(x => x.NUMBER)
                                    .Required();
                            if (type.ToString() == "string")
                                variable = AdapterVariable
                                    .Create(modProp, modProp)
                                    .WithType(x => x.TEXT)
                                    .Required();

                            if (type.ToString() == "array")
                                variable = AdapterVariable
                                    .CreateCollectable(modProp, "{}", "")
                                    .WithType(x => x.TEXT);

                            if (variable != null)
                            {
                                part = part.AddVariable(variable);
                            }

                            dict[prop] = "${" + modProp + "}";
                        }

                        jsRequest = JsonConvert.SerializeObject(dict, Formatting.Indented);
                    }
                }


                if (response != null)
                {
                    foreach (var bc in response?.Content.Where(x => x.Key == "application/json"))
                    {
                        var contentType = bc.Key;
                        OpenApiSchema? schema = bc.Value.Schema;
                        var r = schema.Reference.ReferenceV3;
                        var dict = ConvertToProps(schema.Properties);
                        jsResponse = JsonConvert.SerializeObject(dict, Formatting.Indented);
                        // Console.WriteLine("* RESPONSE " + schema.Reference.ReferenceV3);
                    }
                }

                // Console.WriteLine(jsRequest);
                // Console.WriteLine(jsResponse);
                req.WithBody(jsRequest);
            }

            Console.WriteLine();
            Console.WriteLine();
        }

        return adapter;
    }

    private Dictionary<string, object> ConvertToProps(IDictionary<string, OpenApiSchema> schemaProperties,
        string prefix = "")
    {
        Dictionary<string, object> result = new();
        foreach (var x in schemaProperties)
        {
            if (x.Value.Properties.Count() > 0)
            {
                result[prefix + x.Key] = ConvertToProps(x.Value.Properties, x.Key + "_");
            }
            else
            {
                result[prefix + x.Key] = x.Value.Type;
            }
        }

        return result;
    }
}