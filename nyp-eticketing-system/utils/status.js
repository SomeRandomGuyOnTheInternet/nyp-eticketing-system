module.exports.error = (res, message = "Something went wrong while processing your request. Please try again later!", status = 400) => {
    switch (status) {
        case 400:
            return res.status(400).json({ status: 400, message: message });
        case 404:
            return res.status(404).send(message);
        case 500:
            return res.status(500).send(message);
        default:
            return res.status(500).send(message);
    }
}

module.exports.success = (res, message = "Successfully executed ajax function!", data = null) => {
    res.status(200).json({message, data});
}