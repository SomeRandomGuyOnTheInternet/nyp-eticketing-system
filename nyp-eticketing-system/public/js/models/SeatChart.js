// Helper functions
// General dependency functions
resizeArray = (arr, size, defval) => {
    var delta = arr.length - size;

    if (delta > 0) {
        arr.length = size;
    } else {
        while (delta++ < 0) { 
            arr.push(defval); 
        }
    }
};

class SeatChart {
	constructor(obj) {
        this.map = obj.map;
		this.seatTypes = obj.seatTypes;
		this.naming = obj.naming;
		this.legend = obj.legend;

		this.mapNode = obj.mapNode;
		this.wrapperNode = obj.wrapperNode;
		this.legendNode = obj.legendNode;
		this.activeNode = obj.activeNode;

		this.onClick = null;
	};

	// Binding and reloading map stuff
	bindMap = () => {
		this.activeNode = $(this.mapNode).seatCharts({
			seats: this.seatTypes.reduce(function(seats, seat) {
				seats[seat.char] = {
					category: seat.category,
					blocked: seat.blocked,
					classes: seat.classes,
                };
				return seats;
			}, {}),
			map: this.map,
			naming: this.naming,
			legend: this.legend,
			click: this.onClick
        });
	};

	unbindMap = () => {
		$('.seatCharts-row').remove();
		$(this.legendNode).empty();
		$(`${this.mapNode}, ${this.mapNode} *`).unbind().removeData();
		$(this.mapNode).attr('aria-activedescendant', null);
	};

	reloadMap = () => {
		const orgHeight = $(this.mapNode)[0].getBoundingClientRect().height; // Get the original height of the seat map before changing the number of rows

        this.unbindMap();
		this.bindMap();

		this.resizeParentHeight(orgHeight);
		this.scaleContentWidth(); // Scale the map so the columns are all visible

		return this.activeMap;
	};

	// Responsive functions
	scaleContentWidth = () => { // This function scales the content's width proportional to the parent container's width
		const orgHeight = $(this.mapNode)[0].getBoundingClientRect().height; // This gets the initial height of the content before the transformation

		const scale = $(this.wrapperNode).width() / ($(this.mapNode).width()); // This equation get us the scale of the parent's width in relation to the container's width
		$(this.mapNode).css('transform', 'scale(' + Math.min(1.75, scale) + ')'); // We then apply the scale obtained above to the content's scale css property to scale appropriately
		$(this.mapNode).css('transform-origin', 'top left'); // This just makes sure we scale it from the correct point

		this.resizeParentHeight(orgHeight);
	};

	resizeParentHeight = (orgHeight) => { // This function resizes the parent's height using the delta between the original hight and the current height of the content
		const newHeight = $(this.mapNode)[0].getBoundingClientRect().height; // Here we get the new height of the content
		const deltaHeight = newHeight - orgHeight; // Then we get the delta between the original height of the content and the new height of the content
		$(this.wrapperNode).css("height", `${$(this.wrapperNode).height() + deltaHeight}px`); // The delta is then added with the parent's height to ensure the parent's height is updated according to how much the difference between the original and the new content height is.
	};

	// Seat map editing functions
	replaceMapSeat = (seatNode, selectedSeatType) => {
		const seat = this.seatTypes.filter(seat => { return seat.char === selectedSeatType })[0];

		if (seat) {
			seatNode.settings.character = seat.char;
			seatNode.settings.data = seat;

			this.replaceMapSeatClasses(seatNode.settings.$node, seat.classes);
			this.replaceMapSeatCharacter(seatNode.settings, seat.char);
		};

		return 'available';
	};

	replaceMapSeatCharacter = (seatSettings, newCharacter) => {
		this.map[seatSettings.row] = this.map[seatSettings.row].replaceAt(seatSettings.column, newCharacter);
	};

	replaceMapSeatClasses = (node, classes) => {
		node.removeClass();
		node
			.addClass("seatCharts-seat seatCharts-cell")
			.addClass(classes)
			.addClass("available");
	};

	replaceMapSeatCharacters = (characterToReplace, newCharacter) => {
		for (let i = 0; i < this.map.length; i++) {
			this.map[i] = this.map[i].replaceAll(characterToReplace, newCharacter);
		}
	};

	resizeRows = (columns, rows) => {
		const defaultRow = defaultSeat.repeat(columns); // The default row is just the one that gets assigned to any new row that's created. We take the number of columns the user input and multiply it by the default seat type (general, G) to get it
        resizeArray(this.map, rows, defaultRow); // And then we use the resize function to remove or add rows with the default row depending on the user's input
	};
	
	resizeColumns = (columns, rows) => {
		for (let i = 0; i < rows; i++) { // To change the number of columns we have to loop through each row indvidually and resize them
            const splitRow = [...this.map[i]]; // Since rows are stored as strings in the map, we have to split them into an array
            resizeArray(splitRow, columns, defaultSeat); // Then we just have to join the array into a string and then put them back into the map
			this.map[i] = splitRow.join(""); // Then we just have to join the array into a string and then put them back into the map
        }
	};

	spliceRow = (startRow, endRow) => {
		this.map.splice(startRow, Math.max(1, endRow));
	};

	spliceMapCol = (startCol, endCol) => {
		for (let i = 0; i < this.map.length; i++) {
			const splitRow = [...this.map[i]].splice(startCol, Math.max(1, endCol)); // Since rows are stored as strings in the map, we have to split them into an array and then splice them
			this.map[i] = splitRow.join(""); // Then we just have to join the array into a string and then put them back into the map
		}
	};

	// Other functions
	disableBlockedSeats = () => {
		for (let i = 0; i < this.seatTypes.length; i++) {
			if (this.seatTypes[i].blocked) {
				this.activeNode.find(this.seatTypes[i].char).status('blocked');
			}
		}
	};
	
	disableReservedSeats = (reservedSeats) => {
		for (let i = 0; i < reservedSeats.length; i++) {
			const reservedSeat = this.activeNode.get(reservedSeats[i].seatNumber);
			if (typeof reservedSeat !== 'undefined' && reservedSeat !== null) {
				reservedSeat.status('reserved');
			}
		}
	};
}