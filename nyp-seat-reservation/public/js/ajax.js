const apiRoutes = {
    createVenue: "/api/create-venue",
    getAllVenues: "/api/get-all-venues",
    updateVenue: "/api/update-venue",
    deleteVenue: "/api/delete-venue",
    getAllHelpers: "/api/get-all-helpers",
};

promiseAjax = (uri, method, data) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            success: function (data) {
                resolve(data)
            },
            error: function (error) {
                reject(error)
            },
        }).fail(function (jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        });
    });
};

createVenue = async (name, map) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(apiRoutes.createVenue, 'POST', 
                {
                    name: name,
                    seatMap: map
                }
            );
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
};

getAllVenues = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(apiRoutes.getAllVenues, 'GET', null);
            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
};

updateVenue = async (venue) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(apiRoutes.updateVenue, 'POST', 
                {
                    venue: venue
                }
            );
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
};

deleteVenue = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(apiRoutes.deleteVenue, 'POST', 
                {
                    id: id
                }
            );
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
};

getAllHelpers = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(apiRoutes.getAllHelpers, 'GET', null);
            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
};