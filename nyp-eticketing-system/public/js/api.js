const routes = {
    base: "/api/",
    index: {
        successFlash: "/api/success-flash",
        errorFlash: "/api/error-flash"
    },
    admin: {
        planner: "/api/admin/planner",
        helpers: "/api/admin/helpers",
        venues: "/api/admin/venues",
    },
    planner: {
        helpers: "/api/planner/helpers",
        events: "/api/planner/events",
        venues: "/api/planner/venues",
    }
};

fetchFrom = (uri) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: null,
            success: function (res) {
                resolve(res.data);
            },
            error: function (error) {
                resolve(error);
            },
        }).fail(function (jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        });
    });
};

postTo = (uri, data) => {
    if (data) {
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
    } else {
        data = null;
    }

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data,
            success: function (res) {
                resolve(res.data);
            },
            error: function (error) {
                resolve(error);
            },
        }).fail(function (jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        });
    });
};

updateTo = (uri, data) => {
    if (data) {
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
    } else {
        data = null;
    }

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "PUT",
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data,
            success: function (res) {
                resolve(res.data);
            },
            error: function (error) {
                resolve(error);
            },
        }).fail(function (jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        });
    });
};

deleteFrom = (uri) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "DELETE",
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: null,
            success: function (res) {
                resolve(res.data);
            },
            error: function (error) {
                reject(error);
            },
        }).fail(function (jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        });
    });
};