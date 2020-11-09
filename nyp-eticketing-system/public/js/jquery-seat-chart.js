/*!
 * jQuery-Seat-Charts v1.1.5
 * https://github.com/mateuszmarkowski/jQuery-Seat-Charts
 *
 * Copyright 2013, 2016 Mateusz Markowski
 * Released under the MIT license
 */

// TODO: Convert to javascript/react

(function($) {
		
	//'use strict';	
		
	$.fn.seatCharts = function (setup) {

		//if there's seatCharts object associated with the current element, return it
		if (this.data('seatCharts')) {
			return this.data('seatCharts');
		}
		
		var fn        = this,
			seats     = {},
			seatIds   = [],
			seatIdMap = [[]],
			settings  = {
				animate : false, //requires jQuery UI
				naming  : {
					top      : true,
					left     : true,
					getId    : function(character, row, column) {
						return row + ':' + column;
					},
					getLabel : function (character, row, column) {
						return row + ':' + column;
					}	
				}, 
				legend  : {
					node     : null,
					items    : []
				},
				click   : function() {
					if (this.status() == 'available') {
						return 'selected';
					} else if (this.status() == 'selected') {
						return 'available';
					} else {
						return this.style();
					}
				},
				focus   : function() {
					if (this.status() == 'available') {
						return 'focused';
					} else  {
						return this.style();
					}
				},
				blur    : function() {
					return this.status();
				},
				seats   : {}
			
			},
			// seat will be basically a seat object which we'll when generating the map
			seat = (function(seatCharts, seatChartsSettings) {
				return function (setup) {
					var fn = this;
					
					fn.settings = $.extend({
						status : 'available', //available, unavailable, selected
						style  : 'available',
						//make sure there's an empty hash if user doesn't pass anything
						data   : seatChartsSettings.seats[setup.character] || {}
						//anything goes here?
					}, setup);

					fn.settings.$node = $('<div></div>');
					
					fn.settings.$node
						.attr({
							id               : fn.settings.id,
							role             : 'checkbox',
							'data-toggle'    : 'tooltip',
							'data-placement' : 'top',
							title            : fn.settings.id,
							'aria-checked'   : false,
							focusable        : true,
							tabIndex         : -1 //manual focus
						})
						// .text(fn.settings.label) // to remove numbers in seats
						.addClass(['seatCharts-seat', 'seatCharts-cell', 'available'].concat(
							//let's merge custom user defined classes with standard JSC ones
							fn.settings.classes, 
							typeof seatChartsSettings.seats[fn.settings.character] == "undefined" ? 
								[] : seatChartsSettings.seats[fn.settings.character].classes
							).join(' '));
					
					//basically a wrapper function
					fn.data = function() {
						return fn.settings.data;
					};
					
					fn.char = function() {
						return fn.settings.character;
					};
					
					fn.node = function() {
						return fn.settings.$node;						
					};

					/*
					 * Can either set or return status depending on arguments.
					 *
					 * If there's no argument, it will return the current style.
					 *
					 * If you pass an argument, it will update seat's style
					 */
					fn.style = function() {
						return arguments.length == 1 ?
							(function(newStyle) {
								var oldStyle = fn.settings.style;

								//if nothing changes, do nothing
								if (newStyle == oldStyle) {
									return oldStyle;
								}
								
								//focused is a special style which is not associated with status
								fn.settings.status = newStyle != 'focused' ? newStyle : fn.settings.status;
								fn.settings.$node
									.attr('aria-checked', newStyle == 'selected');

								//if user wants to animate status changes, let him do this
								seatChartsSettings.animate ?
									fn.settings.$node.switchClass(oldStyle, newStyle, 200) :
									fn.settings.$node.removeClass(oldStyle).addClass(newStyle);
									
								return fn.settings.style = newStyle;
							})(arguments[0]) : fn.settings.style;
					};
					
					//either set or retrieve
					fn.status = function() {
						return fn.settings.status = arguments.length == 1 ? 
							fn.style(arguments[0]) : fn.settings.status;
					};
					
					//using immediate function to convienietly get shortcut variables
					(function(seatSettings, character, seat) {
						//attach event handlers
						$.each(['click', 'focus', 'blur'], function(index, callback) {
						
							//we want to be able to call the functions for each seat object
							fn[callback] = function() {
								if (callback == 'focus') {
									//if there's already a focused element, we have to remove focus from it first
									if (seatCharts.attr('aria-activedescendant') !== undefined) {
										seats[seatCharts.attr('aria-activedescendant')].blur();
									}
									seatCharts.attr('aria-activedescendant', seat.settings.id);
									seat.node().focus();
								}
							
								/*
								 * User can pass his own callback function, so we have to first check if it exists
								 * and if not, use our default callback.
								 *
								 * Each callback function is executed in the current seat context.
								 */
								return fn.style(typeof seatSettings[character][callback] === 'function' ?
									seatSettings[character][callback].apply(seat) : seatChartsSettings[callback].apply(seat));
							};
							
						});
					//the below will become seatSettings, character, seat thanks to the immediate function		
					})(seatChartsSettings.seats, fn.settings.character, fn);
							
					fn.node()
						//the first three mouse events are simple
						.on('click',      fn.click)
						.on('mouseenter', fn.focus)
						.on('mouseleave', fn.blur)
						
						//keydown requires quite a lot of logic, because we have to know where to move the focus
						.on('keydown',    (function(seat, $seat) {
						
							return function (e) {
								
								var $newSeat;
								
								//everything depends on the pressed key
								switch (e.which) {
									//spacebar will just trigger the same event mouse click does
									case 32:
										e.preventDefault();
										seat.click();
										break;
									//UP & DOWN
									case 40:
									case 38:
										e.preventDefault();
										
										/*
										 * This is a recursive, immediate function which searches for the first "focusable" row.
										 * 
										 * We're using immediate function because we want a convenient access to some DOM elements
										 * We're using recursion because sometimes we may hit an empty space rather than a seat.
										 *
										 */
										$newSeat = (function findAvailable($rows, $seats, $currentRow) {
											var $newRow;
											
											//let's determine which row should we move to
											
											if (!$rows.index($currentRow) && e.which == 38) {
												//if this is the first row and user has pressed up arrow, move to the last row
												$newRow = $rows.last();
											} else if ($rows.index($currentRow) == $rows.length-1 && e.which == 40) {
												//if this is the last row and user has pressed down arrow, move to the first row
												$newRow = $rows.first();
											} else {
												//using eq to get an element at the desired index position
												$newRow = $rows.eq(
													//if up arrow, then decrement the index, if down increment it
													$rows.index($currentRow) + (e.which == 38 ? (-1) : (+1))
												);
											}												
											
											//now that we know the row, let's get the seat using the current column position
											$newSeat = $newRow.find('.seatCharts-seat,.seatCharts-space').eq($seats.index($seat));
											
											//if the seat we found is a space, keep looking further
											return $newSeat.hasClass('seatCharts-space') ?
												findAvailable($rows, $seats, $newRow) : $newSeat;
											
										})($seat
											//get a reference to the parent container and then select all rows but the header
												.parents('.seatCharts-container')
												.find('.seatCharts-row:not(.seatCharts-header)'),
											$seat
											//get a reference to the parent row and then find all seat cells (both seats & spaces)
												.parents('.seatCharts-row:first')
												.find('.seatCharts-seat,.seatCharts-space'),
											//get a reference to the current row
											$seat.parents('.seatCharts-row:not(.seatCharts-header)')
										);
										
										//we couldn't determine the new seat, so we better give up
										if (!$newSeat.length) {
											return;
										}
										
										//remove focus from the old seat and put it on the new one
										seat.blur();
										seats[$newSeat.attr('id')].focus();
										$newSeat.focus();
										
										//update our "aria" reference with the new seat id
										seatCharts.attr('aria-activedescendant', $newSeat.attr('id'));
																			
										break;										
									//LEFT & RIGHT
									case 37:
									case 39:
										e.preventDefault();
										/*
										 * The logic here is slightly different from the one for up/down arrows.
										 * User will be able to browse the whole map using just left/right arrow, because
										 * it will move to the next row when we reach the right/left-most seat.
										 */
										$newSeat = (function($seats) {
										
											if (!$seats.index($seat) && e.which == 37) {
												//user has pressed left arrow and we're currently on the left-most seat
												return $seats.last();
											} else if ($seats.index($seat) == $seats.length -1 && e.which == 39) {
												//user has pressed right arrow and we're currently on the right-most seat
												return $seats.first();
											} else {
												//simply move one seat left or right depending on the key
												return $seats.eq($seats.index($seat) + (e.which == 37 ? (-1) : (+1)));
											}

										})($seat
											.parents('.seatCharts-container:first')
											.find('.seatCharts-seat:not(.seatCharts-space)'));
										
										if (!$newSeat.length) {
											return;
										}
											
										//handle focus
										seat.blur();	
										seats[$newSeat.attr('id')].focus();
										$newSeat.focus();
										
										//update our "aria" reference with the new seat id
										seatCharts.attr('aria-activedescendant', $newSeat.attr('id'));
										break;	
									default:
										break;
								
								}
							};
								
						})(fn, fn.node()));
						//.appendTo(seatCharts.find('.' + row));

				}
			})(fn, settings);
			
		fn.addClass('seatCharts-container');
		
		//true -> deep copy!
		$.extend(true, settings, setup);		
		
		//Generate default row ids unless user passed his own
		settings.naming.rows = settings.naming.rows || (function(length) {
			var rows = [];
			for (var i = 1; i <= length; i++) {
				rows.push(i);
			}
			return rows;
		})(settings.map.length);
		
		//Generate default column ids unless user passed his own
		settings.naming.columns = settings.naming.columns || (function(length) {
			var columns = [];
			for (var i = 1; i <= length; i++) {
				columns.push(i);
			}
			return columns;
		})(settings.map[0].split('').length);

		seatIdMap = new Array(settings.map.length).fill(null).map(() => new Array(settings.map[0].split('').length).fill(null));
		
		if (settings.naming.top) {
			var $headerRow = $('<div></div>')
				.addClass('seatCharts-row seatCharts-header');
			
			if (settings.naming.left) {
				$headerRow.append($('<div></div>').addClass('seatCharts-cell'));
			}
				
			$.each(settings.naming.columns, function(index, value) {
				$headerRow.append(
					$('<div></div>')
						.addClass('seatCharts-cell')
						.text(value)
				);
			});
		}
		
		fn.append($headerRow);
		
		//do this for each map row
		$.each(settings.map, function(row, characters) {

			var $row = $('<div></div>').addClass('seatCharts-row');
				
			if (settings.naming.left) {
				$row.append(
					$('<div></div>')
						.addClass('seatCharts-cell seatCharts-space')
						.text(settings.naming.rows[row])
				);
			}

			/*
			 * Do this for each seat (letter)
			 *
			 * Now users will be able to pass custom ID and label which overwrite the one that seat would be assigned by getId and
			 * getLabel
			 *
			 * New format is like this:
			 * a[ID,label]a[ID]aaaaa
			 *
			 * So you can overwrite the ID or label (or both) even for just one seat.
			 * Basically ID should be first, so if you want to overwrite just label write it as follows:
			 * a[,LABEL]
			 *
			 * Allowed characters in IDs areL 0-9, a-z, A-Z, _
			 * Allowed characters in labels are: 0-9, a-z, A-Z, _, ' ' (space)
			 *
			 */
			 
			$.each(characters.match(/[a-z_]{1}(\[[0-9a-z_]{0,}(,[0-9a-z_ ]+)?\])?/gi), function (column, characterParams) { 
				var matches         = characterParams.match(/([a-z_]{1})(\[([0-9a-z_ ,]+)\])?/i),
					//no matter if user specifies [] params, the character should be in the second element
					character       = matches[1],
					//check if user has passed some additional params to override id or label
					params          = typeof matches[3] !== 'undefined' ? matches[3].split(',') : [],
					//id param should be first
					overrideId      = params.length ? params[0] : null,
					//label param should be second
					overrideLabel   = params.length === 2 ? params[1] : null;
								
				$row.append(character != '_' ?
					//if the character is not an underscore (empty space)
					(function(naming) {
						//so users don't have to specify empty objects
						settings.seats[character] = character in settings.seats ? settings.seats[character] : {};
	
						var id = overrideId ? overrideId : naming.getId(character, naming.rows[row], naming.columns[column]);

						seats[id] = new seat({
							id        	  : id,
							label         : overrideLabel ?
							overrideLabel : naming.getLabel(character, naming.rows[row], naming.columns[column]),
							row           : row,
							column        : column,
							character     : character
						});

						seatIds.push(id);
						seatIdMap[row][column] = id;

						return seats[id].node();
					})(settings.naming) :
					//this is just an empty space (_)
					$('<div></div>').addClass('seatCharts-cell seatCharts-space')	
				);
			});
			
			fn.append($row);
		});

		seatIdMap.length = settings.map.length;
	
		//if there're any legend items to be rendered
		settings.legend.items.length ? (function(legend) {
			//either use user-defined container or create our own and insert it right after the seat chart div
			var $rowContainer = (legend.node || $('<div></div>').insertAfter(fn))
				.addClass('seatCharts-legend row');
			
			$.each(legend.items, function(index, item) {
				var $column = $('<div></div>')
					.addClass('seatCharts-cardColumn')
					.addClass('col-auto')
					.appendTo($rowContainer);

				var $card = $('<div></div>')
					.addClass('seatCharts-legendCard py-2 px-1')
					.addClass('card')
					.addClass(typeof item[3] == "undefined" ? "" : item[3])
					.addClass('mt-3')
					.attr("tabindex", -1)
					.attr("data-seat-character", settings.legend.items[index][0])
					.appendTo($column);

				var $cardBody = $('<div></div>')
					.addClass('seatCharts-cardBody')
					.addClass('card-body')
					.appendTo($card);

				$cardBody.append(
					$('<div></div>')
						.addClass('seatCharts-legendItem')
						.append(
							$('<div></div>')
								//merge user defined classes with our standard ones
								.addClass(['seatCharts-seat', 'seatCharts-cell', item[1]].concat(
									settings.classes, 
									typeof settings.seats[item[0]] == "undefined" ? [] : settings.seats[item[0]].classes).join(' ')
								)
						)
						.append(
							$('<span></span>')
								.addClass('seatCharts-legendDescription')
								.text(item[2])
						)
				);
			});
			
			return $rowContainer;
		})(settings.legend) : null;
	
		// fn.attr({
		// 	tabIndex : 0
		// });
		
		
		//when container's focused, move focus to the first seat
		// fn.focus(function() {
		// 	if (fn.attr('aria-activedescendant')) {
		// 		seats[fn.attr('aria-activedescendant')].blur();
		// 	}
				
		// 	fn.find('.seatCharts-seat:not(.seatCharts-space):first').focus();
		// 	seats[seatIds[0]].focus();

		// });
	
		//public methods of seatCharts
		fn.data('seatCharts', {
			seats     : seats,
			seatIds   : seatIds,
			seatIdMap : seatIdMap,
			//set for one, set for many, get for one
			status    : function() {
				var fn = this;
			
				return arguments.length == 1 ? fn.seats[arguments[0]].status() : (function(seatsIds, newStatus) {
				
					return typeof seatsIds == 'string' ? fn.seats[seatsIds].status(newStatus) : (function() {
						$.each(seatsIds, function(index, seatId) {
							fn.seats[seatId].status(newStatus);
						});
					})();
				})(arguments[0], arguments[1]);
			},
			each      : function(callback) {
				var fn = this;
			
				for (var seatId in fn.seats) {
					if (false === callback.call(fn.seats[seatId], seatId)) {
						return seatId;//return last checked
					}
				}
				
				return true;
			},
			node      : function() {
				var fn = this;
				//basically create a CSS query to get all seats by their DOM ids
				return $('#' + fn.seatIds.join(',#'));
			},

			find      : function(query) {//D, a.available, unavailable
				var fn = this;
			
				var seatSet = fn.set();
			
				//is RegExp
				return query instanceof RegExp ?
					(function () {
						fn.each(function (id) {
							if (id.match(query)) {
								seatSet.push(id, this);
							}
						});
						return seatSet;
					})() :
					(query.length == 1 ?
							(function (character) {
								//user searches just for a particual character
								fn.each(function () {
									if (this.char() == character) {
										seatSet.push(this.settings.id, this);
									}
								});

								return seatSet;
							})(query) :
							(function () {
								//user runs a more sophisticated query, so let's see if there's a dot
								return query.indexOf('.') > -1 ?
									(function () {
										//there's a dot which separates character and the status
										var parts = query.split('.');

										fn.each(function (seatId) {
											if (this.char() == parts[0] && this.status() == parts[1]) {
												seatSet.push(this.settings.id, this);
											}
										});

										return seatSet;
									})() :
									(function () {
										fn.each(function () {
											if (this.status() == query) {
												seatSet.push(this.settings.id, this);
											}
										});
										return seatSet;
									})();
							})()
					);
				
			},
			set       : function set() {//inherits some methods
				var fn = this;
				
				return {
					seats   : [],
					seatIds : [],
					length  : 0,
					status  : function() {
						var args = arguments,
							that = this;
						//if there's just one seat in the set and user didn't pass any params, return current status
						return this.length == 1 && args.length == 0 ? this.seats[0].status() : (function() {
							//otherwise call status function for each of the seats in the set
							$.each(that.seats, function() {
								this.status.apply(this, args);
							});
						})();
					},
					node    : function() {
						return fn.node.call(this);
					},
					each    : function() {
						return fn.each.call(this, arguments[0]);
					},
					get     : function() {
						return fn.get.call(this, arguments[0]);
					},
					find    : function() {
						return fn.find.call(this, arguments[0]);
					},
					set     : function() {
						return set.call(fn);
					},
					push    : function(id, seat) {
						this.seats.push(seat);
						this.seatIds.push(id);
						++this.length;
					}
				};
			},
			//get one object or a set of objects
			get       : function(seatsIds) {
				var fn = this;

				return typeof seatsIds == 'string' ? 
					fn.seats[seatsIds] : (function() {
						
						var seatSet = fn.set();
						
						$.each(seatsIds, function(index, seatId) {
							if (typeof fn.seats[seatId] === 'object') {
								seatSet.push(seatId, fn.seats[seatId]);
							}
						});
						
						return seatSet;
					})();
			}
		});
		
		return fn.data('seatCharts');
	}
	
	
})(jQuery);

