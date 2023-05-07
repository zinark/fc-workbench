import {WorkbenchService} from "../service/WorkbenchService";
import {Utils} from "../service/Utils";

class WorkbenchController {
    _initialBench;
    _bench;

    setInitialBench(bench) {
        this._initialBench = bench
    }

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
}

export default WorkbenchController