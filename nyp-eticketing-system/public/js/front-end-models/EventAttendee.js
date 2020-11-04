
class EventAttendee {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.phoneNumber = obj.phoneNumber;
        this.createdAt = obj.createdAt;
    }

    static parseApiResult(result) {
        return new EventAttendee({
            id: result.id,
            name: result.name,
            phoneNumber: result.phoneNumber,
            createdAt: result.createdAt
        });
    }

    convertToApiFormat() {
        return {
            id: this.id,
            name: this.name,
            phoneNumber: this.phoneNumber,
            createdAt: this.createdAt
        }
    }
}