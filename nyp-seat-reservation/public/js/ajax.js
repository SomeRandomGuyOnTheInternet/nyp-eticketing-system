const baseRoute = "/api/";

createVenue = async (name, map) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(`${baseRoute}/create-venue`, 'POST', 
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
            const res = await promiseAjax(`${baseRoute}/get-all-venues`, 'GET', null);
            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
};

updateVenue = async (venue) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(`${baseRoute}/update-venue`, 'POST', 
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
            const res = await promiseAjax(`${baseRoute}/delete-venue`, 'POST', 
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
            const res = await promiseAjax(`${baseRoute}/get-all-helpers`, 'GET', null);
            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
};

createEvent = async (name, seatMap, startDateTime, seatsPerReservation, prioritiseBackRows, venueId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(`${baseRoute}/create-event`, 'POST', 
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

getEventDetailsForHelper = async (eventId, helperId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(`${baseRoute}/helpers/${helperId}/events/${eventId}`, 'GET');
            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
};

createEventSeatTypes = async (seatTypeArray) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(`${baseRoute}/create-event-seat-types`, 'POST', 
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
            const res = await promiseAjax(`${baseRoute}/create-event-helpers`, 'POST', 
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
            const res = await promiseAjax(
                'https://sms.sit.nyp.edu.sg/SMSWebService/sms.asmx/sendMessage', 
                'POST',
                `SMSAccount=FYPJ01&Pwd=529287&Mobile=91864675&Message=innocent  message`,
                'jsonp', 
                'application/x-www-form-urlencoded');
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
};