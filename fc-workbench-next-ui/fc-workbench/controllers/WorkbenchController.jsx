import {WorkbenchService} from "../service/WorkbenchService";
import {Utils} from "../service/Utils";
import Enumerable from 'linq'

class WorkbenchController {
    _initialBench;
    _bench;

    setBench(bench) {
        this._bench = bench
    }

    saveBench(benchId, bench) {
        return WorkbenchService.changeWorkbench(benchId, bench);
    }

    newScreen(bench) {
        let modified = {...bench}
        if (!modified.screens) modified.screens = []
        modified.screens.push({
            items: [],
            title: 'new screen',
            tag: 'user',
            refNo: Utils.Guid()
        })
        return modified
    }

    newAdapter(bench) {
        let modified = {...bench}
        if (!modified.adapters) modified.screens = []
        modified.adapters.push({
            refNo: Utils.Guid(),
            name: 'new adapter',
            requests: [],
            parts: []
        })
        return modified
    }

    getBench(benchId) {
        return WorkbenchService.getWorkbench(benchId)
            .then(data => {
                this._initialBench = data
                return data
            })
    }

    deleteAdapter(bench, refNo) {
        let found = Enumerable.from(bench.adapters)
            .where(x => x.refNo == refNo)
            .firstOrDefault();

        if (!found) {
            alert('hata')
            return
        }

        let modified = {...bench}
        modified.adapters = Enumerable.from(modified.adapters)
            .where(x => x.refNo != refNo)
            .toArray()
        return modified
    }
}

export default WorkbenchController