export const WorkbenchService = {
        listWorkbenchs() {
            return fetch('/data/workbenchs.json', {headers: {'Cache-Control': 'no-cache'}})
                .then((res) => res.json())
                .then((d) => d);
        },
        getWorkbench(id) {
            return fetch('/data/workbenchs.json', {headers: {'Cache-Control': 'no-cache'}})
                .then((res) => res.json())
                .then((d) => d[0]);
        }

    }
;
