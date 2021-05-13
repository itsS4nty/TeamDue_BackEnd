var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "teamduenoreply@gmail.com",
        pass: "oqplnjfrfauyeqcw"
    }
});

transporter.verify().then(() => {
    console.log("Servidor preparado para enviar emails");
    // transporter.sendMail({
    //     from: "teamduenoreply@gmail.com",
    //     to: "carloskeko80@gmail.com",
    //     subject: "Verification email",
    //     html: `<b> hola </b>`
    // });
});

function sendEmail(email, uniqueURL) {
    transporter.sendMail({
        from: "teamduenoreply@gmail.com",
        to: email,
        subject: "Verification email",
        html: `<b> ${uniqueURL} </b>`
    });
}

module.exports = {
    sendEmail: sendEmail
};