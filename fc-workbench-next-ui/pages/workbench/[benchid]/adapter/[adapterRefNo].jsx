import {useRouter} from "next/router";
import {Tree} from "primereact/tree";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {WorkbenchService} from "../../../../fc-workbench/service/WorkbenchService";
import linq from 'linqjs'
import {BreadCrumb} from "primereact/breadcrumb";
import {InputText} from "primereact/inputtext";

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
    const [keywordRequest, setKeywordRequest] = useState(null)
    const [keywordPart, setKeywordPart] = useState(null)
    const MakeRequestNodes = (reqs, f, itemGroupKey = "code", splitter = '/', icon = 'pi-code') => {
        const list = []
        reqs.forEach(item => {
            const code = item[itemGroupKey];
            const codeSplits = code.split(splitter).where(x => x.length > 0)
            let lastSplit = codeSplits.last()

            let toPush = {
                key: lastSplit,
                title: lastSplit,
                label: lastSplit,
                icon: "pi pi-fw " + icon,
                isFolder: false,
                className: 'm-0 p-0'
            }

            if (f) toPush.label = f(item)

            let splits = codeSplits.take(codeSplits.length - 1)

            let target = list
            splits.forEach(split => {
                let folder = list.first(x => x.title === split)
                if (!folder) {
                    folder = {
                        key: split,
                        title: split,
                        label: split,
                        icon: "pi pi-fw pi-folder",
                        children: [],
                        isFolder: true,
                        expanded: true,
                        className: 'm-1 p-1'
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
        })
    }, [router, router.query])

    useEffect(() => {
        if (!adapter) return
        if (!adapter.requests) return
        if (!adapter.parts) return

        let filteredReqs = adapter.requests
        if (keywordRequest && keywordRequest.length > 0) {
            filteredReqs = filteredReqs
                .where(x => x.code)
                .where(x => x.code.toLocaleLowerCase().indexOf(keywordRequest.toLocaleLowerCase()) > 0)
        }

        let filteredParts = adapter.parts
        // if (keywordPart && keywordPart.length > 0) {
        //     filteredParts = filteredParts
        //         .where(x => x.name.indexOf(keywordPart) > 0)
        // }


        let nodes = MakeRequestNodes(filteredReqs,
            x => <Link href={`/workbench/${benchId}/adapter/${adapterRefNo}/request/${x.refNo}`}> {x.code} </Link>)
        setRequestNodes(nodes)

        const filterVariables = (variables) => {
            if (keywordPart && keywordPart.length > 0) {
                variables = variables.where(x => x.adapterKey.toLocaleLowerCase().indexOf(keywordPart.toLocaleLowerCase()) > 0)
            }
            return variables
        };
        nodes = filteredParts.select(x => ({
            key: x.name,
            label: x.name,
            expanded: true,
            className: 'm-0 p-0',
            icon: "pi pi-fw pi-align-justify",
            children: MakeRequestNodes(filterVariables(x.variables),
                x => x.adapterKey,

                "adapterKey",
                '_', 'pi-dollar')
        }))
        setPartNodes(nodes)
    }, [keywordRequest, keywordPart, bench, adapter])

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
                    <InputText value={keywordRequest} placeholder="request search"
                               onChange={e => setKeywordRequest(e.target.value)}/>
                    <Tree value={requestNodes} className="w-full"/>
                </div>
                <div className="col-6">
                    <h4>Parts</h4>
                    <InputText value={keywordPart} placeholder="part search"
                               onChange={e => setKeywordPart(e.target.value)}/>
                    <Tree value={partNodes} className="w-full"/>
                </div>
            </div>
        </div>

    </>
}

export default Adapter