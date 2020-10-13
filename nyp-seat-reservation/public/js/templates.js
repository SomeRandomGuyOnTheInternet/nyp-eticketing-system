// TODO: Make toasts more responsive

// The functions you see here take in some values and insert them into a jquery template. We can use the html that's returned so we can to create html on the fly easily for stuff like ajax
// Some of these templates, like toast, are exact copies of the ones you see in the templates folder on the server, just adapted to jquery syntax

// UPDATE THE APPROPRIATE TEMPLATE HERE AND CHANGES WILL BE REFLECTED ON TEMPLATES USED AFTER PAGE LOAD

function renderToastTemplate(notification) {
    var $toast = $('<div></div>')
        .attr('id', notification.id)
        .addClass('toast')
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
        .appendTo($row)
        .append(
            $('<span></span>')
                .addClass('h5 text-white font-weight-medium')
                .text(notification.message)
        );

    var $closeBtnCol = $('<div></div>')
        .addClass('col-2')
        .appendTo($row);

    var $closeBtn = $('<button></button>')
        .attr('type', 'button')
        .addClass('close')
        .attr('data-dismiss', 'toast')
        .attr('aria-label', 'Close')
        .appendTo($closeBtnCol)
        .append(
            $('<span></span>')
                .attr('aria-hidden', 'Close')
                .addClass('text-white')
                .text('x')
        );

    return $toast;
};

function renderSeatChartLegendCardTemplate(seatChar, seatDetails) {
    var $column = $('<div></div>')
        .addClass('seatCharts-cardColumn')
        .addClass('col-auto');

    var $card = $('<div></div>')
        .addClass('seatCharts-legendCard')
        .addClass('card')
        .addClass(seatDetails.legendClasses == "undefined" ? "" : seatDetails.legendClasses)
        .addClass('mt-3')
        .attr("seat-character", seatChar)
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
                    .addClass(['seatCharts-seat', 'seatCharts-cell', seatDetails.classes])
            )
            .append(
                $('<span></span>')
                    .addClass('seatCharts-legendDescription')
                    .text((seatDetails.descriptiveCategory) ? seatDetails.descriptiveCategory : seatDetails.category)
            )
    );

    return $column;
};

function renderStudentHelperCardTemplate(helper) {
    var $card = $('<div></div>')
        .addClass('card mb-2')
        .attr("helper-id", helper.id);

    var $cardBody = $('<div></div>')
        .addClass('card-body')
        .appendTo($card);

    $cardBody.append(
        $('<span></span>')
            .addClass('h5')
            .text(helper.name)
            .appendTo($cardBody)
    );

    $cardBody.append(
        $('<br>')
            .appendTo($cardBody)
    );

    $cardBody.append( 
        $('<small></small>')
            .addClass('card-subtitle mb-2 text-secondary font-weight-normal')
            .text(helper.email)
            .appendTo($cardBody)
    );

    return $card;
};

function renderNoStudentHelpersSelectedTemplate() {
    var $span = $('<span></span>')
        .addClass('text-secondary h6')
        .text("You have not selected any student helpers!");

    return $span;
};