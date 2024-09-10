import { MailtrapClient } from "mailtrap";

import dotenv from "dotenv";

dotenv.config();

const TOKEN = "87d25a06e4e7a17bf35f686c3206f76b";

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};
// const recipients = [
//   {
//     email: "practiceappdev@gmail.com",
//   },
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
