function createInstance(Users) {
    Users.bulkCreate([
        {
            email: 'admin@mymail.nyp.edu.sg',
            password: '$2b$10$fFa9pF3n2igqepN554DYqOsIhwheea4GHLb.84qt3mFlX5S2pP0t2',
            name: 'Admin',
            isAdmin: true,
            isPlanner: false,
            isHelper: false,
            isDeleted: false
        },
        {
            email: '173560N@mymail.nyp.edu.sg',
            password: '$2b$10$7i/6BXhLLb/6ad5EhPc/8Ocvg4dSn2dBg4qr18.jvsbyWKHW6j76m',
            name: 'Vignesh',
            isAdmin: false,
            isPlanner: false,
            isHelper: true,
            isDeleted: false
        },
        {
            email: 'john_doe@mymail.nyp.edu.sg',
            password: '$2b$10$oB4JiW92q0LMyjIWS2yM6uBGirey6pVG4XCDaoRDjZEI8U9viROFe',
            name: 'John Doe',
            isAdmin: false,
            isPlanner: true,
            isHelper: false,
            isDeleted: false
        },
    ]);
};

module.exports = createInstance;