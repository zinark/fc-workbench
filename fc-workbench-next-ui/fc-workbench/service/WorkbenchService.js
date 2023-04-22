export const WorkbenchService = {
    listWorkbenchs: async function () {
        return fetch('/data/workbenchs.json', {headers: {'Cache-Control': 'no-cache'}})
            .then((res) => res.json())
            .then((d) => d);
    },
    getWorkbench: async function (id) {
        return fetch('/data/workbenchs.json', {headers: {'Cache-Control': 'no-cache'}})
            .then((res) => res.json())
            .then((d) => d[0]);
    }

};
