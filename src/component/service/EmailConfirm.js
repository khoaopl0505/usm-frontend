import axios from "axios";
class EmailConfirm{
    static BASE_URL = "http://localhost:8080"
    static async confirmEmail(tokenMail) {
        try {
          const response = await axios.get(
            `${ConfirmEmailService.BASE_URL}/confirm?tokenMail=${tokenMail}`
          );
          return response.data;
        } catch (err) {
          throw err;
        }
      }
}
export default EmailConfirm;