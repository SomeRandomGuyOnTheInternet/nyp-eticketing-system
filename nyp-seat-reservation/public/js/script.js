// TODO: Improve ajax error handling by using switch case on error codes

const apiRoutes = {
    createVenue: "/api/create-venue",
    editVenue: "/api/update-venue",
};

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

String.prototype.toNum = function() {
    return parseInt(this, 10);
};

String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

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

toTitleCase = (str) => {
    var lcStr = str.toLowerCase();

    return lcStr.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
};

promiseAjax = (uri, method, data) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
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

scaleContentWidth = (parent, content) => { // This function scales the content's width proportional to the parent container's width
    const orgHeight = $(content)[0].getBoundingClientRect().height; // This gets the initial height of the content before the transformation

    if ($(content).width() > $(parent).width()) {
        const scale = $(parent).width() / ($(content).width() + 35); // This equation get us the scale of the parent's width in relation to the container's width. The 40 is just a magic number that ensures that the content doesn't go out of bounds. Idk why that number works lol.
        $(content).css('transform', 'scale('+scale+')'); // We then apply the scale obtained above to the content's scale css property to scale appropriately
        $(content).css('transform-origin', 'top left'); // This just makes sure we scale it from the correct point
    }
    
    resizeParentHeight(orgHeight, parent, content);
};

resizeParentHeight = (orgHeight, parent, content) => { // This function resizes the parent's height using the delta between the original hight and the current height of the content
    const newHeight = $(content)[0].getBoundingClientRect().height; // Here we get the new height of the content
    const deltaHeight = newHeight - orgHeight; // Then we get the delta between the original height of the content and the new height of the content
    $(parent).css("height", `${$(parent).height() + deltaHeight}px`); // The delta is then added with the parent's height to ensure the parent's height is updated according to how much the difference between the original and the new content height is. This is a bit hacky but it works for now. 
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

replaceMapSeatCharacters = (map, characterToReplace, newCharacter) => {
    for (i = 0; i < map.length; i++) {
        map[i] = map[i].replaceAll(characterToReplace, newCharacter);
    }

    return map;
};

replaceMapSeat = (map, seat, selectedSeatType, selectedSeatTypeDetails) => {
    if (selectedSeatTypeDetails) {
        seat.settings.character = selectedSeatType;
        seat.settings.data = selectedSeatTypeDetails;

        replaceMapSeatClasses(seat.settings.$node, selectedSeatTypeDetails.classes);
        replaceMapSeatCharacter(map, seat.settings, selectedSeatType);
    };

    return 'available';
};

replaceMapSeatCharacter = (map, seatSettings, newCharacter) => {
    map[seatSettings.row] = map[seatSettings.row].replaceAt(seatSettings.column, newCharacter);
};

replaceMapSeatClasses = (node, classes) => {
    node.removeClass();
    node
        .addClass("seatCharts-seat seatCharts-cell")
        .addClass(classes)
        .addClass("available");
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