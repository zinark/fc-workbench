import {InputText} from "primereact/inputtext";
import {Tree} from "primereact/tree";
import React, {useRef, useState} from "react";
import {Utils} from "../service/Utils";
import Enumerable from 'linq'
import {Button} from "primereact/button";
import {OverlayPanel} from "primereact/overlaypanel";
import {Toast} from "primereact/toast";

const AdapterVariablesTreeView = (props) => {
    let adapter = props.adapter
    let parts = adapter.parts ?? []
    const op = useRef(null);
    const toast = useRef(null);

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
        return <>
            <div type="button" label={variable.adapterKey} onClick={e => op.current.toggle(e)} severity="success">
                {variable.adapterKey}
            </div>
            <OverlayPanel ref={op}
                          appendTo={typeof window !== 'undefined' ? document.body : null}
                          showCloseIcon
                          id="overlay_panel"
                          style={{width: '450px'}}>
                <div>
                    <h4>{variable.type}</h4>
                    <pre>{JSON.stringify(variable, null, 4)}</pre>
                    <Button className="m-1" label="Save"></Button>
                    <Button className="m-1" label="Close"></Button>
                </div>
                {/*<DataTable value={products} selection={selectedProduct} onSelectionChange={(e) => setSelectedProduct(e.value)} selectionMode="single" responsiveLayout="scroll" paginator rows={5} onRowSelect={onProductSelect}>*/}
                {/*    <Column field="name" header="Name" sortable headerStyle={{ minWidth: '10rem' }} />*/}
                {/*    <Column header="Image" body={imageBodyTemplate} headerStyle={{ minWidth: '10rem' }} />*/}
                {/*    <Column field="price" header="Price" body={priceBodyTemplate} sortable headerStyle={{ minWidth: '8rem' }} />*/}
                {/*</DataTable>*/}
            </OverlayPanel>

            {/*<SplitButton*/}
            {/*    className="p-1 m-1"*/}
            {/*    icon="pi pi-check"*/}
            {/*    tooltip="tool tip"*/}
            {/*    label={variable.adapterKey}></SplitButton>*/}
        </>

        // <div className="p-0 m-0"> {variable.adapterKey} <Button>test</Button>
        //
        //     {/*{list.map((x, ix) =>*/}
        //     {/*    <Link key={ix}*/}
        //     {/*          href={`/workbench/${1}/adapter/${adapter.refNo}/request/${x.refNo}`}>*/}
        //     {/*        {x.code}*/}
        //     {/*    </Link>*/}
        //     {/*)}*/}
        // </div>
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

    let onDoubleClick = (x) => {
        toast.current.show({severity: 'info', summary: 'Event!', detail: 'Double clicked', life: 3000});
    }
    let onClick = (x) => {
    }
    if (props.onDoubleClick) onDoubleClick = props.onDoubleClick;
    if (props.onClick) onClick = props.onClick;

    return <>
        <Toast ref={toast}/>
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