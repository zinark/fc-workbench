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
import CodeEditor from "../../fc-workbench/components/CodeEditor";
import ScreenMobileView from "../../fc-workbench/components/ScreenMobileView";

const Workbench = (props) => {
    const [bench, setBench] = useState([]);
    const [screenCount, setScreenCount] = useState(0)
    const [adapterCount, setAdapterCount] = useState(0)

    const router = useRouter()
    const {id} = router.query
    const breadcrumbHome = {icon: 'pi pi-home', to: '/'};
    const [breadcrumbItems, setBreadCrumbItems] = useState([])

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


    useEffect(() => {
        WorkbenchService.getWorkbench(id).then(data => {
            setBench(data)
            setScreenCount(data.screens.length)
            setAdapterCount(data.adapters.length)
        })
    }, [id]);

    useEffect(() => {
        setBreadCrumbItems([
            {label: <Link href={"/workbenchs"}> Workbenchs </Link>},
            {label: <Link href={"/workbench/" + id}> {bench.title} </Link>},
        ]);
    }, [bench])

    const ScreenItem = (props) => {
        let item = props.item
        let icon = "pi-apple"
        if (item.type === "Label") icon = "pi-info"
        if (item.type === "Link") icon = "pi-link"
        if (item.type === "Input") icon = "pi-pencil"
        if (item.type === "Button") icon = "pi-external-link"
        return <div className="col-12">
            <Chip label={item.text} icon={"pi " + icon}/>
        </div>


    }
    const menuScreen = useRef(null);
    const ScreenGridView = (props) => {
        let screen = props.screen
        return <div className="card p-3 m-3 border-1 border-300 col-2">
            <div className="flex justify-content-between align-items-center mb-5">
                <Link href={"/screen/" + bench.id + "/" + screen.refNo}>
                    <div className="text-2xl font-bold"> {screen.title} </div>
                </Link>
                <div>
                    <Button type="button" icon="pi pi-ellipsis-v"
                            key={screen.id}
                            className="p-button-rounded p-button-text p-button-plain"
                            onClick={(event) => menuScreen.current.toggle(event)}/>
                    <Menu
                        ref={menuScreen}
                        key={screen.id}
                        popup
                        model={[
                            {label: 'Add New', icon: 'pi pi-fw pi-plus'},
                            {label: 'Remove', icon: 'pi pi-fw pi-minus'}
                        ]}
                    />
                </div>
            </div>

            {screen.items && screen.items.length > 0 &&
                <div>
                    {screen.items.map(x => <ScreenItem item={x}/>)}
                </div>
            }
        </div>
    }

    const AdapterGridView = (props) => {
        let adapter = props.adapter

        return <div className="card p-5 m-5 border-1 border-300 col-5">
            <div className="flex justify-content-between align-items-center mb-5">
                <Link href={`/workbench/${bench.id}/adapter/${adapter.refNo}`}>
                    <div className="text-2xl font-bold"> {adapter.name} </div>
                </Link>
                <div>
                    <Button type="button" icon="pi pi-ellipsis-v"
                            key={adapter.id}
                            className="p-button-rounded p-button-text p-button-plain"
                            onClick={(event) => menuScreen.current.toggle(event)}/>
                    <Menu
                        ref={menuScreen}
                        key={adapter.id}
                        popup
                        model={[
                            {label: 'Add New', icon: 'pi pi-fw pi-plus'},
                            {label: 'Remove', icon: 'pi pi-fw pi-minus'}
                        ]}
                    />
                </div>
            </div>

            <h6>Requests ({adapter.requests.length})</h6>
            <div className="text-sm">
                {adapter.requests && adapter.requests.length > 0 &&
                    <div>
                        {adapter.requests.map(x => <Link key={x.id}
                                                         href={`/workbench/${bench.id}/adapter/${adapter.refNo}/request/${x.refNo}`}>
                            <div className="m-1">
                                <Chip className="m-1" icon="pi pi-code"/>
                                {x.code}
                            </div>
                        </Link>)}
                    </div>
                }
            </div>

            <h6>Parts ({adapter.parts.length})</h6>
            <div className="text-sm">
                {adapter.parts && adapter.parts.length > 0 &&
                    <div>
                        {adapter.parts.map(x => <Link key={x.id}
                                                      href={`/workbench/${bench.id}/adapter/${adapter.refNo}/part/${x.refNo}`}>
                            <Chip className="m-1" label={x.name} icon="pi pi-align-justify"/>
                        </Link>)}
                    </div>
                }
            </div>

        </div>

        return <div className="card" style={{margin: "5px"}}>
            <h5><Link href={"/adapter/" + bench.id + "/" + adapter.id}> {adapter.name}</Link></h5>
            <pre className="text-sm">{adapter.id}</pre>
            <div className="flex align-items-center justify-content-center">
                <Button icon="pi pi-trash" tooltip={"Delete"} severity="danger" outlined/>
                <Link href={"/adapter/" + bench.id + "/" + adapter.id}>
                    <Button icon="pi pi-file-edit" tooltip={"Edit"}/>
                </Link>
            </div>
        </div>
    }
    const ScreenGrid = () => {
        if (!bench.screens) return

        return <div className="grid">
            {bench.screens.map(x => <div key={x.id}
                                         className="card border-0 m-1 p-2 flex flex-column align-content-center align-items-center">
                <Link href={"/screen/" + bench.id + "/" + x.refNo}>
                    <div className="text-2xl font-bold"> {x.title} </div>
                </Link>

                <ScreenMobileView key={x.id} screen={x} zoom="75%"/>
            </div>)}
        </div>
    }
    const AdapterGrid = () => {
        if (!bench.adapters) return
        return <div className="grid">
            {bench.adapters.map(x => <AdapterGridView key={x.id} adapter={x}/>)}
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

                    <TabPanel header="Parameters">
                        <CodeEditor object={bench.parameters}/>
                    </TabPanel>

                    <TabPanel header="Screen Mappings">
                    </TabPanel>

                    <TabPanel header="Adapter Mappings">
                    </TabPanel>
                </TabView>
            </div>
        </>
    );
};

export default Workbench;
