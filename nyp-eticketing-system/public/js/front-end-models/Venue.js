class Venue {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.seatMap = obj.seatMap;
        this.createdAt = obj.createdAt;
    };

    static parseApiResult(result) {
        return new Venue({
            id: result.id,
            name: result.name,
            seatMap: result.seatMap,
            createdAt: result.createdAt,
        });
    };
    
    static populateSelect(venues, selectId) {
        const select = document.getElementById(selectId.substring(1));
        [...select.options].forEach(option => option.remove());

        for (let i = 0; i < venues.length; i++) {
            const option = document.createElement('option');
            option.text = venues[i].name;
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
}