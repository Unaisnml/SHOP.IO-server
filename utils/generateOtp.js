// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.AUTH_EMAIL,
//     pass: process.env.AUTH_PASSWORD,
//   },
// });

// export const sendOtp = (email) => {
//   try {
//     return new Promise(async (resolve, reject) => {
//       const otp = `${Math.floor(10000) + Math.random() * 99999}`;

//       const mailOptions = {
//         from: process.env.AUTH_EMAIL,
//         to: email,
//         subject: "Verify your Email",
//         html: `Your Email verification code is ${otp}`,
//       };

//       await transporter
//         .sendMail(mailOptions)
//         .then((response) => {
//           response.otp = otp;
//           resolve(response);
//         })
//         .catch((err) => {
//           console.log("Error in otp", err);
//           resolve(err);
//         });
//     }).catch((err) => {
//       reject(err);
//     });
//   } catch (error) {
//     console.log("ERROR OCCURED", error);
//   }
// };

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

export const sendOtp = async (email) => {
  try {
    // const otp = `${Math.floor(10000 + Math.random() * 90000)}`;
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your Email",
      html: `Your Email verification code is ${otp}`,
    };

    const response = await transporter.sendMail(mailOptions);
    response.otp = otp; // Attach the OTP to the response for further processing

    return response;
  } catch (error) {
    console.log("Error in sending OTP:", error);
    throw error; // Propagate the error to the caller
  }
};
