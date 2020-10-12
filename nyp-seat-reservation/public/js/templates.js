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