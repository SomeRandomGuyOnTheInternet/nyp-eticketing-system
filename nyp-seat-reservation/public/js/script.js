// TODO: Improve ajax error handling by using switch case on error codes
// TODO: Put all entity specific stuff in their own class (https://stackoverflow.com/questions/41367259/populating-a-select-from-list-of-objects)
// TODO: Replace anonymous functions with proper ones

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

String.prototype.toNum = function() {
    return parseInt(this, 10);
};

String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

promiseAjax = (uri, method, data, dataType = 'json', contentType = 'application/json') => {
    if (data) {
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
    } else {
        data = null;
    }

    return new Promise((resolve, reject) => {
        $.ajax({
            type: method,
            url: uri,
            dataType: dataType,
            contentType: contentType,
            data: data,
            success: function (data) {
                resolve(data);
            },
            error: function (error) {
                if (error.status == 200) {
                    resolve(true);
                } else {
                    reject(error);
                }
            },
        }).fail(function (jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        });
    });
};

toTitleCase = (str) => {
    var lcStr = str.toLowerCase();
    return lcStr.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
};

throwAsyncError = (message) => {
    throw { 
        responseText: message 
    };
};

handleError = (error) => {
    if (error.responseText) {
        console.error(error);
        showDangerToast(error.responseText);
    } else {
        showDangerToast("Something went wrong. Please try again later!");
    }
    return false;
};

toggleHighlight = (node, nodeCssClass) => {
    if ($(node).hasClass("highlighted")) {
        $(nodeCssClass).removeClass("highlighted");
        return false;
    } else {
        $(nodeCssClass).removeClass("highlighted");
        $(node).addClass("highlighted");
        return true;
    }
};

showSuccessToast = (message) => {
    showToast({ message: message, type: "success" });
    return true;
};

showDangerToast = (message) => {
    showToast({ message: message, type: "danger" });
    return false;
};

showToast = (notification) => {
    let toastNode = renderToastTemplate(notification); // Upon clicking each toast's buttons, we call pass the template string we defined in template.js and the variables required in the templates to ejs so it gives us a complete html element with all the data filled in
    $("#toastContainer").append(toastNode); // Then we append the resulting toast html to the toast container defined in footer.ejs
    $('.toast').not('.hide').toast('show'); // Show the unhidden toasts in the toast container, which includes the one we just appended
};


getSeatsObject = (seatsArray) => {
    return seatsArray.reduce(function(seats, seat) {
        seats[seat.character] = {
            category: seat.name,
            blocked: seat.isBlocked,
            classes: seat.cssClasses,
        }; 
        return obj;
    },{});
};

getSeatTypeArray = (seats, eventId) => {
    return Object.keys(seats).map((char) => ({
        name: seats[char].category,
        character: char,
        isBlocked: seats[char].blocked,
        cssClasses: seats[char].classes,
        eventId: eventId
    }));
};


getSelectedEventHelperArray = (helpers, eventId) => {
    return helpers.reduce(function(selectedHelpers, helper){
        if (helper.selected){
            selectedHelpers.push({
                userId: helper.id,
                eventId: eventId
            });
        }
        return selectedHelpers;
    }, []);;
};

populateHelperSelect = (helpers, helperSelectNode) => {
    $(`${helperSelectNode} option:not(:first)`).remove();
    
    for (i = 0; i < helpers.length; i++) {
        if (!helpers[i].selected) {
            $(helperSelectNode).append($('<option>', {
                value: i,
                text: `${helpers[i].name} - ${helpers[i].email}`
            }));
        }
    }
    
    $(helperSelectNode).val($(`${helperSelectNode} option:first`).val());
};

populateSelectedHelperColumn = (helpers, selectedHelpersColNode) => {
    $(selectedHelpersColNode).empty();
    
    for (i = 0; i < helpers.length; i++) {
        if (helpers[i].selected) {
            $(selectedHelpersColNode).append(renderStudentHelperCardTemplate(helpers[i]));
        }
    }

    if($(selectedHelpersColNode).is(':empty')) {
        $(selectedHelpersColNode).append(renderNoStudentHelpersSelectedTemplate());
    }
};


populateVenueSelect = (venues, venueSelectNode) => {
    $(`${venueSelectNode} option`).remove();

    if (venues.length < 1) {
        return showDangerToast('There are no venues available. Please try again later!');
    }
    
    for (i = 0; i < venues.length; i++) {
        $(venueSelectNode).append($('<option>', {
            value: i,
            text: venues[i].name
        }));
    }

    $(venueSelectNode).val($(`${venueSelectNode} option:first`).val());
};

getSelectedVenue = (venues, venueSelectNode) => {
    const selectedValue = $(venueSelectNode).val();

    if (!selectedValue) {
        throwError('The selected option is not valid. Please try again later!');
    }

    if (!$.isNumeric(selectedValue)) {
        throwError('The selected option is not valid. Please try again later!');
    }

    return venues[selectedValue.toNum()];
};