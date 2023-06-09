import React, {useEffect, useRef, useState} from 'react';
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
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import WorkbenchController from "../../fc-workbench/controllers/WorkbenchController";

const Workbench = () => {
    const router = useRouter()
    const [benchId, setBenchId] = useState(0)
    const [bench, setBench] = useState({
        title: 'undefined',
        screens: [],
        adapters: []
    });

    const [screenCount, setScreenCount] = useState(0)
    const [adapterCount, setAdapterCount] = useState(0)
    const breadcrumbHome = {icon: 'pi pi-home', to: '/'};
    const [breadcrumbItems, setBreadCrumbItems] = useState([])
    const controller = new WorkbenchController()

    const benchMenuItems = [
        {
            label: 'Save',
            icon: 'pi pi-fw pi-save',
            command: () => {
                controller.saveBench(benchId, bench).then(data => {

                })
            }
        }
    ];
    const screenMenuItems = [
        {
            label: 'New',
            command: () => setBench(controller.newScreen(bench)),
            icon: 'pi pi-fw pi-table',
        }
    ];
    const adapterMenuItems = [
        {
            label: 'New',
            command: () => setBench(controller.newAdapter(bench)),
            icon: 'pi pi-fw pi-table'
        },
        {
            label: 'Import OpenApi',
            icon: 'pi pi-fw pi-file-import'
        },
    ];


    useEffect(() => {
        if (!router.query) return
        let {benchId} = router.query
        if (benchId === 0) return

        controller.getBench(benchId).then(data => {
            setBenchId(benchId)
            if (data) {
                setBench(data)
                if (data.screens) setScreenCount(data.screens.length)
                if (data.adapters) setAdapterCount(data.adapters.length)
            }
        })

    }, [router, router.query]);


    useEffect(() => {
        setBreadCrumbItems([
            {label: <Link href={"/workbenchs"}> Workbenchs </Link>},
            {label: <Link href={"/workbench/" + benchId}> {bench.title} </Link>},
        ]);
        setScreenCount(bench.screens.length)
        setAdapterCount(bench.adapters.length)
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
    const AdapterGridView = (props) => {
        let adapter = props.adapter
        const menuScreen = useRef(null);

        return <div className="card p-5 m-5 border-1 border-300 col-5">
            <div className="flex justify-content-between align-items-center mb-5">
                <Link href={`/workbench/${bench.id}/adapter/${adapter.refNo}`}>
                    <div className="text-2xl font-bold"> {adapter.name} </div>
                </Link>
                <div>
                    <Button type="button" icon="pi pi-ellipsis-v"
                            key={adapter.refNo}
                            className="p-button-rounded p-button-text p-button-plain"
                            onClick={(event) => menuScreen.current.toggle(event)}/>
                    <Menu
                        ref={menuScreen}
                        key={adapter.refNo}
                        popup
                        model={[
                            {
                                label: 'Remove',
                                icon: 'pi pi-fw pi-trash',
                                command: () => setBench (controller.deleteAdapter(bench, adapter.refNo))
                            }
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

    if (!bench) return <div> loading </div>
    return (
        <>
            <BreadCrumb home={breadcrumbHome} model={breadcrumbItems}/>
            <div className="card">
                <Menubar model={benchMenuItems}></Menubar>

                <h2>{bench && bench.title}</h2>

                <div className="field grid col-12 p-fluid">
                    <div className="col-12">
                        <InputText value={bench.title}
                                   onChange={e => {
                                       let modified = {...bench}
                                       modified.title = e.target.value
                                       setBench(modified)
                                   }}/>
                    </div>
                    <div className="col-12">
                        <InputTextarea value={bench.description}
                                       onChange={e => {
                                           let modified = {...bench}
                                           modified.description = e.target.value
                                           setBench(modified)
                                       }}/>

                    </div>
                </div>

                <TabView>
                    <TabPanel header={"Adapters (" + adapterCount + ")"}>
                        <div className="card">
                            <Menubar model={adapterMenuItems}></Menubar>

                            <AdapterGrid/>
                        </div>
                    </TabPanel>

                    <TabPanel header={"Screens (" + screenCount + ")"}>
                        <div className="card">
                            <Menubar model={screenMenuItems}></Menubar>
                            <ScreenGrid/>
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
