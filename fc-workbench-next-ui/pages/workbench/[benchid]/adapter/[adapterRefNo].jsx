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

    const MakeRequestNodes = (reqs, hash) => {
        reqs = reqs.select(x => ({
            key: x.code,
            value: x
        }))

        let tree = {}
        for (let key in reqs) {
            let current_dict = tree
            let req = reqs[key]
            if (!req.key) continue
            let parts = req.key.split('/').where(x => x.length > 0)

            parts.forEach(part => {
                if (!current_dict[part]) {
                    current_dict[part] = {}
                }

                current_dict = current_dict[part]
            })

            const last_part = parts[parts.length - 1]
            if (!current_dict[last_part]) {
                current_dict[last_part] = []
            }

            let node = {
                key: req.value.code,
                label: <Link href={"/"}> Admin </Link>,
                icon: "pi pi-fw pi-inbox",
            }
            current_dict[last_part].push(req.value.code)
        }
        console.table(tree)
        console.log(tree)
        console.log(JSON.stringify(tree, 0, null))
        let result = []

        function buildNodes(tr) {
            for (let key in tr) {
                let curr = tr[key]

                if (Array.isArray(curr)) {
                    curr.forEach(x => buildNodes(x))
                    return
                }
                result.push({
                    key: key
                })
            }
        }

        buildNodes(tree)
        console.table(result)
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

            // let nodes = MakeRequestNodes(adapter.requests, {})
            // console.log (nodes)
            // nodes = [{
            //     key: "/admin",
            //     label: <Link href={"/"}> Admin </Link>,
            //     data: "Admin",
            //     icon: "pi pi-fw pi-inbox",
            //     children: [
            //         {
            //             key: "/admin/save-identity",
            //             label: "save-identity",
            //             data: "Save Identity",
            //             icon: "pi pi-fw pi-code"
            //         }
            //     ]
            // }];

            let nodes = []
            adapter.requests.forEach(x => {
                nodes.push({
                    key: x.code,
                    label: <Link
                        href={`/workbench/${benchId}/adapter/${adapterRefNo}/request/${x.refNo}`}> {x.code} </Link>,
                    data: "Admin",
                    icon: "pi pi-fw pi-code",
                })
            })
            setRequestNodes(nodes)

            nodes = []
            adapter.parts.forEach(x => {
                nodes.push({
                    key: x.name,
                    label: <Link
                        href={`/workbench/${benchId}/adapter/${adapterRefNo}/part/${x.refNo}`}> {x.name} </Link>,
                    data: "Admin",
                    icon: "pi pi-fw pi-align-justify",
                })
            })
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