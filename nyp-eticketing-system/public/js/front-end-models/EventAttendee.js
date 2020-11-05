
class EventAttendee {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.phoneNumber = obj.phoneNumber;
        this.createdAt = obj.createdAt;
        this.reservedSeats = obj.reservedSeats;
        this.noOfExtraAttendees = obj.noOfExtraAttendees;
        this.eventId = obj.eventId;
    }

    static parseApiResult(result) {
        return new EventAttendee({
            id: result.id,
            name: result.name,
            phoneNumber: result.phoneNumber,
            noOfExtraAttendees: result.noOfExtraAttendees,
            createdAt: result.createdAt
        });
    }
}