// Helper functions
// General dependency functions
function resizeArray(arr, size, defval) {
    var delta = arr.length - size;

    if (delta > 0) {
        arr.length = size;
    } else {
        while (delta++ < 0) { 
            arr.push(defval); 
        }
    }
};

function orderByCountAndDedupe(arr) {
    const counts = new Map();

    arr.forEach(item => {
        if (!counts.has(item)) {
            counts.set(item, 1);
        } else {
            counts.set(item, counts.get(item)+1);
        }
    });

    return (
        Array.from(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([originalItem, count]) => originalItem)
    );
 };

// Seat chart class to make our life easier
class SeatChart {
	constructor(obj) {
        this._map = obj.map;
		this.seatTypes = obj.seatTypes;
		this.legends = obj.legends;
		this.rowLabels = obj.rowLabels;
		this.columnLabels = obj.columnLabels;
		this.charactersSortedByFrequency = [];

		this.mapNode = obj.mapNode;
		this.wrapperNode = obj.wrapperNode;
		this.legendNode = obj.legendNode;
		this.activeNode = obj.activeNode;

		this.onClick = null;
	};

	get map() {
		return this._map;
	}

	set map(val) {
		this._map = val;
		this.charactersSortedByFrequency = orderByCountAndDedupe(
			[].concat(...this._map.map(row => row.split("")))
		)

		const index = this.charactersSortedByFrequency.indexOf("_")
		if (index > -1) { 
			this.charactersSortedByFrequency.splice(index, 1) 
		}
	}

