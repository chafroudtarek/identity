import sgMail from "@sendgrid/mail";

export const sendEmail =  (email, text) => {
  console.log("hani hnee fyl send email", email)
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: process.env.EMAIL, // Use the email address or domain you verified above
    subject: "RESET PASSWORD",
    text: text,
    html: `<strong> Hello sir! a request has been received to change the password for your  account: code 👇 </strong> <br/><p>${text}</p> `,
  };
  sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
  // (async () => {
  //   try {
  //     await sgMail.send(msg);
  //     console.log("jawo fez fez")
  //   } catch (error) {
  //     console.log("error send email",error);

  //     if (error.response) {
  //       console.log("erroooor response body",error.response.body);
  //     }
  //   }
  // })();
};
