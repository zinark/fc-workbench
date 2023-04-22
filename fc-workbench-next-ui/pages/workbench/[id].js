import React, {useEffect, useState} from 'react';
import {WorkbenchService} from "../../fc-workbench/service/WorkbenchService";
import {useRouter} from 'next/router'
import {TabPanel, TabView} from "primereact/tabview";
import {Menubar} from "primereact/menubar";
import {ListBox} from "primereact/listbox";
import {Chip} from "primereact/chip";

const Workbench = (props) => {
    const nestedMenuitems = [
        {
            label: 'New',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'Screen',
                    icon: 'pi pi-fw pi-plus',
                }
            ]
        },
        {
            label: 'Save',
            icon: 'pi pi-fw pi-save'
        }
    ];
    const [bench, setBench] = useState([]);

    const router = useRouter()
    const {id} = router.query

    const refresh_workbenchs = async () => {
        let data = await WorkbenchService.getWorkbench(id)
        console.log(data);
        setBench(data)
    }
    useEffect(() => {
        refresh_workbenchs()
    }, []);


    const ScreenItem = (props) => {
        let item = props.item
        let icon = "pi-apple"
        if (item.type === "Label") icon = "pi-info"
        if (item.type === "Link") icon = "pi-map"
        if (item.type === "Input") icon = "pi-pencil"
        if (item.type === "Button") icon = "pi-code"
        return <span>
            <span className="col-6">
                <Chip label={item.type} icon={"pi " + icon}/>
            </span>
            <span className="col-6">
                {item.text}
            </span>
        </span>

    }
    const Screen = (props) => {
        let screen = props.screen
        return <div className="card" style={{margin: "5px"}}>
            <h5>{screen.title}</h5>
            <pre className="text-sm">{screen.id}</pre>
            {screen.items && screen.items.length > 0 &&
                <ListBox options={screen.items.map(x => ({name: <ScreenItem item={x}/>, code: x.text}))}
                         optionLabel="name"/>
            }
        </div>
    }

    const Adapter = (props) => {
        let adapter = props.adapter
        console.log(adapter)
        return <div className="card" style={{margin: "5px"}}>
            <h5>{adapter.name}</h5>
            <h6>Parts</h6>
            <pre className="text-sm">{adapter.parts.length}</pre>
            <h6>Requests</h6>
            <pre className="text-sm">{adapter.requests.length}</pre>
        </div>
    }
    const ScreenGrid = () => {
        if (!bench.screens) return
        return <div className="grid">
            {bench.screens.map(x => <Screen key={x.id} screen={x}/>)}
        </div>
    }
    const AdapterGrid = () => {
        if (!bench.adapters) return
        return <div className="grid">
            {bench.adapters.map(x => <Adapter key={x.id} adapter={x}/>)}
        </div>
    }
    return (
        <>
            <div className="card">
                <h5>Workbench {id}</h5>
                <TabView>
                    <TabPanel header="Screens">
                        <Menubar model={nestedMenuitems}></Menubar>
                        <div className="card">
                            <ScreenGrid></ScreenGrid>
                        </div>
                    </TabPanel>
                    <TabPanel header="Adapters">
                        <Menubar model={nestedMenuitems}></Menubar>
                        <div className="card">
                            <AdapterGrid></AdapterGrid>
                        </div>
                    </TabPanel>
                </TabView>
            </div>

            <h5>Adapters</h5>
            <pre>
                {JSON.stringify(bench.adapters, null, 2)}
            </pre>
            <h5>Screens</h5>
            <pre>
                {JSON.stringify(bench.screens, null, 2)}
            </pre>
        </>
    );
};

export default Workbench;
