module.exports.error = (res, message = "Something went wrong while processing your request. Please try again later!") => {
    res.status(500).send(message);
}

module.exports.success = (res, message = "Successfully executed ajax function!", data = null) => {
    res.status(200).json({message, data});
}