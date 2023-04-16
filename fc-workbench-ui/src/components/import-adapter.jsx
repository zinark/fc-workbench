import {useState} from "react";
import {Requests} from '../Requests'

export function ImportAdapter() {
    const REQUESTS = new Requests();
    const [baseUrl, setBaseUrl] = useState("https://dev.vepara.com.tr/public");
    const [openApiLink, setOpenApiLink] = useState("https://dev.vepara.com.tr/public/swagger/1.0.0.1/swagger.json");
    const [response, setResponse] = useState("...");


    const handleCreateAdapter = async () => {
        let reply = await REQUESTS.importAdapter(1, baseUrl, openApiLink);
        setResponse(reply);
    };

    return <>
        <h2>fc-workbench</h2>
        <div>
            <span>Workbench</span>
            <div>
                <input
                    id="txtWorkbench"
                    type="url"
                    value={1}
                    style={{width: '90vw'}}/>

            </div>
            <span>Open api Link</span>
            <div>
                <input
                    id="txtOpenApi"
                    type="url"
                    value={openApiLink}
                    onChange={e => setOpenApiLink(e.target.value)}
                    style={{width: '90vw'}}/>

            </div>
            <span>Base Url</span>
            <div>
                <input
                    id="txtBaseUrl"
                    type="url"
                    value={baseUrl}
                    onChange={e => setBaseUrl(e.target.value)}
                    style={{width: '90vw'}}/>

            </div>
            <pre>
                {JSON.stringify(response, null, 4)}
            </pre>

            <div>
                <button onClick={handleCreateAdapter}>Adapter Olustur</button>
            </div>
        </div>
    </>
}