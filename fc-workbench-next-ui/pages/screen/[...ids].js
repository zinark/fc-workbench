import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {WorkbenchService} from "../../fc-workbench/service/WorkbenchService";
import Link from "next/link";
import {TabPanel, TabView} from "primereact/tabview";
import CodeEditor from "../../fc-workbench/components/CodeEditor";
import {BreadCrumb} from "primereact/breadcrumb";
import {Menubar} from "primereact/menubar";


const Screen = () => {

    const router = useRouter()

    const [bench, setBench] = useState([]);
    const [screen, setScreen] = useState({})
    const [wid, setWid] = useState(0)
    const [sid, setSid] = useState(0)

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
                if (scr.id !== id1) continue;
                setScreen(scr)
                break;
            }

        })
    }, [wid, sid, router, router.query]);


    const breadcrumbHome = {icon: 'pi pi-home', to: '/'};
    const breadcrumbItems = [
        {label: <Link href={"/workbenchs"}> Workbenchs </Link>},
        {label: <Link href={"/workbench/" + wid}> {bench && bench.name} </Link>},
        {label: <Link href={"/screen/" + wid + "/" + sid}> {screen && screen.title} </Link>}
    ];
    const screenEditMenuItems = [
        {
            label: 'New',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'Label',
                    icon: 'pi pi-fw pi-plus',
                },
                {
                    label: 'Link',
                    icon: 'pi pi-fw pi-plus',
                },
                {
                    label: 'Button',
                    icon: 'pi pi-fw pi-plus',
                },
                {
                    label: 'Input',
                    icon: 'pi pi-fw pi-plus',
                }
            ]
        },
        {
            label: 'Save',
            icon: 'pi pi-fw pi-save'
        }
    ];

    const ScreenLink = (props) => {
        let data = props.screens;
        if (!data) return
        return <div>
            <Link href={`/screen/${wid}/${data.id}`}>
                {data.title}
            </Link>
        </div>
    }

    const ScreenItem = (props) => {
        let item = props.item
        let style = {
            position: "relative",
            zIndex: 10000,
            backgroundColor: "yellow",
            left: `${item.x * 10}px`,
            top: `${item.y * 10}px`,
            width: `${item.width * 10}px`,
            height: `${item.height * 10}px`,
        }

        return <div className="fc"> {item.text} </div>
    }
    const ScreenEditor = () => {
        if (!screen) return
        if (!screen.items) return
        return <div>
            {screen.items.map(x => <ScreenItem key={x.id} item={x}/>)}
        </div>
    }

    const ScreenPanel = () => {
        if (!bench) return
        if (!bench.screens) return
        if (!screen) return

        return <div className="card">
            <div className="grid">
                <div className="col-11">
                    <h2>{screen.title}</h2>
                    <TabView>
                        <TabPanel header="Screen">
                            <ScreenEditor/>
                        </TabPanel>
                        <TabPanel header="Json">
                            <CodeEditor code={JSON.stringify(screen)}/>
                        </TabPanel>
                    </TabView>
                </div>
                <div className="col-1">
                    {bench.screens.map(x => <ScreenLink key={x.id} screens={x}/>)}
                </div>
            </div>
        </div>

    }

    return <div>
        <pre>{wid} / {sid}</pre>
        <BreadCrumb home={breadcrumbHome} model={breadcrumbItems}/>
        <Menubar model={screenEditMenuItems}></Menubar>
        <ScreenPanel/>
    </div>
}


export default Screen