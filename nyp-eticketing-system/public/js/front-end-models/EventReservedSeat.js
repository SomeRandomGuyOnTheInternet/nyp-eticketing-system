class EventReservedSeat {
    constructor(obj) {
        this.id = obj.id;
        this.seatNumber = obj.seatNumber;
        this.attendeeId = obj.attendeeId;
        this.createdAt = obj.createdAt;
    }

    static parseApiResult(result) {
        return new EventReservedSeat({
            id: result.id,
            seatNumber: result.seatNumber,
            attendeeId: result.attendeeId,
            createdAt: result.createdAt
        });
    }

    convertToApiFormat() {
        return {
            id: this.id,
            seatNumber: this.seatNumber,
            attendeeId: this.attendeeId,
            createdAt: this.createdAt
        }
    }
}