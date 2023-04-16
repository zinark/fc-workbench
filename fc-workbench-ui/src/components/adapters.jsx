import {Requests} from "../Requests";
import {useEffect, useState} from "react";

export function Adapters() {

    const REQUESTS = new Requests();
    const [adapters, setAdapters] = useState([]);

    const handleOnLoad = async () => {
        let reply = await REQUESTS.searchAdapters(1);
        setAdapters(reply.adapters);
    };

    const RenderVariable = (v) => {
        return <li> {v.adapterKey} [{v.type}]</li>
    };
    const RenderPart = (part) => {
        return <li>
            {part.name} ({part.variables.length})
            <ul>
                {part.variables.map(RenderVariable)}
            </ul>
        </li>
    };
    const RenderRequest = (req) => {
        return <li> {req.method} {req.code} </li>
    };
    const RenderAdapter = (adapter) => {
        return <>
            <h1>{adapter.name}</h1>
            <h2>Requests</h2>
            <ul>
                {adapter.requests.map(RenderRequest)}
            </ul>

            <h2>Parts</h2>
            <ul>
                {adapter.parts.map(RenderPart)}
            </ul>
        </>
    };

    useEffect(() => {
        handleOnLoad();
    }, [])

    return <div>
        <h2> Adapters </h2>
        {adapters.map(RenderAdapter)}
    </div>
}