import {InputText} from "primereact/inputtext";
import {Tree} from "primereact/tree";
import React, {useState} from "react";
import {Utils} from "../service/Utils";
import Enumerable from 'linq'

const AdapterVariablesTreeView = (props) => {
    let adapter = props.adapter
    let parts = adapter.parts ?? []

    const [keywordPart, setKeywordPart] = useState(null)

    const filterVariables = (variables) => {
        if (keywordPart && keywordPart.length > 0) {
            variables = Enumerable.from(variables).where(x => x.adapterKey.toLocaleLowerCase().indexOf(keywordPart.toLocaleLowerCase()) >= 0)
        }
        return variables
    };

    const AdapterVariable = (props) => {
        let variable = props.data

        // TODO : slow impl

        const list = []
        // adapter.requests.map(req => {
        //     if (req.content.indexOf(variable.adapterKey) > 0) list.push(req);
        // })
        return <div className="p-0 m-0"> {variable.adapterKey} <br/>

            {/*{list.map((x, ix) =>*/}
            {/*    <Link key={ix}*/}
            {/*          href={`/workbench/${1}/adapter/${adapter.refNo}/request/${x.refNo}`}>*/}
            {/*        {x.code}*/}
            {/*    </Link>*/}
            {/*)}*/}
        </div>
    }

    const nodes = Enumerable.from(parts).select(part => ({
        key: part.name,
        label: part.name,
        expanded: true,
        className: 'm-0 p-0',
        icon: "pi pi-fw pi-align-justify",

        children: Utils.MakeRequestNodes(filterVariables(part.variables),
            x => <AdapterVariable data={x}/>,
            "adapterKey",
            '_',
            'pi-dollar')
    })).toArray()

    let onDoubleClick = (x) =>{}
    let onClick = (x) =>{}
    if (props.onDoubleClick) onDoubleClick = props.onDoubleClick;
    if (props.onClick) onClick= props.onClick;

    return <>
        <h4>Parts</h4>
        <InputText value={keywordPart}
                   placeholder="part search"
                   onChange={e => setKeywordPart(e.target.value)}/>

        <Tree value={nodes}
              className="w-full"
              onNodeDoubleClick={onDoubleClick}
              onNodeClick={onClick}
        />
    </>
}

export default AdapterVariablesTreeView