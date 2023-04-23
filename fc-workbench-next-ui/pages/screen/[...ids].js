import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {WorkbenchService} from "../../fc-workbench/service/WorkbenchService";
import Link from "next/link";
import {TabPanel, TabView} from "primereact/tabview";
import CodeEditor from "../../fc-workbench/components/CodeEditor";
import {BreadCrumb} from "primereact/breadcrumb";
import {Menubar} from "primereact/menubar";
import {Chip} from "primereact/chip";
import {InputText} from "primereact/inputtext";
import {RadioButton} from "primereact/radiobutton";

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

    const LinkForAScreen = (props) => {
        let data = props.screens;
        if (!data) return
        return <div>
            <Link href={`/screen/${wid}/${data.refNo}`}>
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

        let types = ["Label", "Link", "Button", "Input"];

        const handleScreenItemTextChange = (item, value) => {
            console.log(item, value);
        };

        return <div className="card m-3 p-6 border-1 border-300">
            <div className="grid">
                <div className="col-3">
                    <InputText type="text"
                               value={item.text}
                               onChange={e => handleScreenItemTextChange(item, e.target.value)}
                               placeholder={item.type}/>
                </div>

                <div className="col-3">
                    <Chip label={item.type}></Chip>
                </div>

                <div className="grid col-6">
                    {types.map((x, ix) => {
                        return <div key={ix} className="col-12 md:col-3">
                            <div className="field-radiobutton">
                                <RadioButton inputId="option1" name="option" value={x}
                                    // checked={radioValue === 'Chicago'}
                                    // onChange={(e) => setRadioValue(e.value)}
                                />
                                <label htmlFor="option1">{x}</label>
                            </div>

                        </div>
                    })}
                </div>
            </div>


        </div>
    }
    const ScreenEditor = () => {
        if (!screen) return
        if (!screen.items) return

        return <div>
            <Menubar model={screenEditMenuItems}></Menubar>

            <div className="card">
                {screen.items.map((x, ix) => <ScreenItem key={ix} item={x}/>)}
            </div>

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
                            <CodeEditor object={screen}/>
                        </TabPanel>

                    </TabView>

                </div>

                <div className="col-1">
                    <h4>Screens</h4>
                    {bench.screens.map((scr, ix) => <LinkForAScreen key={ix} screens={scr}/>)}
                </div>
            </div>
        </div>

    }

    return <div>
        <BreadCrumb home={breadcrumbHome} model={breadcrumbItems}/>
        <ScreenPanel/>
    </div>
}


export default Screen