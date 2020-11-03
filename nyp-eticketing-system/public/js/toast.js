const toast = {
    success: function(message) {
        showToast({ message: message, type: "success" });
        return true;
    },
    danger: function(message) {
        showToast({ message: message, type: "danger" });
        return false;
    },
};

showToast = (notification) => {
    let toastNode = templates.toast(notification); // Upon clicking each toast's buttons, we call pass the template string we defined in template.js and the variables required in the templates to ejs so it gives us a complete html element with all the data filled in
    $("#toastContainer").append(toastNode); // Then we append the resulting toast html to the toast container defined in footer.ejs
    $('.toast').not('.hide').toast('show'); // Show the unhidden toasts in the toast container, which includes the one we just appended
};