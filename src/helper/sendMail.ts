import {createTransport, SendMailOptions} from "nodemailer";

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    secure: false,
    auth: {
        user: "jay13@ethereal.email",
        pass: "tdEfFenXQpZQ3hF9ZJ"
    }
});

const sendMail = async (message: {text?: string, html?: string}, subject: string, to: string) => {
    const MailOptions: SendMailOptions = {
        from: '"Jay O\'Reilly" <jay13@ethereal.email>',
        to,
        subject,
        text: message.text,
        html: message.html
    };
    try {
        await transporter.sendMail(MailOptions);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export default sendMail;