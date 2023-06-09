import {useRouter} from "next/router";
import {Tree} from "primereact/tree";
import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {WorkbenchService} from "../../../../fc-workbench/service/WorkbenchService";
import Enumerable from 'linq'
import {BreadCrumb} from "primereact/breadcrumb";
import {InputText} from "primereact/inputtext";
import {Utils} from "../../../../fc-workbench/service/Utils";
import AdapterVariablesTreeView from "../../../../fc-workbench/components/AdapterVariablesTreeView";
import {Menubar} from "primereact/menubar";
import WorkbenchController from "../../../../fc-workbench/controllers/WorkbenchController";

const Adapter = () => {
    const router = useRouter()


    const [benchId, setBenchId] = useState(0)
    const [adapterRefNo, setAdapterRefNo] = useState(0)
    const [adapterRequestRefNo, setAdapterRequestRefNo] = useState(0)
    const [bench, setBench] = useState({})
    const [adapter, setAdapter] = useState({})
    const breadcrumbHome = {icon: 'pi pi-home', to: '/'};
    const [breadcrumbItems, setBreadCrumbItems] = useState([])
    const [requestNodes, setRequestNodes] = useState([])
    const [keywordRequest, setKeywordRequest] = useState(null)

    const controller = new WorkbenchController()

    const menuItems = [
        {
            label: 'New Request',
            icon: 'pi pi-fw pi-plus',
            command: () => {
                const {modifiedBench, modifiedAdapter} = controller.createAdapterRequest(benchId, bench, adapterRefNo)
                setBench(modifiedBench)
                setAdapter(modifiedAdapter)
            }
        },
        {
            label: 'New Part',
            icon: 'pi pi-fw pi-plus',
            command: () => {
            }
        },
        {
            label: 'Save',
            icon: 'pi pi-fw pi-save',
            command: () => {
                controller.saveBench(benchId, bench).then(bench => {

                })
            }
        }
    ];

    useEffect(() => {
        if (!router.query) return
        let {benchId, adapterRefNo} = router.query

        WorkbenchService.getWorkbench(benchId).then(data => {
            if (!data) return;
            console.log(data)
            setBenchId(benchId)
            setAdapterRefNo(adapterRefNo)
            let adapter = Enumerable.from(data.adapters).where(x => x.refNo === adapterRefNo).firstOrDefault()
            if (!adapter) return
            setAdapter(adapter)
            setBench(data)
        })
    }, [router, router.query])


    useEffect(() => {
        if (!adapter) return
        if (!adapter.requests) return
        if (!adapter.parts) return

        let filteredReqs = adapter.requests
        if (keywordRequest && keywordRequest.length > 0) {
            filteredReqs = Enumerable.from(filteredReqs)
                .where(x => x.code)
                .where(x => x.code.toLocaleLowerCase().indexOf(keywordRequest.toLocaleLowerCase()) > 0)
        }

        let nodes = Utils.MakeRequestNodes(filteredReqs,
            x => <Link href={`/workbench/${benchId}/adapter/${adapterRefNo}/request/${x.refNo}`}> {x.code} </Link>)
        setRequestNodes(nodes)


    }, [keywordRequest, bench, adapter])

    useEffect(() => {
        setBreadCrumbItems([
            {label: <Link href="/workbenchs"> Workbenchs </Link>},
            {label: <Link href={`/workbench/${benchId}`}> {bench.title} </Link>},
            {label: <Link href={`/workbench/${benchId}/adapter/${adapterRefNo}`}> {adapter.name} </Link>}
        ]);
    }, [bench])

    const op2 = useRef()
    return <>
        <BreadCrumb home={breadcrumbHome} model={breadcrumbItems}/>

        <div className="card">
            <h2>{adapter.name}</h2>
            <Menubar model={menuItems}/>

            <div className="grid col-12">
                <div className="col-6">
                    <h4>Requests</h4>
                    <InputText value={keywordRequest} placeholder="request search"
                               onChange={e => setKeywordRequest(e.target.value)}/>
                    <Tree value={requestNodes} className="w-full"/>
                </div>
                <div className="col-6">
                    <AdapterVariablesTreeView adapter={adapter}/>
                </div>
            </div>
        </div>

    </>
}

export default Adapter