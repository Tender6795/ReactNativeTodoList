export class Http {
    static HEADERS = { 'Content-Type': 'aplication/json' }

    static async get(url) {
        return await request(url)
    }

    static async post(url, data = {}) {
        return await request(url, "POST", data)
    }

    static async delete(url) {
        return await request(url, "DELETE")
    }

    static async patch(url, data = {}) {
        return await request(url, "PATCH", data)
    }
}
async function request(url, method = 'GET', data) {

    const config = {
        method,
        headers: Http.HEADERS
    }
    if (method === 'POST' || method === 'PATCH') {
        config.body = JSON.stringify(data)
    }
    try {
        const response = await fetch(url, config)
        return await response.json()
    } catch (error) {
        console.log(error)
        throw (error)
    }
}