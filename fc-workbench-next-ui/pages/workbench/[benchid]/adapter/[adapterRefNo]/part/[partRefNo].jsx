import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {WorkbenchService} from "../../../../../../fc-workbench/service/WorkbenchService";
import Enumerable from "linq";
import AdapterVariablesTreeView from "../../../../../../fc-workbench/components/AdapterVariablesTreeView";
import {BreadCrumb} from "primereact/breadcrumb";
import Link from "next/link";

const AdapterPart = () => {
    const router = useRouter()
    const [benchId, setBenchId] = useState(0)
    const [adapterRefNo, setAdapterRefNo] = useState(0)
    const [partRefNo, setPartRefNo] = useState(0)
    const [bench, setBench] = useState({})
    const [adapter, setAdapter] = useState({})
    const [part, setPart] = useState({})
    const breadcrumbHome = {icon: 'pi pi-home', to: '/'};
    const [breadcrumbItems, setBreadCrumbItems] = useState([])

    useEffect(() => {
        if (!router.query) return
        let {benchId, adapterRefNo, partRefNo} = router.query
        setBenchId(benchId)
        setAdapterRefNo(adapterRefNo)
        setPartRefNo(partRefNo)

        WorkbenchService.getWorkbench(benchId).then(data => {
            setBenchId(benchId)
            setAdapterRefNo(adapterRefNo)
            let adapter = Enumerable.from(data.adapters).where(x => x.refNo === adapterRefNo).firstOrDefault()
            let part = Enumerable.from(data.adapters)
                .selectMany(x => x.parts)
                .where(x => x.refNo === partRefNo).firstOrDefault()
            if (!adapter) return
            setAdapter(adapter)
            setPart(part)
            setBench(data)
        })
    }, [router, router.query])
    useEffect(() => {
        setBreadCrumbItems([
            {label: <Link href="/workbenchs"> Workbenchs </Link>},
            {label: <Link href={`/workbench/${benchId}`}> {bench.title} </Link>},
            {label: <Link href={`/workbench/${benchId}/adapter/${adapterRefNo}`}> {adapter.name} </Link>}
        ]);
    }, [bench])

    return <>
        <BreadCrumb home={breadcrumbHome} model={breadcrumbItems}/>
        <div className="card">
            <h2>{part.name}</h2>
            {/*<pre>{JSON.stringify(part, null, 4)}</pre>*/}
            <div className="grid col-12">
                <div className="col-4">
                    <AdapterVariablesTreeView adapter={adapter}/>
                </div>
                <div className="col-8">

                </div>
            </div>
        </div>
    </>
}

export default AdapterPart