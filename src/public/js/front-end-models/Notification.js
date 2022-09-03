class Notification {
    constructor(obj) {
        this.id = obj.id;
        this.message = obj.message;
        this.type = obj.type;
        this.userId = obj.userId;
    }

    static parseApiResult(result) {
        return new Event({
            id: result.id,
            name: result.name,
            seatMap: result.seatMap,
            startDateTime: result.startDateTime,
            seatsPerReservation: result.seatsPerReservation,
            prioritiseBackRows: result.prioritiseBackRows,
            noOfReservableSeats: result.noOfReservableSeats,
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
            noOfReservableSeats: this.noOfReservableSeats,
            venueId: this.venue?.id,
            seatTypes: this.seatTypes?.map(seatType => seatType.convertToApiFormat(this.id)),
            eventHelpers: this.helpers?.map(helper => helper.convertToApiFormat(this.id))
        }
    }
}