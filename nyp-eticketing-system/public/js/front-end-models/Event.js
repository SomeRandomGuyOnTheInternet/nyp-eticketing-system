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
        this.helpers = obj.helpers;
        this.reservedSeats = obj.reservedSeats;
        this.attendees = obj.attendees;
    }

    static parseApiResult(result) {
        return new Event({
            id: result.id,
            name: result.name,
            seatMap: result.seatMap,
            startDateTime: result.startDateTime,
            seatsPerReservation: result.seatsPerReservation,
            prioritiseBackRows: result.prioritiseBackRows,
            venue: Venue.parseApiResult(result.venue),
            seatTypes: result.seatTypes ? result.seatTypes?.map(seatType => SeatType.parseApiResult(seatType)) : [],
            helpers: result.helpers ? result.helpers.map(helper => EventHelper.parseApiResult(helper)) : [],
            reservedSeats: result.reservedSeats ? result.reservedSeats.map(reservedSeat => EventReservedSeat.parseApiResult(reservedSeat)) : [],
            attendees: result.attendees ? result.attendees.map(attendee => EventAttendee.parseApiResult(attendee)) : [],
        });
    }

    convertToApiFormat() {
        return {
            id: this.id,
            name: this.name,
            seatMap: this.seatMap,
            startDateTime: this.startDateTime,
            seatsPerReservation: this.seatsPerReservation,
            prioritiseBackRows: this.prioritiseBackRows,
            venueId: this.venue?.id,
            seatTypes: this.seatTypes?.map(seatType => seatType.convertToApiFormat(this.id)),
            eventHelpers: this.helpers?.map(helper => helper.convertToApiFormat(this.id))
        }
    }
}