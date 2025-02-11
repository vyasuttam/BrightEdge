import { mailTransport } from "./mailTransport.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./email.template.js";

export const sendMail = (userObj, otp) => {

    console.log(process.env.GMAIL_USER, process.env.GMAIL_PASSWORD);

    const mailOption = {
        from:process.env.GMAIL_USER,
        to: "staroffers555@gmail.com",
        subject:'verification code',
        html: VERIFICATION_EMAIL_TEMPLATE.replace(
            "{verificationCode}",
            otp
        )
    }

    mailTransport.sendMail(mailOption, (error, info) => {

        if(error){
            console.log(error);
        }
        else{
            console.log(info.response);
        }

    });

};