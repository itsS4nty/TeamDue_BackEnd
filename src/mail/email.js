const { transporter } = require("./confEmail");

async function sendEmail(email, uniqueURL) {
    await transporter.sendEmail({
        from: "teamduenoreply@gmail.com",
        to: email,
        subject: "Verification email",
        html: `<b> ${uniqueURL} </b>`
    });
}

module.exports = {
    sendEmail: sendEmail
};