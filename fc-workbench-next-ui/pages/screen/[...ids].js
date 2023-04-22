import {useRouter} from "next/router";
import {BreadCrumb} from "primereact/breadcrumb";
import React, {useEffect, useState} from "react";
import {Menubar} from "primereact/menubar";
import {WorkbenchService} from "../../fc-workbench/service/WorkbenchService";
import Link from "next/link";

const Screen = () => {

    const router = useRouter()
    const {ids} = router.query
    let wid = ids[0]
    let id = ids[1]

    const [bench, setBench] = useState([]);
    const [screen, setScreen] = useState()
    const refresh_workbenchs = async () => {
        let data = await WorkbenchService.getWorkbench(id)
        console.log(data);
        setBench(data)
        for (let ix in data.screens) {
            let screen = data.screens[ix];
            if (screen.id === id) setScreen(screen)
        }
    }
    useEffect(() => {
        refresh_workbenchs()
    }, []);


    const breadcrumbHome = {icon: 'pi pi-home', to: '/'};
    const breadcrumbItems = [
        {label: <Link href={"/workbenchs"}> Workbenchs </Link>},
        {label: <Link href={"/workbench/" + wid}> Workbench ({wid}) </Link>},
        {label: <Link href={"/screen/" + wid + "/" + id}> Screen ({id}) </Link>}
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

    return <div>
        <BreadCrumb home={breadcrumbHome} model={breadcrumbItems}/>
        <Menubar model={screenEditMenuItems}></Menubar>
        <div className="grid">
            <pre> {JSON.stringify(screen, null, 2)} </pre>
        </div>
    </div>
}

export default Screen