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

    static parseDbResult(result) {
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

class Helper extends User {
    static populateSelect = (helpers, selectId) => {
        let select = document.getElementById(selectId.substring(1));
        [...select.options].forEach(option => option.remove());

        const defaultOption = document.createElement('option');
        defaultOption.text = `Select Helper...`;
        defaultOption.disabled = true;
        select.add(defaultOption);

        for (let i = 0; i < helpers.length; i++) {
            const option = document.createElement('option');
            option.text = `${helpers[i].name} - ${helpers[i].email}`;
            option.value = i;
            select.add(option);
        }

        select.selectedIndex = 0;
    };

    static selectedOption(venues, selectId) {
        const selectVal = document.getElementById(selectId.substring(1)).value;
        
        if (!selectVal) {
            throwException('The selected option is not valid. Please try again later!');
        }
    
        if (isNaN(selectVal)) {
            throwException('The selected option is not valid. Please try again later!');
        }
    
        return venues[parseInt(selectVal)];
    };
    
    static populateColumn = (helpers, columnId) => {
        const column = $(columnId).empty();

        if (helpers.length > 0) {
            for (let i = 0; i < helpers.length; i++) {
                column.append(renderStudentHelperCardNode(helpers[i]));
            }
        } else {
            column.append(renderNoStudentHelpersSelectedNode());
        }
    };
}