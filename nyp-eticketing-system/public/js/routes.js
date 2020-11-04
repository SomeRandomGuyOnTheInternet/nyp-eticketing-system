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
    },
    helper: {
        events: "/api/helper/events",
        reservations: "/api/helper/reservations",
        sendConfirmationSMS: "/api/helper/sms-reservation-confirm",
    }
};