	// Binding and reloading map stuff
	bindMap() {
		let sc = {
			seats: this.seatTypes.reduce(function(seats, seat) {
				seats[seat.char] = {
					category: seat.category,
					blocked: seat.blocked,
					classes: seat.classes,
                };
				return seats;
			}, {}),
			map: this._map,
			naming: {
				rows: this.rowLabels,
				getLabel: function (character, row, column) {
					return row + ':' + column;
				},
				getId: function (character, row, column) {
					return row + ':' + column;
				}
			},
			legend: {
				node: $(this.legendNode),
				items: this.legends					
			},
			click: this.onClick
		}
		
		if (typeof this.columnLabels !== 'undefined') sc.naming.columns = this.columnLabels;

		this.activeNode = $(this.mapNode).seatCharts(sc);
	};

	unbindMap() {
		$('.seatCharts-row').remove();
		$(this.legendNode).empty();
		$(`${this.mapNode}, ${this.mapNode} *`).unbind().removeData();
		$(this.mapNode).attr('aria-activedescendant', null);
	};

	reloadMap() {
		const orgHeight = $(this.mapNode)[0].getBoundingClientRect().height; // Get the original height of the seat map before changing the number of rows

        this.unbindMap();
		this.bindMap();

		this.resizeParentHeight(orgHeight);
		this.scaleContentWidth(); // Scale the map so the columns are all visible

		return this.activeMap;
	};

