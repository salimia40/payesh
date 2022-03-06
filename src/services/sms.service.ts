import request from "request";
export default class SMSService {
  static sendVerificationCode(phone: string, code: string) {
    console.log(`verification code for ${phone}: ${code}`);
    this.sendMessage(phone, `verification code: ${code}`);
  }

  private static username = process.env.SMS_USERNAME;
  private static password = process.env.SMS_PASS;

  private static sendMessage(resiver: string, message: string) {
    request.post(
      {
        url: "http://ippanel.com/api/select",
        body: {
          op: "send",
          uname: this.username,
          pass: this.password,
          message: message, //message
          from: "+985000291950",
          to: [resiver], //destination Phone number
        },
        json: true,
      },
      function (error, response, body) {
        if (!error && response.statusCode === 200) {
          //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE
          console.log(response.body);
        } else {
          console.log("whatever you want");
        }
      }
    );
  }
}
