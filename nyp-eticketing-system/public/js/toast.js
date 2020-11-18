const toast = {
    flash: {
        success: function(message) {
            showFlash({ message: message, type: "success", action: "flash" });
            return true;
        },
        danger: function(message) {
            showFlash({ message: message, type: "danger", action: "flash" });
            return false;
        },
    },
    notify: {
        success: function(message) {
            showNotification({ message: message, type: "success", action: "notify" });
            return true;
        },
        danger: function(message) {
            showNotification({ message: message, type: "danger", action: "notify" });
            return false;
        },
    },
};

showFlash = (notification) => {
    $('.toast-flash').not('.hide').toast('hide'); // Show the unhidden toasts in the toast container, which includes the one we just appended
    $("#toastContainer").append(createToastNode(notification)); // Then we append the resulting toast html to the toast container defined in footer.ejs
    $('.toast-flash').not('.hide').toast('show'); // Show the unhidden toasts in the toast container, which includes the one we just appended
};

showNotification = (notification) => {
    $("#toastContainer").append(createToastNode(notification)); // Then we append the resulting toast html to the toast container defined in footer.ejs
    $('.toast-notify').not('.hide').toast('show'); // Show the unhidden toasts in the toast container, which includes the one we just appended
};

function createToastNode(notification) {
    var $toast = $('<div></div>')
        .attr('id', notification.id)
        .addClass('toast')
        .addClass(`toast-${notification.action}`)
        .addClass(`bg-${notification.type}-75`)
        .attr('role', 'alert')
        .attr('aria-live', 'assertive')
        .attr('aria-atomic', 'true')
        .attr('data-delay', '100000');

    var $toastBody = $('<div></div>')
        .addClass('toast-body')
        .addClass(`p-4`)
        .appendTo($toast);

    var $container = $('<div></div>')
        .addClass('container-fluid')
        .addClass(`p-0`)
        .appendTo($toastBody);

    var $row = $('<div></div>')
        .addClass('row')
        .appendTo($container);

    var $messageCol = $('<div></div>')
        .addClass('col-10')
        .appendTo($row);

    $messageCol.append($('<span></span>')
        .addClass('h5 text-white font-weight-medium notification-message')
        .text(notification.message)
    );

    var $closeBtnCol = $('<div></div>')
        .addClass('col-2')
        .appendTo($row);

    $closeBtnCol.append($('<button></button>')
        .addClass('close')
        .attr('type', 'button')
        .attr('data-dismiss', 'toast')
        .attr('aria-label', 'Close')
        .append($('<span></span>')
            .addClass('text-white')
            .attr('aria-hidden', 'Close')
            .text('x')
        )
    );

    return $toast;
}