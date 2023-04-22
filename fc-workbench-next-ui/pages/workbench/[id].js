import React, {useEffect, useState} from 'react';
import {WorkbenchService} from "../../fc-workbench/service/WorkbenchService";
import {useRouter} from 'next/router'
import {TabPanel, TabView} from "primereact/tabview";
import {Menubar} from "primereact/menubar";
import {ListBox} from "primereact/listbox";
import {Chip} from "primereact/chip";
import Link from "next/link";
import {Button} from "primereact/button";
import {BreadCrumb} from "primereact/breadcrumb";

const Workbench = (props) => {
    const router = useRouter()
    const {id} = router.query
    const breadcrumbHome = {icon: 'pi pi-home', to: '/'};
    const breadcrumbItems = [
        {label: <Link href={"/workbenchs"}> Workbenchs </Link>},
        {label: <Link href={"/workbench/" + id}> Workbench ({id}) </Link>},
    ];

    const screenMenuItems = [
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
    const adapterMenuItems = [
        {
            label: 'New',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'Adapter',
                    icon: 'pi pi-fw pi-plus',
                }
            ]
        },
        {
            label: 'Import OpenApi',
            icon: 'pi pi-fw pi-file-import'
        },
        {
            label: 'Save',
            icon: 'pi pi-fw pi-save'
        }
    ];
    const [bench, setBench] = useState([]);
    const [screenCount, setScreenCount] = useState(0)
    const [adapterCount, setAdapterCount] = useState(0)


    const refresh_workbenchs = async () => {
        let data = await WorkbenchService.getWorkbench(id)
        setBench(data)
        setScreenCount(data.screens.length)
        setAdapterCount(data.adapters.length)
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
            <div className="flex align-items-center justify-content-center">
                <Button icon="pi pi-trash" tooltip={"Delete"} severity="danger" outlined/>
                <Link href={"/screen/" + bench.id + "/" + screen.id}>
                    <Button icon="pi pi-file-edit" tooltip={"Edit"}/>
                </Link>
            </div>

            {screen.items && screen.items.length > 0 &&
                <div style={{marginTop: "20px"}}>
                    <ListBox options={screen.items.map(x => ({name: <ScreenItem item={x}/>, code: x.text}))}
                             optionLabel="name"/>
                </div>
            }
        </div>
    }

    const Adapter = (props) => {
        let adapter = props.adapter
        console.log(adapter)
        return <div className="card" style={{margin: "5px"}}>
            <h5>{adapter.name}</h5>
            <pre className="text-sm">{adapter.id}</pre>
            <div className="flex align-items-center justify-content-center">
                <Button icon="pi pi-trash" tooltip={"Delete"} severity="danger" outlined/>
                <Link href={"/adapter/" + bench.id + "/" + adapter.id}>
                    <Button icon="pi pi-file-edit" tooltip={"Edit"}/>
                </Link>
            </div>

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
            <BreadCrumb home={breadcrumbHome} model={breadcrumbItems}/>
            <div className="card">
                <h5>Workbench {id}</h5>
                <TabView>
                    <TabPanel header={"Screens (" + screenCount + ")"}>
                        <Menubar model={screenMenuItems}></Menubar>
                        <div className="card">
                            <ScreenGrid></ScreenGrid>
                        </div>
                        <pre> {JSON.stringify(bench.screens, null, 2)} </pre>
                    </TabPanel>
                    <TabPanel header={"Adapters (" + adapterCount + ")"}>
                        <Menubar model={adapterMenuItems}></Menubar>
                        <div className="card">
                            <AdapterGrid></AdapterGrid>
                        </div>
                        <pre> {JSON.stringify(bench.adapters, null, 2)} </pre>

                    </TabPanel>
                </TabView>
            </div>
        </>
    );
};

export default Workbench;
