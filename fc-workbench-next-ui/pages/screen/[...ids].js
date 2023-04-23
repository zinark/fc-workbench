import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {WorkbenchService} from "../../fc-workbench/service/WorkbenchService";
import Link from "next/link";
import {TabPanel, TabView} from "primereact/tabview";
import CodeEditor from "../../fc-workbench/components/CodeEditor";
import {BreadCrumb} from "primereact/breadcrumb";
import {Menubar} from "primereact/menubar";
import ScreenItem from "../../fc-workbench/components/ScreenItem";
import linq from 'linqjs'
import {Utils} from "../../fc-workbench/service/Utils";

let l = linq

const Screen = () => {

    const router = useRouter()

    const [bench, setBench] = useState([]);
    const [screen, setScreen] = useState({})
    const [wid, setWid] = useState(0)
    const [sid, setSid] = useState(0)

    const breadcrumbHome = {icon: 'pi pi-home', to: '/'};
    const [breadcrumbItems, setBreadCrumbItems] = useState([])

    useEffect(() => {
        if (!router.query.ids) return
        let ids = router.query.ids
        let id0 = ids[0]
        let id1 = ids[1]
        WorkbenchService.getWorkbench(id0).then(data => {
            setBench(data);
            setWid(ids[0])
            setSid(ids[1])
            for (let ix in bench.screens) {
                let scr = bench.screens[ix];
                if (scr.refNo !== id1) continue
                setScreen(scr)
                break
            }
        })
    }, [wid, sid, router, router.query]);

    useEffect(() => {
        setBreadCrumbItems([
            {label: <Link href={"/workbenchs"}> Workbenchs </Link>},
            {label: <Link href={"/workbench/" + wid}> {bench.title} </Link>},
            {label: <Link href={"/screen/" + wid + "/" + sid}> {screen.title} </Link>}
        ]);
    }, [bench, screen, wid, sid])

    const handleNewLabel = () => {
        const newItem = {
            text: 'new',
            type: 'Label',
            refNo: Utils.Guid()
        }
        const newItems = [...screen.items, newItem]
        const newScreen = {...screen}
        newScreen.items = newItems
        setScreen(newScreen)
    }
    const handleNewLink = () => {

    }
    const handleNewButton = () => {

    }
    const handleNewInput = () => {

    }
    const handleSave = () => {
    }

    const handleDeleteScreenItem = (refNo) => {
        const newItems = screen.items.where(x => x.refNo !== refNo)
        const newScreen = {...screen}
        newScreen.items = newItems
        setScreen(newScreen)
    }

    const screenEditMenuItems = [
        {
            label: 'New',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'Label',
                    icon: 'pi pi-fw pi-plus',
                    command: handleNewLabel,
                },
                {
                    label: 'Link',
                    icon: 'pi pi-fw pi-plus',
                    command: handleNewLink,
                },
                {
                    label: 'Button',
                    icon: 'pi pi-fw pi-plus',
                    command: handleNewButton,
                },
                {
                    label: 'Input',
                    icon: 'pi pi-fw pi-plus',
                    command: handleNewInput,
                }
            ]
        },
        {
            label: 'Save',
            icon: 'pi pi-fw pi-save',
            command: handleSave
        }
    ];

    const ScreenLink = (props) => {
        let data = props.screen;
        if (!data) return
        return <div>
            <Link href={`/screen/${wid}/${data.refNo}`}>
                {data.title}
            </Link>
        </div>
    }

    const ScreenEditor = () => {
        if (!screen) return
        if (!screen.items) return

        return <div>
            <Menubar model={screenEditMenuItems}></Menubar>

            <div className="card">
                {screen.items.map((item, ix) => <ScreenItem editMode key={ix} data={item}
                                                            onDelete={handleDeleteScreenItem}/>)}
            </div>

            <div className="grid mt-8 pb-2">
                <div className="col-12 flex flex-column align-items-center text-center bg-gray-100">

                    <div
                        className="flex flex-column bg-purple-50 p-4 m-4 border-2 border-300 align-items-center align-content-center"
                        style={{minWidth: "320px", minHeight: "600px", borderRadius: "30px"}}>

                        {screen.items.map((scrItem, ix) => <ScreenItem key={ix} data={scrItem}/>)}

                    </div>
                </div>
            </div>
        </div>
    }

    const ScreenPanel = () => {
        if (!screen) return
        if (!bench) return
        if (!bench.screens) return


        return <div className="card">
            <div className="grid">

                <div className="col-11">

                    <h2>{screen.title}</h2>

                    <TabView>

                        <TabPanel header="Screen">
                            <ScreenEditor/>
                        </TabPanel>

                        <TabPanel header="Json">
                            <CodeEditor object={screen}/>
                        </TabPanel>

                    </TabView>

                </div>

                <div className="col-1">
                    <h4>Screens</h4>
                    {bench.screens.map((scr, ix) => <ScreenLink key={ix} screen={scr}/>)}
                </div>
            </div>
        </div>

    }

    return <div>
        <h1>{screen && screen.title}</h1>
        <BreadCrumb home={breadcrumbHome} model={breadcrumbItems}/>
        <ScreenPanel/>
    </div>
}


export default Screen