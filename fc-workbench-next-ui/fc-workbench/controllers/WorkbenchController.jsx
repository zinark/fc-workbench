import {WorkbenchService} from "../service/WorkbenchService";
import {Utils} from "../service/Utils";
import Enumerable from 'linq'

class WorkbenchController {
    _initialBench;

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

    createAdapterRequest(benchId, bench, adapterRefNo) {
        let modified = {...bench}

        let adapter = Enumerable.from(modified.adapters)
            .where(x => x.refNo == adapterRefNo)
            .firstOrDefault();

        if (!adapter) {
            alert('hata')
            return
        }


        if (!adapter.requests) adapter.request = []
        adapter.requests.push({
            code: 'new-code',
            content: '{}',
            contentType: 'application/json',
            headers: {
                'accept': "application/json",
                'cache-control': "no-cache"
            },
            isCustomResponse: false,
            method: 'GET',
            refNo: Utils.Guid(),
            url: '',
            title: 'new-request-title'
        })
        return {
            modifiedBench : modified,
            modifiedAdapter : adapter
        }
    }
}

export default WorkbenchController