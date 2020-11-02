class Event {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.seatMap = obj.seatMap;
        this.startDateTime = obj.startDateTime;
        this.seatsPerReservation = obj.seatsPerReservation;
        this.prioritiseBackRows = obj.prioritiseBackRows;
        this.venue = obj.venue;
        this.seatTypes = obj.seatTypes;
        this.reservedSeats = obj.reservedSeats;
        this.helpers = obj.helpers;
        this.attendees = obj.attendees;
    }
}