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