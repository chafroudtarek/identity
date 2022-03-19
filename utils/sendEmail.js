import sgMail from "@sendgrid/mail";

export const sendEmail = async (email, text) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: process.env.EMAIL, // Use the email address or domain you verified above
    subject: "RESET PASSWORD",
    text: text,
    html: `<strong> Hello sir! a request has been received to change the password for your  account: code 👇 </strong> <br/><p>${text}</p> `,
  };

  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  })();
};
