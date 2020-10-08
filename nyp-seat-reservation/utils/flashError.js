module.exports = (req, message) => {
    req.flash('message', { type: "danger", content: message });
}