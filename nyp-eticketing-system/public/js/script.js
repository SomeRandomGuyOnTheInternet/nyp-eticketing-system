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

class AppException extends Error {
    constructor(description) {
        super();
        this.name = "AppException";
        this.message = description;
        this.description = description;
    }
};

toTitleCase = (str) => {
    var lcStr = str.toLowerCase();
    return lcStr.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
};

throwException = (description) => { // DO NOT USE THIS EVERYWHERE. Use this function whenever there's a rare error or you get unsatisfactory results from an asynchronous call. For normal stuff like validation, just showDangerToast
    throw new AppException(description); // description should be user-readable
};

handleError = (error) => { // Use inside the catch block of a try catch
    // Logs the error
    console.error(error);

    if (error.status) {
        if (error.status == 400) {
            showDangerToast(error.responseJSON.message);
        } else if (error.status == 500) {
            showDangerToast(error.responseText);
        }
    } else {
        showDangerToast("Something went wrong. Please try again later!"); // if no user readable description exists, just flash a generic error
    }

    return false;
};

addUnloadListener = () => {
    window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        event.returnValue = '';
    });
};

removeUnloadListener = () => {
    window.removeEventListener('beforeunload', () => {}, true);
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
    let toastNode = renderToastNode(notification); // Upon clicking each toast's buttons, we call pass the template string we defined in template.js and the variables required in the templates to ejs so it gives us a complete html element with all the data filled in
    $("#toastContainer").append(toastNode); // Then we append the resulting toast html to the toast container defined in footer.ejs
    $('.toast').not('.hide').toast('show'); // Show the unhidden toasts in the toast container, which includes the one we just appended
};

getSelectedObjectFromSelectNode = (objects, selectNode) => {
    const selectedValue = $(selectNode).val();

    if (!selectedValue) {
        throwException('The selected option is not valid. Please try again later!');
    }

    if (!$.isNumeric(selectedValue)) {
        throwException('The selected option is not valid. Please try again later!');
    }

    return objects[selectedValue.toNum()];
};


getSeatsObject = (seatsArray) => {
    return seatsArray.reduce(function(seats, seat) {
        seats[seat.character] = {
            category: seat.name,
            blocked: seat.isBlocked,
            classes: seat.cssClasses,
        }; 
        return seats;
    }, {});
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
    return helpers.reduce(function(selectedHelpers, helper) {
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
            $(selectedHelpersColNode).append(renderStudentHelperCardNode(helpers[i]));
        }
    }

    if ($(selectedHelpersColNode).is(':empty')) {
        $(selectedHelpersColNode).append(renderNoStudentHelpersSelectedNode());
    }
};

getSelectedHelper = (helpers, selectNode) => {
    return getSelectedObjectFromSelectNode(helpers, selectNode);
}

getSelectedVenue = (venues, selectNode) => {
    return getSelectedObjectFromSelectNode(venues, selectNode);
}