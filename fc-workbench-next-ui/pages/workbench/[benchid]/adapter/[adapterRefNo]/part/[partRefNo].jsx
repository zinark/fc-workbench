import {useRouter} from "next/router";

const AdapterPart = () => {
    const router = useRouter()
    let {benchId, adapterRefNo, partRefNo} = router.query

    return <>
        <div>Part</div>
        <div>{benchId}</div>
        <div>{partRefNo}</div>
    </>
}

export default AdapterPart