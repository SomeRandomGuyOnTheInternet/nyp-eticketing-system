class SeatType {
    constructor(obj) {
        this.id = obj.id,
        this.char = obj.char;
        this.category = obj.category;
        this.blocked = obj.blocked;
        this.classes = obj.classes;
    }

    static parseApiResult(result) {
        return new SeatType({
            id: result.id,
            char: result.character,
            category: result.name,
            blocked: result.isBlocked,
            classes: result.cssClasses,
        });
    }

    convertToApiFormat(eventId) {
        return {
            id: this.id,
            name: this.category,
            character: this.char,
            isBlocked: this.blocked,
            cssClasses: this.classes,
            eventId: eventId
        }
    }
}