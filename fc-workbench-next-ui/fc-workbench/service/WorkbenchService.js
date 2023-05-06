import Enumerable from 'linq'

export const WorkbenchService = {
        listWorkbenchs() {
            const baseUrl = process.env.BASE_URL;
            return fetch('/data/workbenchs.json', {headers: {'Cache-Control': 'no-cache'}})
                .then((res) => res.json())
                .then((d) => d);
        },
        getWorkbench(id) {
            return fetch('/data/workbenchs.json', {headers: {'Cache-Control': 'no-cache'}})
                .then((res) => res.json())
                .then((d) => {
                    let found = Enumerable.from(d)
                        .firstOrDefault(x => x.id == id);
                    return found
                });
        }

    }
;
