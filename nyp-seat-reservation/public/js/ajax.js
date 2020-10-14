const apiRoutes = {
    createVenue: "/api/create-venue",
    getAllVenues: "/api/get-all-venues",
    updateVenue: "/api/update-venue",
    deleteVenue: "/api/delete-venue",
    getAllHelpers: "/api/get-all-helpers",
    createEvent: "/api/create-event",
    createEventSeatTypes: "/api/create-event-seat-types",
    createEventHelpers: "/api/create-event-helpers",
    test: "/api/test",
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

createEvent = async (name, seatMap, startDateTime, seatsPerReservation, prioritiseBackRows, venueId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(apiRoutes.createEvent, 'POST', 
                {
                    name: name,
                    seatMap: seatMap,
                    startDateTime: startDateTime,
                    seatsPerReservation: seatsPerReservation,
                    prioritiseBackRows: prioritiseBackRows,
                    venueId: venueId,
                }
            );
            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
};

createEventSeatTypes = async (seatTypeArray) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(apiRoutes.createEventSeatTypes, 'POST', 
                {
                    seatTypes: seatTypeArray
                }
            );
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
};

createEventHelpers = async (eventHelperArray) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(apiRoutes.createEventHelpers, 'POST', 
                {
                    eventHelpers: eventHelperArray
                }
            );
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
};


callTestApi = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(apiRoutes.test, 'GET', null);
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
};