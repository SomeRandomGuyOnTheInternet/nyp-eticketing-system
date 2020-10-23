const baseRoute = "/api";

async function flashSuccess(message) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(
                `${baseRoute}/success-flash`, 
                'POST', 
                {
                    message: message,
                }
            );
            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
};

async function flashError(message) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(
                `${baseRoute}/error-flash`, 
                'POST', 
                {
                    message: message,
                }
            );
            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
};

async function createVenue(name, map) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(
                `${baseRoute}/create-venue`, 
                'POST', 
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

async function getAllVenues() {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(`${baseRoute}/get-all-venues`, 'GET', null);
            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
};

async function updateVenue(venue) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(
                `${baseRoute}/update-venue`, 
                'POST', 
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

async function deleteVenue(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(
                `${baseRoute}/delete-venue`, 
                'POST', 
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

async function getAllHelpers() {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(`${baseRoute}/get-all-helpers`, 'GET', null);
            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
};

async function createEvent(name, seatMap, startDateTime, seatsPerReservation, prioritiseBackRows, venueId) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(
                `${baseRoute}/create-event`, 
                'POST', 
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

async function getEventDetailsForHelper(eventId, helperId) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(
                `${baseRoute}/helpers/${helperId}/events/${eventId}`, 'GET');

            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
};

async function createEventSeatTypes(seatTypeArray) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(
                `${baseRoute}/create-event-seat-types`, 
                'POST', 
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

async function createEventHelpers (eventHelperArray) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(
                `${baseRoute}/create-event-helpers`, 
                'POST', 
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

async function createEventAttendee (name, phoneNumber, eventId) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(
                `${baseRoute}/create-event-attendee`, 
                'POST', 
                {
                    name: name,
                    phoneNumber: phoneNumber,
                    eventId: eventId
                }
            );
            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
};

async function createEventSeatReservation(seatNumber, eventId, attendeeId) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(
                `${baseRoute}/create-event-seat-reservation`, 
                'POST', 
                {
                    seatNumber: seatNumber,
                    eventId: eventId,
                    attendeeId: attendeeId,
                }
            );
            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
};

// async function* createEventSeatReservations(seatNumbers, eventId, attendeeId) {
//     for (let i = 0; i < seatNumbers.length; i++) {
//         try {
//             const res = await promiseAjax(
//                 `${baseRoute}/create-event-seat-reservation`, 
//                 'POST', 
//                 {
//                     seatNumber: seatNumbers[i],
//                     eventId: eventId,
//                     attendeeId: attendeeId,
//                 }
//             );
//             yield res.data;
//         } catch (error) {
//             throwException(error);
//         }
//     }
// }

// TODO: make the actual post on the server-side
sendSMS = async (number, message) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(
                'https://sms.sit.nyp.edu.sg/SMSWebService/sms.asmx/sendMessage', 
                'POST',
                `SMSAccount=FYPJ01&Pwd=529287&Mobile=${number}&Message=${message}`,
                'jsonp', 
                'application/x-www-form-urlencoded');
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
};




callTestApi = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await promiseAjax(`${baseRoute}/test`, 'GET', null);
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
};