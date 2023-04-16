import * as PropTypes from "prop-types";
import {useEffect, useState} from "react";

export function AdapterList(props) {
    const adapters = props.data;
    const [selectedAdapter, setAdapter] = useState({});
    const [selectedPart, setPart] = useState({});
    const RenderAdapters = (ix, adapter) => {
        return <option key={ix} value={ix}>{adapter.name}</option>
    };
    const RenderPart = (ix, x) => {
        return <option key={ix} value={ix}>{x.name}</option>
    };

    useEffect(() => {
        setAdapter(adapters[0]);
    }, [adapters])
    const handleAdapterChange = (e) => {
        var adapterIx = e.target.value;
        setAdapter(adapters[adapterIx]);
    };
    return <>
        <div>
            <select onChange={handleAdapterChange}>
                {adapters.map(x => RenderAdapters(adapters.indexOf(x), x))}
            </select>
        </div>
        <div>
            <select>
                {selectedAdapter && selectedAdapter.parts && selectedAdapter.parts.map(x => RenderPart(selectedAdapter.parts.indexOf(x), x))}
            </select>
        </div>
    </>
}

AdapterList.propTypes = {data: PropTypes.arrayOf(PropTypes.any)};