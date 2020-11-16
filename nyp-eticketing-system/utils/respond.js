module.exports.error = (res, message = "Something went wrong while processing your request. Please try again later!", status = 400) => {
    return res.status(status).json({ status: status, message: message });
}

module.exports.success = (res, message = "Successfully executed ajax function!", data = null) => {
    return res.status(200).json({message, data});
}