	// Responsive functions
	scaleContentWidth() { // This function scales the content's width proportional to the parent container's width
		const orgHeight = $(this.mapNode)[0].getBoundingClientRect().height; // This gets the initial height of the content before the transformation

		const scale = $(this.wrapperNode).width() / ($(this.mapNode).width()); // This equation get us the scale of the parent's width in relation to the container's width
		$(this.mapNode).css('transform', 'scale(' + Math.min(1.75, scale) + ')'); // We then apply the scale obtained above to the content's scale css property to scale appropriately
		$(this.mapNode).css('transform-origin', 'top left'); // This just makes sure we scale it from the correct point

		this.resizeParentHeight(orgHeight);
	};

	resizeParentHeight(orgHeight) { // This function resizes the parent's height using the delta between the original hight and the current height of the content
		const newHeight = $(this.mapNode)[0].getBoundingClientRect().height; // Here we get the new height of the content
		const deltaHeight = newHeight - orgHeight; // Then we get the delta between the original height of the content and the new height of the content
		$(this.wrapperNode).css("height", `${$(this.wrapperNode).height() + deltaHeight}px`); // The delta is then added with the parent's height to ensure the parent's height is updated according to how much the difference between the original and the new content height is.
	};

	// Seat map editing functions
	replaceMapSeat(seatNode, selectedSeatType) {
		const seat = this.seatTypes.filter(seat => { return seat.char === selectedSeatType })[0];

		if (seat) {
			seatNode.settings.character = seat.char;
			seatNode.settings.data = seat;

			this.replaceMapSeatClasses(seatNode.settings.$node, seat.classes);
			this.replaceMapSeatCharacter(seatNode.settings, seat.char);
		};

		return 'available';
	};

