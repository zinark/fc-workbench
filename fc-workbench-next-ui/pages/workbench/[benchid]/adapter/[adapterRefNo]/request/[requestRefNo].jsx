import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import linq from "linqjs";

import {TabPanel, TabView} from "primereact/tabview";
import Link from "next/link";
import {BreadCrumb} from "primereact/breadcrumb";
import {InputText} from "primereact/inputtext";
import {WorkbenchService} from "../../../../../../fc-workbench/service/WorkbenchService";
import CodeEditor from "../../../../../../fc-workbench/components/CodeEditor";

let q = linq.query;

const AdapterRequest = () => {

    const router = useRouter()
    const [benchId, setBenchId] = useState(0)
    const [adapterRefNo, setAdapterRefNo] = useState(0)
    const [adapterRequestRefNo, setAdapterRequestRefNo] = useState(0)
    const [bench, setBench] = useState({})
    const [adapter, setAdapter] = useState({})
    const [adapterRequest, setAdapterRequest] = useState({})
    const breadcrumbHome = {icon: 'pi pi-home', to: '/'};
    const [breadcrumbItems, setBreadCrumbItems] = useState([])

    useEffect(() => {
        if (!router.query) return
        let {benchId, adapterRefNo, requestRefNo} = router.query

        WorkbenchService.getWorkbench(benchId).then(data => {
            setBenchId(benchId)
            setAdapterRefNo(adapterRefNo)
            setAdapterRequestRefNo(requestRefNo)
            let adapter = data.adapters.where(x => x.refNo === adapterRefNo).first()
            if (!adapter) {
                console.error(adapterRefNo)
                return;
            }
            let adapterRequest = adapter.requests.where(x => x.refNo === requestRefNo).first()
            setAdapter(adapter)
            setAdapterRequest(adapterRequest)
            setBench(data)

        })
    }, [router, router.query])

    useEffect(() => {
        setBreadCrumbItems([
            {label: <Link href="/workbenchs"> Workbenchs </Link>},
            {label: <Link href={`/workbench/${benchId}`}> {bench.title} </Link>},
            {label: <Link href={`/workbench/${benchId}/adapter/${adapterRefNo}`}> {adapter.name} </Link>},
            {
                label: <Link href={`/workbench/${benchId}/adapter/${adapterRefNo}/request/${adapterRequestRefNo}`}>
                    {adapterRequest.code}
                </Link>
            },
        ]);
    }, [bench])

    return <>
        <BreadCrumb home={breadcrumbHome} model={breadcrumbItems}/>

        <div className="card p-fluid">
            <h2>{adapterRequest.title}</h2>
            <div className="field grid">
                <label htmlFor="code" className="col-12 mb-2 md:col-2 md:mb-0">
                    CODE
                </label>
                <div className="col-12 md:col-10">
                    <InputText id="url" type="text" value={adapterRequest.code}/>
                </div>
            </div>
            <div className="field grid">
                <label htmlFor="url" className="col-12 mb-2 md:col-2 md:mb-0">
                    METHOD
                </label>
                <div className="col-12 md:col-10">
                    <InputText id="url" type="text" value={adapterRequest.method}/>
                </div>
            </div>
            <div className="field grid">
                <label htmlFor="url" className="col-12 mb-2 md:col-2 md:mb-0">
                    URL
                </label>
                <div className="col-12 md:col-10">
                    <InputText id="url" type="text" value={adapterRequest.url}/>
                </div>
            </div>
        </div>


        <TabView>
            <TabPanel header="Request">
                <pre>{adapterRequest.contentType}</pre>
                <CodeEditor object={adapterRequest.content && JSON.parse(adapterRequest.content)}/>
            </TabPanel>
            <TabPanel header="Headers">
                <CodeEditor object={adapterRequest.headers}/>
            </TabPanel>
            <TabPanel header="Request Mapper">
                <CodeEditor object={adapterRequest.requestMapper}/>
            </TabPanel>
            <TabPanel header="Response Mapper">
                <CodeEditor object={adapterRequest.responseMapper}/>
            </TabPanel>
            <TabPanel header="lastSuccessResponse">
                <CodeEditor object={adapterRequest.lastSuccessResponse}/>
            </TabPanel>
            <TabPanel header="lastFailureResponse">
                <CodeEditor object={adapterRequest.lastFailureResponse}/>
            </TabPanel>
        </TabView>
    </>
}

export default AdapterRequest