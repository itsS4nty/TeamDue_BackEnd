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

module.exports = transporter;