const routes = {
    base: "/api/",
    index: {
        successFlash: "/api/success-flash",
        errorFlash: "/api/error-flash"
    },
    admin: {
        planners: "/api/admin/planners",
        helpers: "/api/admin/helpers",
        venues: "/api/admin/venues",
    },
    planner: {
        helpers: "/api/planner/helpers",
        events: "/api/planner/events",
        venues: "/api/planner/venues",
        reservations: "/api/planner/reservations",
    },
    helper: {
        events: "/api/helper/events",
        reservations: "/api/helper/event/reservations",
        attendees: "/api/helper/event/attendees",
        sendConfirmationSMS: "/api/helper/sms-reservation-confirm",
    }
};