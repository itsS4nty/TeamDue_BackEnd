const { transporter } = require("./conf");

async function sendEmail(email, uniqueURL) {
    await transporter.sendEmail({
        from: "teamduenoreply@gmail.com",
        to: email,
        subject: "Verification email",
        html: "<b> Prueba </b>"
    });
}

module.exports = {
    sendEmail: sendEmail
};