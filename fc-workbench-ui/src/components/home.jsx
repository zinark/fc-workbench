import {Requests} from '../Requests'
import {Link} from 'react-router-dom'

export function Home() {
    const REQUESTS = new Requests();


    return <>
        <h1>fc-workbench</h1>
        <div>
            <h2>Workbench = 1</h2>
            <div>
                <Link to={"/import-adapter"}>Import Adapter</Link>
            </div>
            <div>
                <Link to={"/adapters"}>Adapters</Link>
            </div>
        </div>
    </>
}