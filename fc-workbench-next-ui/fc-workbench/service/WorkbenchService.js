const baseUrl = () => process.env.BASE_URL;
export const WorkbenchService = {
        // listWorkbenchs() {
        //     const baseUrl = process.env.BASE_URL;
        //     return fetch('/data/workbenchs.json', {headers: {'Cache-Control': 'no-cache'}})
        //         .then((res) => res.json())
        //         .then((d) => d);
        // },
        // getWorkbench(id) {
        //     return fetch('/data/workbenchs.json', {headers: {'Cache-Control': 'no-cache'}})
        //         .then((res) => res.json())
        //         .then((d) => {
        //             let found = Enumerable.from(d)
        //                 .firstOrDefault(x => x.id == id);
        //             return found
        //         });
        // }
        listWorkbenchs() {

            const body = {
                skip: 0,
                take: 10
            }
            return fetch(`${baseUrl()}/search-workbenchs`, {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                    'accept': 'text/plain'
                },
                body: JSON.stringify(body)
            })
                .then((res) => res.json())
                .then((d) => d);
        },
        getWorkbench(id) {

            const body = {
                id: id
            }
            return fetch(`${baseUrl()}/get-workbench`, {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                    'accept': 'text/plain'
                },
                body: JSON.stringify(body)
            })
                .then((res) => res.json())
                .then((d) => d);
        },
        createWorkbench(id, title = 'new') {

            const body = {
                id: id,
                title: title,
                description: '',
                parameters: {},
                adapters: JSON.stringify([]),
                screens: JSON.stringify([])
            }
            return fetch(`${baseUrl()}/save-workbench`, {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                    'accept': 'text/plain'
                },
                body: JSON.stringify(body)
            })
                .then((res) => res.json())
                .then((d) => d);
        },
        changeWorkbench(id, title, description, parameters, adapters, screens) {
            if (!id) throw new Error('id yollayin!');

            const body = {
                id: id,
                title: title,
                description: description,
                parameters: parameters,
                adapters: JSON.stringify(adapters),
                screens: JSON.stringify(screens)
            }
            return fetch(`${baseUrl()}/save-workbench`, {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                    'accept': 'text/plain'
                },
                body: JSON.stringify(body)
            })
                .then((res) => res.json())
                .then((d) => d);
        },
        deleteWorkbench(id) {

            const body = {
                id: id
            }
            return fetch(`${baseUrl()}/delete-workbench`, {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                    'accept': 'text/plain'
                },
                body: JSON.stringify(body)
            })
                .then((res) => res.json())
                .then((d) => d);
        },


    }
;
