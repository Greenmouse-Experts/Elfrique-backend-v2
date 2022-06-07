require("dotenv").config();
const axios = require("axios");
const auth = require("./auth");

const Service = {
  Paystack: {
    url: process.env.PAYSTACK_BASEURL,
    async createTransferReceipt(accountName, accountNumber, bankCode) {
      ``;
      try {
        const createUserUrl = `${this.url}/transferrecipient`;
        const result = await axios({
          method: "post",
          url: createUserUrl,
          data: {
            type: "nuban",
            name: accountName,
            account_number: accountNumber,
            bank_code: bankCode,
            currency: "NGN",
          },
          headers: auth.header,
        });
        // console.log(result.data);
        const resp = result.data;
        return resp;
      } catch (error) {
        console.log(error);
      }
    },

    async finalizeTransfer(transfer_code, token) {
      try {
        const createUserUrl = `${this.url}/transfer/finalize_transfer`;
        const result = await axios({
          method: "post",
          url: createUserUrl,
          data: {
            transfer_code: transfer_code,
            otp: token,
          },
          headers: auth.header,
        });
        // console.log(result.data);
        const resp = result.data;
        return resp;
      } catch (error) {
        console.log(error);
      }
    },

    async verifyPayment(reference) {
      try {
        const createUserUrl = `${this.url}/transaction/verify/${reference}`;
        const result = await axios({
          method: "get",
          url: createUserUrl,
          headers: auth.header,
        });
        // console.log(result.data);
        const resp = result.data;
        return resp;
      } catch (error) {
        console.log(error);
        const err = error.response.data;
        return err;
      }
    },
  },
};

module.exports = { Service };
