// const nodemailer=require('nodemailer')
// // nodemailer
// const sendEmail=async(options)=>{
// // create transporter (service that will send email like "gmail")
// const transporter=nodemailer.createTransport({
//   host:process.env.EMAIL_HOST,
//   port:process.env.EMAIL_PORT, //if secure false port =587 , if tre port=465
//   secure:true,
//   auth:{
//     user:process.env.EMAUL_USER,
//     pass:process.env.EMAIL_PASSWORD
//   }
// })
// // define email options (like from , to ,subjet , content)
// const mailOptions={
//   from:"E-Shop App <himanaser86@gmail.com>",
//   to:options.email,
//   subject:options.subject,
//   text:options.message,
// }

// // send email
// await transporter.sendMail(mailOptions)
// }


// module.exports={sendEmail}

// 

const nodemailer = require("nodemailer");

module.exports = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAUL_USER,  //sender
        pass: process.env.APP_EMAIL_PASSWORD, //app password 
      },
    });

    const mailOptions = {
        from:"E-Shop App <himanaser86@gmail.com>",
         to:options.email,
         subject:options.subject,
         text:options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("Email Sent: " + info.response);
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error (nodemailer)");
  }
};