	replaceMapSeatCharacter(seatSettings, newCharacter) {
		this._map[seatSettings.row] = this._map[seatSettings.row].replaceAt(seatSettings.column, newCharacter);
	};

	replaceMapSeatClasses(node, classes) {
		node.removeClass();
		node
			.addClass("seatCharts-seat seatCharts-cell")
			.addClass(classes)
			.addClass("available");
	};

	replaceMapSeatCharacters(characterToReplace, newCharacter) {
		for (let i = 0; i < this._map.length; i++) {
			this._map[i] = this._map[i].replaceAll(characterToReplace, newCharacter);
		}
	};

	resizeRows(columns, rows) {
		const defaultRow = defaultSeat.repeat(columns); // The default row is just the one that gets assigned to any new row that's created. We take the number of columns the user input and multiply it by the default seat type (general, G) to get it
        resizeArray(this._map, rows, defaultRow); // And then we use the resize function to remove or add rows with the default row depending on the user's input
	};
	
	resizeColumns(columns, rows) {
		for (let i = 0; i < rows; i++) { // To change the number of columns we have to loop through each row indvidually and resize them
            const splitRow = [...this._map[i]]; // Since rows are stored as strings in the map, we have to split them into an array
            resizeArray(splitRow, columns, defaultSeat); // Then we just have to join the array into a string and then put them back into the map
			this._map[i] = splitRow.join(""); // Then we just have to join the array into a string and then put them back into the map
        }
	};

