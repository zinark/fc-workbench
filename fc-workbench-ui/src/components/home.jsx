import {useState} from "react";

export function Home() {
    const [url, setUrl] = useState("https://dev.vepara.com.tr/public/swagger/1.0.0.1/swagger.json");

    const handleChange = (e) => {
        setUrl(e.target.value);
    }

    return <>
        <h2>fc-workbench</h2>
        <div>
            <div>
                <input id="txtOpenApi" type="url" value={url} onChange={handleChange}
                       style={{width: '98vw'}}/>
            </div>
            <div>
                <button>Adapter Olustur</button>
            </div>
        </div>
    </>
}