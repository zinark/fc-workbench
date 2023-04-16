export class Requests {
    API_URL = "http://localhost:5000"

    async importAdapter(workbenchId, baseUrl, openApiJsonUrl) {
        var data = {
            "workbenchId" : workbenchId,
            "baseUrl": baseUrl,
            "openApiUrl": openApiJsonUrl
        };
        let body = JSON.stringify(data);

        let url = this.API_URL + "/import-adapter";
        let fetchParameters = {
            method: "POST",
            headers: new Headers({
                'content-type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }),
            body: body
        };
        let response = await fetch(url, fetchParameters);
        var reply = await response.json();
        console.info(reply)
        return reply;
    }

    async listAdapters(workbenchId) {
        var data = {
            "workbenchId" : workbenchId,
        };
        let body = JSON.stringify(data);

        let url = this.API_URL + "/search-adapters";
        let fetchParameters = {
            method: "POST",
            headers: new Headers({
                'content-type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }),
            body: body
        };
        let response = await fetch(url, fetchParameters);
        var reply = await response.json();
        console.info(reply)
        return reply;
    }
}