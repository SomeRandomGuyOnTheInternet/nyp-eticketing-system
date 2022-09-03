module.exports.error = (req, message) => {
    req.flash('message', { type: "danger", content: message });
}

module.exports.success = (req, message) => {
    req.flash('message', { type: "success", content: message });
}