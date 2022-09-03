class EventHelper extends User {
    constructor(obj) {
        super(obj);
    }

    convertToApiFormat(eventId) {
        return {
            userId: this.id,
            eventId: eventId
        }
    };

    static parseApiResult(result) {
        return new EventHelper({
            id: result.id,
            name: result.name,
            email: result.email,
            phoneNumber: result.phoneNumber,
            isAdmin: result.isAdmin,
            isHelper: result.isHelper,
            isPlanner: result.isPlanner,
            createdAt: result.createdAt,
        });
    };

    static populateSelect(helpers, select) {
        [...select.options].forEach(option => option.remove());

        const defaultOption = document.createElement('option');
        defaultOption.text = `Select Helper...`;
        defaultOption.disabled = true;
        select.add(defaultOption);

        for (let i = 0; i < helpers.length; i++) {
            const option = document.createElement('option');
            option.text = `${helpers[i].name} - ${helpers[i].email}`;
            option.value = helpers[i].id;
            select.add(option);
        }

        select.selectedIndex = 0;
    };

    static selectedOption(helpers, select) {
        const selectVal = select.value;
        
        if (!selectVal) {
            utils.throwException('The selected option is not valid. Please try again later!');
        }
    
        if (isNaN(selectVal)) {
            utils.throwException('The selected option is not valid. Please try again later!');
        }

        const helper = helpers.filter(helper => helper.id == parseInt(selectVal));

        if (helper.length !== 1) {
            utils.throwException('The selected option is not valid. Please try again later!');
        }
    
        return helper[0];
    };
    
    static populateColumn(helpers, columnId) {
        const column = $(columnId).empty();

        if (helpers.length > 0) {
            for (let i = 0; i < helpers.length; i++) {
                column.append(templates.helperCard(helpers[i]));
            }
        } else {
            column.append(templates.noHelpersSelected());
        }
    };
}