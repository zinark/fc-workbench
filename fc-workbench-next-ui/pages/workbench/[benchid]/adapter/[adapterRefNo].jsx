import {useRouter} from "next/router";
import {Tree} from "primereact/tree";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {WorkbenchService} from "../../../../fc-workbench/service/WorkbenchService";
import linq from 'linqjs'
import {BreadCrumb} from "primereact/breadcrumb";

let l = linq
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
    const [partNodes, setPartNodes] = useState([])

    const MakeRequestNodes = (reqs, f, itemGroupKey = "code", splitter = '/') => {
        const list = []
        reqs.forEach(item => {
            const code = item[itemGroupKey];
            const codeSplits = code.split(splitter).where(x => x.length > 0)
            let lastSplit = codeSplits.last()

            let toPush = {
                key: lastSplit,
                title: lastSplit,
                label: lastSplit,
                icon: "pi pi-fw pi-code",
                isFolder: false
            }

            if (f) toPush.label = f(item)

            let splits = codeSplits.take(codeSplits.length - 1)

            let target = list
            splits.forEach(split => {
                let folder = list.first(x => x.title === split)
                if (!folder) {
                    folder = {
                        key: lastSplit,
                        title: split,
                        label: split,
                        icon: "pi pi-fw pi-align-justify",
                        children: [],
                        isFolder: true
                    }
                    list.push(folder)
                }

                target = folder.children
            })

            target.push(toPush)
        })

        return list.where(x => !x.isFolder).concat(
            list.where(x => x.isFolder).where(x => x.children.length > 0)
        )
    }

    useEffect(() => {
        if (!router.query) return
        let {benchId, adapterRefNo} = router.query

        WorkbenchService.getWorkbench(benchId).then(data => {
            setBenchId(benchId)
            setAdapterRefNo(adapterRefNo)
            let adapter = data.adapters.where(x => x.refNo === adapterRefNo).first()
            if (!adapter) return
            setAdapter(adapter)
            setBench(data)

            let nodes = MakeRequestNodes(adapter.requests,
                x => <Link href={`/workbench/${benchId}/adapter/${adapterRefNo}/request/${x.refNo}`}> {x.code} </Link>)
            setRequestNodes(nodes)

            nodes = adapter.parts.select(x => ({
                key: x.name,
                label: x.name,
                icon: "pi pi-fw pi-align-justify",
                children: MakeRequestNodes(x.variables,
                    x => x.adapterKey,
                    "adapterKey",
                    '_')
            }))
            setPartNodes(nodes)
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
            <h2>{adapter.name}</h2>
            <div className="grid col-12">
                <div className="col-6">
                    <h4>Requests</h4>
                    <Tree value={requestNodes} className="w-full"/>
                </div>
                <div className="col-6">
                    <h4>Parts</h4>
                    <Tree value={partNodes} className="w-full"/>
                </div>
            </div>
        </div>

    </>
}

export default Adapter