	spliceMapRow(startRow, endRow) {
		this._map = this._map.splice(startRow, Math.max(1, endRow));
	};

	spliceMapCol(startCol, endCol) {
		for (let i = 0; i < this._map.length; i++) {
			const splitRow = [...this._map[i]].splice(startCol, Math.max(1, endCol)); // Since rows are stored as strings in the map, we have to split them into an array and then splice them
			this._map[i] = splitRow.join(""); // Then we just have to join the array into a string and then put them back into the map
		}
	};

	// Other functions
	disableBlockedSeats() {
		for (let i = 0; i < this.seatTypes.length; i++) {
			if (this.seatTypes[i].blocked) {
				this.activeNode.find(this.seatTypes[i].char).status('blocked');
			}
		}
	};
	
	disableReservedSeats(reservedSeats) {
		for (let i = 0; i < reservedSeats.length; i++) {
			const reservedSeat = this.activeNode.get(reservedSeats[i].seatNumber);
			if (typeof reservedSeat !== 'undefined' && reservedSeat !== null) {
				reservedSeat.status('reserved');
			}
		}
	};

	getQuadrantDimensions(quadrant) {
		if (this._map.length == 0) {
			return throwException("The given map has no rows!");
		}
	
		if (this._map[0].length == 0) {
			return throwException("The given map has no columns!");
		}
	
		const rowStart = 0;
		const colStart = 0;
		const rowMid = Math.floor(this._map.length / 2);
		const colMid = Math.floor(this._map[0].length / 2);
		const rowEnd = this._map.length;
		const colEnd = this._map[0].length;
	
		switch (quadrant) {
			case "whole":
				return [[rowStart, Math.max(1, rowEnd)], [colStart, Math.max(1, colEnd)]];
			case "topLeft":
				return [[rowStart, Math.max(1, rowMid)], [colStart, Math.max(1, colMid)]];
			case "topRight":
				return [[rowStart, Math.max(1, rowMid)], [colMid, Math.max(1, colEnd)]];
			case "bottomLeft":
				return [[rowMid, Math.max(1, rowEnd)], [colStart, Math.max(1, colMid)]];
			case "bottomRight":
				return [[rowMid, Math.max(1, rowEnd)], [colMid, Math.max(1, colEnd)]];
			default:
				return [[rowStart, Math.max(1, rowEnd)], [colStart, Math.max(1, colEnd)]];
		}
	};

