module.exports.error = (res, message = "Something went wrong while processing your request. Please try again later!", status = 400) => {
    if (status == 500) {
        res.status(500).send(message);
    } else {
        res.status(400).json({
            status: 400, 
            message: message
        });
    }
}

module.exports.success = (res, message = "Successfully executed ajax function!", data = null) => {
    res.status(200).json({message, data});
}