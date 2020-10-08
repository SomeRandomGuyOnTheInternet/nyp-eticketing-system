module.exports = (req, message) => {
    req.flash('message', { type: "success", content: message });
}