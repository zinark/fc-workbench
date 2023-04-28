export const Utils = {
    Guid() {
        function uuidv4() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }

        return uuidv4().replaceAll("-", "").toLocaleUpperCase();
    },
    MakeRequestNodes (reqs, f, itemGroupKey = "code", splitter = '/', icon = 'pi-code') {
        const list = []
        reqs.forEach(item => {
            const code = item[itemGroupKey];
            const codeSplits = code.split(splitter).where(x => x.length > 0)
            let lastSplit = codeSplits.last()

            let toPush = {
                key: lastSplit,
                title: lastSplit,
                label: lastSplit,
                icon: "pi pi-fw " + icon,
                isFolder: false,
                className: 'm-0 p-0'
            }

            if (f) toPush.label = f(item)

            let splits = codeSplits.take(codeSplits.length - 1)

            let target = list
            splits.forEach(split => {
                let folder = list.first(x => x.title === split)
                if (!folder) {
                    folder = {
                        key: split,
                        title: split,
                        label: split,
                        icon: "pi pi-fw pi-folder",
                        children: [],
                        isFolder: true,
                        // expanded: true,
                        className: 'm-1 p-1'
                    }
                    list.push(folder)
                }

                target = folder.children
            })

            target.push(toPush)
        })

        return list.where(x => !x.isFolder).concat(
            list.where(x => x.isFolder).where(x => x.children.length > 0)
        )
    }

}