	findNearestAvailableSeat(row, column, character) {
		const seatIdMap = sc.activeNode.seatIdMap;

		for (let i = 0; i <= row; i++) {
			const availableSeatOnRight = this.searchRowForAvailableSeat(row, column, character, seatIdMap, false, true);
			if (availableSeatOnRight !== null) return availableSeatOnRight;

			const availableSeatOnLeft = this.searchRowForAvailableSeat(row, column, character, seatIdMap, true, false);
			if (availableSeatOnLeft !== null) return availableSeatOnLeft;
		}
	}

	searchRowForAvailableSeat(row, column, character, seatIdMap, left = false, right = false) {
		if (row < 0 || row >= sc.map[0].length) {
			return null;
		}

		const seat = sc.activeNode.get(seatIdMap[row][column]);
		if (seat.length !== 0) {
			if (seat.settings.character === character && seat.settings.status === "available") {
				return seat;
			}
		}

		if (left) return this.searchRowForAvailableSeat(row, column - 1, character, seatIdMap, left, right);
		else if (right) return this.searchRowForAvailableSeat(row, column + 1, character, seatIdMap, left, right);
	}

	selectNearestAvailableSeat(row, column, character) {
		const nearestSeat = this.findNearestAvailableSeat(row, column, character);
		if (nearestSeat !== null) this.activeNode.get(nearestSeat.settings.id).status('selected');
		return nearestSeat;
	}

	// findNearestAvailableSeat(character, row, column) {
	// 	const seatIdMap = sc.activeNode.seatIdMap;
	// 	let distance = -1;
	// 	let closestRow = 0;
	// 	let closestColumn = 0;

	// 	for (let i = 0; i < seatIdMap.length; i++) {
	// 		for (let k = 0; k < seatIdMap[i].length; k++) {
	// 			const curDistance = Math.abs(i - row) + Math.abs(k - column);
	// 			const seat = sc.activeNode.get(seatIdMap[i][k]);
				
	// 			if (seat.length !== 0) {
	// 				if (seat.settings.character === character && seat.settings.status === "available") {
	// 					if (row === i && curDistance === 1) {
	// 						return sc.activeNode.seatIdMap[i][k];
	// 					}

	// 					if (distance === -1 || distance > curDistance) {
	// 						distance = curDistance;
	// 						closestRow = i;
	// 						closestColumn = k;
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}

	// 	return sc.activeNode.seatIdMap[closestRow][closestColumn];
	// }

	static alphabeticalLabels() {
		return ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','BB','CC','DD','EE','FF','GG','HH','JJ','KK','LL','MM','NN','OO'];
	}

	static numericalLabels() {
		return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
	}

	static undefinedLabels() {
		return undefined;
	}
}