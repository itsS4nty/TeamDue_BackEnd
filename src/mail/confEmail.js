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
});

function sendEmail(email, uniqueURL) {
    transporter.sendMail({
        from: "teamduenoreply@gmail.com",
        to: email,
        subject: "Verification email TeamDue",
        html: `
            Pulsa <a href="http://51.38.225.18:3000/verify/${uniqueURL}"> aquí </a> para verificar tu usuario. <br><br>
            <i>Si usted no ha solicitado este email, simplemente ignore este mensaje.</i> <br><br>
            <span>&copy; All rights reserved @TeamDue</span>
        `
    });
    console.log("El email de registro se ha enviado con éxito");
}

module.exports = {
    sendEmail: sendEmail
};