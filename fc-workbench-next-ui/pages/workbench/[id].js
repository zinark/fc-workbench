import React, {useEffect, useRef, useState} from 'react';
import {WorkbenchService} from "../../fc-workbench/service/WorkbenchService";
import {useRouter} from 'next/router'
import {TabPanel, TabView} from "primereact/tabview";
import {Menubar} from "primereact/menubar";
import {Chip} from "primereact/chip";
import Link from "next/link";
import {Button} from "primereact/button";
import {BreadCrumb} from "primereact/breadcrumb";
import {Menu} from "primereact/menu";

const Workbench = (props) => {
    const [bench, setBench] = useState([]);
    const [screenCount, setScreenCount] = useState(0)
    const [adapterCount, setAdapterCount] = useState(0)
    const router = useRouter()
    const {id} = router.query
    const breadcrumbHome = {icon: 'pi pi-home', to: '/'};
    const breadcrumbItems = [
        {label: <Link href={"/workbenchs"}> Workbenchs </Link>},
        {label: <Link href={"/workbench/" + id}> {bench && bench.name} </Link>},
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
        return <div className="col-12">
            <Chip label={item.text} icon={"pi " + icon}/>
        </div>


    }
    const menuScreen = useRef(null);
    const ScreenPanel = (props) => {
        let screen = props.screen
        return <div className="card" style={{margin: "5px"}}>
            <div className="flex justify-content-between align-items-center mb-5">
                <Link href={"/screen/" + bench.id + "/" + screen.id}>
                    <h4>{screen.title}</h4>
                </Link>
                <div>
                    <Button type="button" icon="pi pi-ellipsis-v"
                            className="p-button-rounded p-button-text p-button-plain"
                            onClick={(event) => menuScreen.current.toggle(event)}/>
                    <Menu
                        ref={menuScreen}
                        popup
                        model={[
                            {label: 'Add New', icon: 'pi pi-fw pi-plus'},
                            {label: 'Remove', icon: 'pi pi-fw pi-minus'}
                        ]}
                    />
                </div>
            </div>

            <pre className="text-sm">{screen.id}</pre>
            {screen.items && screen.items.length > 0 &&
                <div>
                    {screen.items.map(x => <ScreenItem item={x}/>)}
                </div>
            }
        </div>
    }

    const Adapter = (props) => {
        let adapter = props.adapter
        console.log(adapter)
        return <div className="card" style={{margin: "5px"}}>
            <h5><Link href={"/adapter/" + bench.id + "/" + adapter.id}> {adapter.name}</Link></h5>
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
            {bench.screens.map(x => <ScreenPanel key={x.id} screen={x}/>)}
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
                <h2>{bench && bench.name}</h2>
                <TabView>
                    <TabPanel header={"Screens (" + screenCount + ")"}>
                        <Menubar model={screenMenuItems}></Menubar>
                        <div className="card">
                            <ScreenGrid></ScreenGrid>
                        </div>
                    </TabPanel>
                    <TabPanel header={"Adapters (" + adapterCount + ")"}>
                        <Menubar model={adapterMenuItems}></Menubar>
                        <div className="card">
                            <AdapterGrid></AdapterGrid>
                        </div>

                    </TabPanel>
                </TabView>
            </div>
        </>
    );
};

export default Workbench;
