
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

handleBeforeUnload = (event) => {
    event.returnValue = '';
  }

const utils = {
    throwException: function(description) {// DO NOT USE THIS EVERYWHERE. Use this function whenever there's a rare error or you get unsatisfactory results from an asynchronous call. For normal stuff like validation, just showDangerToast
        throw new AppException(description); // description should be user-readable
    },
    handleError: function(error) { // Use inside the catch block of a try catch
        if (error.status) {
            if (error.status == 400) {
                toast.danger(error.message);
            } else if (error.status == 500) {
                toast.danger(error.message);
            }
        } else {
            // Logs the error
            console.error(error);
            toast.danger("Something went wrong. Please try again later!"); // if no user readable description exists, just flash a generic error
        }
    
        return false;
    },
    toTitleCase: function(str) {
        var lcStr = str.toLowerCase();
        return lcStr.replace(/(?:^|\s)\w/g, function(match) {
            return match.toUpperCase();
        });
    },
    addUnloadListener: function () {
        window.addEventListener('beforeunload', handleBeforeUnload);
    }, 
    removeUnloadListener: function () {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    },
    countUniqueCharacters: function (arr) {
        let counts = {};
		for (var i = 0; i < arr.length; i++) {
			counts[arr[i]] = 1 + (counts[arr[i]] || 0);
        }
        return counts
    },
    removeAllChildNodes: function (parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
};