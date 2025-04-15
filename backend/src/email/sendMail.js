import { mailTransport } from "./mailTransport.js";
import { EXAM_ENROLLMENT_TEMPLATE, FORGOT_PASSWORD_EMAIL_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./email.template.js";

export const sendMail = (userObj, otp) => {

    console.log(process.env.GMAIL_USER, process.env.GMAIL_PASSWORD);

    const mailOption = {
        from:process.env.GMAIL_USER,
        to: userObj.email,
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

export const sendMailForForgetPassword = (userObj) => {

    const mailOption = {
        from:process.env.GMAIL_USER,
        to: userObj.email,
        subject:'Forget Password',
        html: FORGOT_PASSWORD_EMAIL_TEMPLATE.replaceAll(
            "{RESET_LINK}",
            `$http://localhost:5173/reset-password?token=${userObj._id}`
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
}

export const sendMailForExamEnrollment = (userObj, examData) => {

    console.log(userObj);

    let htmlContent = EXAM_ENROLLMENT_TEMPLATE;

    const replacements = {
      "{examTitle}": examData.title,
      "{examDate}": examData.date,
      "{examTime}": examData.time,
      "{examId}": examData.examUsername,
      "{examPassword}": examData.examPassword,
    };
  
    // Replace all placeholders with actual values
    for (const key in replacements) {
      htmlContent = htmlContent.replaceAll(key, replacements[key]);
    }

    const mailOption = {
        from:process.env.GMAIL_USER,
        to: userObj.email,
        subject:'Exam Enrollment Information',
        html: htmlContent
    }

    mailTransport.sendMail(mailOption, (error, info) => {

        if(error){
            console.log(error);
        }
        else{
            console.log(info.response);
        }

    });

}