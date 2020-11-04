class User {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.email = obj.email;
        this.isAdmin = obj.isAdmin;
        this.isHelper = obj.isHelper;
        this.isPlanner = obj.isPlanner;
        this.createdAt = obj.createdAt;
    }

    static parseApiResult(result) {
        return new User({
            id: result.id,
            name: result.name,
            email: result.email,
            isAdmin: result.isAdmin,
            isHelper: result.isHelper,
            isPlanner: result.isPlanner,
            createdAt: result.createdAt,
        });
    };
}