import {Requests} from "../Requests";
import {useEffect, useState} from "react";

export function Adapters() {

    const REQUESTS = new Requests();
    const [adapters, setAdapters] = useState([]);

    const handleOnLoad = async () => {
        let reply = await REQUESTS.listAdapters(1);
        setAdapters(reply.adapters);
    };

    const RenderAdapter = (x) => {
        return <>
            <h1>{x.name}</h1>
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