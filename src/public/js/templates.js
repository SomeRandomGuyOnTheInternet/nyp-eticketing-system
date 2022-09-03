// The functions you see here take in some values and insert them into a jquery template. We can use the html that's returned so we can to create html on the fly easily for stuff like ajax
// UPDATE THE APPROPRIATE TEMPLATE HERE AND CHANGES WILL BE REFLECTED ON TEMPLATES USED AFTER PAGE LOAD

const templates = {
    helperCard: function(helper) {
        var $card = $('<div></div>')
            .addClass('card mb-2')
            .attr("helper-id", helper.id);
    
        var $cardBody = $('<div></div>')
            .addClass('card-body')
            .addClass('d-flex')
            .appendTo($card);

        var $flexGrowContainer = $('<div></div>')
            .addClass('flex-grow-1')
            .appendTo($cardBody);
            
        $flexGrowContainer.append(
            $('<span></span>')
                .addClass('h5')
                .text(helper.name)
                .appendTo($cardBody)
        );
    
        $flexGrowContainer.append(
            $('<br>')
                .appendTo($cardBody)
        );
    
        $flexGrowContainer.append( 
            $('<small></small>')
                .addClass('card-subtitle text-secondary font-weight-normal')
                .text(helper.email)
                .appendTo($cardBody)
        );
        
        $cardBody.append($('<button></button>')
            .attr('id', helper.id)
            .addClass('close')
            .addClass('remove-helper')
            .attr('type', 'button')
            .attr('aria-label', 'Close')
            .append($('<span></span>')
                .addClass('clickable-child')
                .attr('aria-hidden', 'Close')
                .text('x')
            )
        );
    
        return $card;
    },
    noHelpersSelected: function() {
        var $span = $('<span></span>')
            .addClass('text-secondary h6')
            .text("You have not selected any student helpers!");

        return $span;
    },
}