// TODO: Improve ajax error handling by using switch case on error codes

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
                resolve(data)
            },
            error: function (error) {
                reject(error)
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

throwError = (message) => {
    throw { 
        responseText: message 
    };
};

handleError = (error) => {
    console.error(error);

    if (error.responseText) {
        showDangerToast(error.responseText);
    } else {
        showDangerToast("Something went wrong. Please try again later!");
    }
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
};

showDangerToast = (message) => {
    showToast({ message: message, type: "danger" });
};

showToast = (notification) => {
    let toastNode = renderToastTemplate(notification); // Upon clicking each toast's buttons, we call pass the template string we defined in template.js and the variables required in the templates to ejs so it gives us a complete html element with all the data filled in
    $("#toastContainer").append(toastNode); // Then we append the resulting toast html to the toast container defined in footer.ejs
    $('.toast').not('.hide').toast('show'); // Show the unhidden toasts in the toast container, which includes the one we just appended
};

populateSelect = (objects, selectNode) => {
    if (objects.length < 1) {
        throwError('There are no objects available. Please try again later!');
    }
    
    for (i = 0; i < objects.length; i++) {
        $(selectNode).append($('<option>', {
            value: i,
            text: objects[i].name
        }));
    }

    $(selectNode).val($(`${selectNode} option:first`).val());
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

getSelectedObject = (objects, selectNode) => {
    const selectedValue = $(selectNode).val();

    if (!selectedValue) {
        throwError('The selected option is not valid. Please try again later!');
    }

    if (!$.isNumeric(selectedValue)) {
        throwError('The selected option is not valid. Please try again later!');
    }

    return objects[selectedValue.toNum()];
};

getSeatTypeArray = (seats, eventId) => {
    let seatArray = [];
    
    for (const seatCharacter in seats) {
        seatArray.push({
            name: seats[seatCharacter].category,
            character: seatCharacter,
            isBlocked: seats[seatCharacter].blocked,
            cssClasses: seats[seatCharacter].classes,
            eventId: eventId
        });
    }

    return seatArray;
};

getSeatsObject = (seatTypeArray) => {
    let seats = {};

    for (i = 0; i < seatTypeArray.length; i++) {
        const seat = seatTypeArray[i];
        seats[seat.character] = {
            category: seat.name,
            blocked: seat.isBlocked,
            classes: seat.cssClasses,
        };
    }
    
    return seats;
};

getSelectedEventHelperArray = (helpers, eventId) => {
    let selectedSeatArray = [];
    
    for (i = 0; i < helpers.length; i++) {
        if (helpers[i].selected) {
            selectedSeatArray.push({
                userId: helpers[i].id,
                eventId: eventId
            });
        }
    }

    return selectedSeatArray;
};