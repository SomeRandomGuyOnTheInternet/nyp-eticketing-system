function scaleContentWidth(parent, content) { // This function scales the content's width proportional to the parent container's width
    let orgHeight = $(content)[0].getBoundingClientRect().height; // This gets the initial height of the content before the transformation

    let scale = $(parent).width() / ($(content).width() + 40); // This equation get us the scale of the parent's width in relation to the container's width. The 40 is just a magic number that ensures that the content doesn't go out of bounds. Idk why that number works lol.
    $(content).css('transform', 'scale('+scale+')'); // We then apply the scale obtained above to the content's scale css property to scale appropriately
    $(content).css('transform-origin', 'top left'); // This just makes sure we scale it from the correct point

    let newHeight = $(content)[0].getBoundingClientRect().height; // Here we get the scaled down height of the content
    let deltaHeight = newHeight - orgHeight; // Then we get the delta between the original height of the content and the new height of the content

    $(parent).css("height", `${$(parent).height() + deltaHeight}px`); // The delta is then added with the parent's height to ensure the parent's height is updated according to how much the difference between the original and the new content height is. This is a bit hacky but it works for now. 
};