import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {WorkbenchService} from "../../fc-workbench/service/WorkbenchService";
import linq from "linqjs";
import CodeEditor from "../../fc-workbench/components/CodeEditor";
import {TabPanel, TabView} from "primereact/tabview";

let q = linq.query;

const AdapterRequest = () => {

    const router = useRouter()
    const [benchId, setBenchId] = useState(0)
    const [adapterRefNo, setAdapterRefNo] = useState(0)
    const [adapterRequestRefNo, setAdapterRequestRefNo] = useState(0)
    const [bench, setBench] = useState({})
    const [adapter, setAdapter] = useState({})
    const [adapterRequest, setAdapterRequest] = useState({})

    useEffect(() => {
        if (!router.query.ids) return
        let ids = router.query.ids
        setBenchId(ids[0])
        setAdapterRefNo(ids[1])
        setAdapterRequestRefNo(ids[2])

        WorkbenchService.getWorkbench(benchId).then(data => {
            let adapter = data.adapters.where(x => x.refNo === ids[1]).first()
            let adapterRequest = adapter.requests.where(x => x.refNo === ids[2]).first()
            setAdapter(adapter)
            setAdapterRequest(adapterRequest)
            setBench(data)
        })
    }, [])

    return <>
        <div> {benchId} {adapterRefNo} {adapterRequestRefNo} </div>
        <h2>{adapterRequest.title}</h2>
        <pre>{adapterRequest.url}</pre>
        <pre>{adapterRequest.code}</pre>
        <pre>{adapterRequest.contentType}</pre>
        <pre>{adapterRequest.method}</pre>
        <TabView>
            <TabPanel header="Request">
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