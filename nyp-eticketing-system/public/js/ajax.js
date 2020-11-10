const ajax = {
    get: async function(uri) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(uri, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    }, 
                    body: null
                });
    
                const json = await response.json();
                
                if (response.status >= 400 && response.status < 600) {
                    reject(json);
                } else {
                    resolve(json.data);
                }
            } catch (error) {
                reject(error);
            }
        });
    },
    post: async function(uri, data) {
        switch (typeof data) {
            case 'undefined':
                data = null;
                break;
            case 'object':
                data = JSON.stringify(data);
                break;
            default:
                data = JSON.stringify({data});
                break;
        }
    
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(uri, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: data
                });

                const json = await response.json();
                
                if (response.status >= 400 && response.status < 600) {
                    reject(json);
                } else {
                    resolve(json.data);
                }
            } catch (error) {
                reject(error);
            }
        });
    },
    update: async function(uri, data) {
        switch (typeof data) {
            case 'null':
            case 'undefined':
                data = null;
                break;
            case 'object':
                data = JSON.stringify(data);
                break;
            default:
                data = JSON.stringify({data});
                break;
        }
    
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(uri, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: data
                });
                
                const json = await response.json();
                
                if (response.status >= 400 && response.status < 600) {
                    reject(json);
                } else {
                    resolve(json.data);
                }
            } catch (error) {
                reject(error);
            }
        });
    },
    delete: async function(uri) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(uri, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: null
                });
                
                const json = await response.json();
                
                if (response.status >= 400 && response.status < 600) {
                    reject(json);
                } else {
                    resolve(true);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
};