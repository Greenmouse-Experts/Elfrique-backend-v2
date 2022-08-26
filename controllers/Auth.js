require("dotenv").config();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const generateUniqueId = require("generate-unique-id");
const uniqueString = require("unique-string");
const nodemailer = require("nodemailer");
const User = require("../models").adminuser;
const ResetPasswords = require("../models").resetpassword;
const profile = require("../models").profile;
const SuperAdmin = require("../models").superadmin;
const Referrals = require("../models").Referral;

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");

exports.registerUser = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      phonenumber,
      referral_email,
      confirmpassword,
    } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).send({ message: "This email already exists" });
    } else if (password !== confirmpassword) {
      return res.status(400).send({ message: "Password does not match" });
    } else {
      let newUser;
      const hashPwd = bcrypt.hashSync(password, 10);
      let uniqueRef = generateUniqueId({
        length: 8,
        useLetters: true,
      });

      const { referral } = req.body;
      console.log("Reference", referral);
      const reference = await User.findOne({
        where: {
          reference: {
            [Op.eq]: referral,
          },
        },
      });
      if (reference) {
        newUser = await User.create({
          firstname,
          lastname,
          phonenumber,
          email,
          password: hashPwd,
          referral_id: reference.id,
          reference: uniqueRef,
        });

        const referral = await Referrals.create({
          referral_id: reference.id,
          user_id: newUser.id,
        });
      } else {
        newUser = await User.create({
          firstname,
          lastname,
          phonenumber,
          email,
          password: hashPwd,
          reference: uniqueRef,
        });
      }

      const newProfile = await profile.create({
        firstname,
        lastname,
        phonenumber,
        email,
        adminuserId: newUser.id,
      });

      let user_email = newUser.email;
      let email_token = uniqueString();
      var link = `${process.env.SITE_URL}/verify?email=${user_email}&token=${email_token}`;
      var fname = newUser.firstname;
      var baseurl = process.env.BASEURL;
      const output = `<!DOCTYPE html>
                  <html>
                  <head>
                  
                    <meta charset="utf-8">
                    <meta http-equiv="x-ua-compatible" content="ie=edge">
                    <title>Email Confirmation</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style type="text/css">
                    /**
                     * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
                     */
                    @media screen {
                      @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                      }
                      @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                      }
                    }
                    /**
                     * Avoid browser level font resizing.
                     * 1. Windows Mobile
                     * 2. iOS / OSX
                     */
                    body,
                    table,
                    td,
                    a {
                      -ms-text-size-adjust: 100%; /* 1 */
                      -webkit-text-size-adjust: 100%; /* 2 */
                    }
                    /**
                     * Remove extra space added to tables and cells in Outlook.
                     */
                    table,
                    td {
                      mso-table-rspace: 0pt;
                      mso-table-lspace: 0pt;
                    }
                    /**
                     * Better fluid images in Internet Explorer.
                     */
                    img {
                      -ms-interpolation-mode: bicubic;
                    }
                    /**
                     * Remove blue links for iOS devices.
                     */
                    a[x-apple-data-detectors] {
                      font-family: inherit !important;
                      font-size: inherit !important;
                      font-weight: inherit !important;
                      line-height: inherit !important;
                      color: inherit !important;
                      text-decoration: none !important;
                    }
                    /**
                     * Fix centering issues in Android 4.4.
                     */
                    div[style*="margin: 16px 0;"] {
                      margin: 0 !important;
                    }
                    body {
                      width: 100% !important;
                      height: 100% !important;
                      padding: 0 !important;
                      margin: 0 !important;
                    }
                    /**
                     * Collapse table borders to avoid space between cells.
                     */
                    table {
                      border-collapse: collapse !important;
                    }
                    a {
                      color: #1a82e2;
                    }
                    img {
                      height: auto;
                      line-height: 100%;
                      text-decoration: none;
                      border: 0;
                      outline: none;
                    }
                    </style>
                  
                  </head>
                  <body style="background-color: #e9ecef;">
                  
                    <!-- start preheader -->
                    <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
                      Elfrique Email Verification
                    </div>
                    <!-- end preheader -->
                  
                    <!-- start body -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  
                      <!-- start logo -->
                      <tr>
                        <td align="center" bgcolor="#e9ecef">
                          <!--[if (gte mso 9)|(IE)]>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                              <td align="center" valign="top" style="padding: 36px 24px;">
                                <a href=${process.env.FRONTURL} target="_blank" style="display: inline-block;">
                                  <img src=${baseurl}/images/logo.png alt="Logo" border="0" width="60" style="display: flex; width: 75px; max-width: 80px; min-width: 60px;">
                                </a>
                              </td>
                            </tr>
                          </table>
                          <!--[if (gte mso 9)|(IE)]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                        </td>
                      </tr>
                      <!-- end logo -->
                  
                      <!-- start hero -->
                      <tr>
                        <td align="center" bgcolor="#e9ecef">
                          <!--[if (gte mso 9)|(IE)]>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                                <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                              </td>
                            </tr>
                          </table>
                          <!--[if (gte mso 9)|(IE)]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                        </td>
                      </tr>
                      <!-- end hero -->
                  
                      <!-- start copy block -->
                      <tr>
                        <td align="center" bgcolor="#e9ecef">
                          <!--[if (gte mso 9)|(IE)]>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  
                            <!-- start copy -->
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                        <h2> Hi ${fname}, </h2>        
                                <p style="margin: 0;">You Have Successfully created an account with Elfrique. Tap the button below to confirm your email address. If you didn't create an account with Elfrique, you can safely delete this emails.</p>
                              </td>
                            </tr>
                            <!-- end copy -->
                  
                            <!-- start button -->
                            <tr>
                              <td align="left" bgcolor="#ffffff">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                      <table border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                          <td align="center" bgcolor="#90ee90" style="border-radius: 6px;">
                                            <a href=${link} target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #000000; text-decoration: none; border-radius: 6px;">Activate Account</a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <!-- end button -->
                  
                            <!-- start copy -->
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                              <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                              <br>
                              <p style="margin: 0;"><a href=${link} target="_blank">${link}</a></p>
                              <br>
                              <p style="margin: 0;">Please Note: This link will expire in 24 Hours</p>
                              </td>
                            </tr>
                            <!-- end copy -->
                  
                            <!-- start copy -->
                            <tr>
                              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                                <p style="margin: 0;">Cheers,<br> Elfrique Team</p>
                              </td>
                            </tr>
                            <!-- end copy -->
                  
                          </table>
                          <!--[if (gte mso 9)|(IE)]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                        </td>
                      </tr>
                      <!-- end copy block -->
                  
                      <!-- start footer -->
                      <tr>
                        <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                          <!--[if (gte mso 9)|(IE)]>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  
                            <!-- start permission -->
                            <tr>
                              <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                                <p style="margin: 0;">You received this email because we received a request for signing up for your Elfrique account. If you didn't request signing up you can safely delete this email.</p>
                              </td>
                            </tr>
                            <!-- end permission -->
                  
                          </table>
                          <!--[if (gte mso 9)|(IE)]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                        </td>
                      </tr>
                      <!-- end footer -->
                  
                    </table>
                    <!-- end body -->
                  
                  </body>
                  </html> `;
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: process.env.EMAIL_USERNAME, // generated ethereal user
          pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let mailOptions = {
        from: ` "Elfrique" <${process.env.EMAIL_USERNAME}>`, // sender address
        to: `${email}`, // list of receivers
        subject: "[Elfrique] Please activate your account", // Subject line
        text: "Elfrique", // plain text body
        html: output, // html body
      };
      transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ message: "Error sending mail" });
        } else {
          // console.log('Mail Sent: ', info);
          const update = await User.update(
            { email_token },
            { where: { email } }
          );
          return res.status(200).send({
            message:
              "Registration successful, check your email for activation link.",
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    } else {
      if (user.activated !== 1) {
        return res.status(400).send({
          message:
            "Account not activated: Check your email for activation link",
        });
      } else {
        let compare = bcrypt.compareSync(password, user.password);
        if (user.password[0] != "$") {
          compare =
            crypto.createHash("sha1").update(password).digest("hex") ===
            user.password;
        }
        if (!compare) {
          return res.status(400).send({ message: "Invalid Password" });
        } else {
          const payload = {
            user: {
              id: user.id,
            },
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "3d",
          });
          return res.status(200).send({ token, user });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const email_token = req.query.token;
    const user = await User.findOne({
      where: { email_token },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    } else {
      const update = await User.update(
        { activated: 1 },
        { where: { email_token } }
      );
      return res.status(200).send({ message: "Account activated" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.postresetlink = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    } else {
      const token = uniqueString();

      const link = `${process.env.SITE_URL}/api/v1/resetpassword?email=${email}&token=${token}`;
      const fname = user.firstname;
      var baseurl = process.env.BASEURL;
      const output = `
              
      <!DOCTYPE html>
      <html>
      <head>
      
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Password Reset</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
        /**
         * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
         */
        @media screen {
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 400;
            src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
          }
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 700;
            src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
          }
        }
        /**
         * Avoid browser level font resizing.
         * 1. Windows Mobile
         * 2. iOS / OSX
         */
        body,
        table,
        td,
        a {
          -ms-text-size-adjust: 100%; /* 1 */
          -webkit-text-size-adjust: 100%; /* 2 */
        }
        /**
         * Remove extra space added to tables and cells in Outlook.
         */
        table,
        td {
          mso-table-rspace: 0pt;
          mso-table-lspace: 0pt;
        }
        /**
         * Better fluid images in Internet Explorer.
         */
        img {
          -ms-interpolation-mode: bicubic;
        }
        /**
         * Remove blue links for iOS devices.
         */
        a[x-apple-data-detectors] {
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
          text-decoration: none !important;
        }
        /**
         * Fix centering issues in Android 4.4.
         */
        div[style*="margin: 16px 0;"] {
          margin: 0 !important;
        }
        body {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        /**
         * Collapse table borders to avoid space between cells.
         */
        table {
          border-collapse: collapse !important;
        }
        a {
          color: #1a82e2;
        }
        img {
          height: auto;
          line-height: 100%;
          text-decoration: none;
          border: 0;
          outline: none;
        }
        </style>
      
      </head>
      <body style="background-color: #e9ecef;">
      
        <!-- start preheader -->
        <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
          Elfrique Password Reset
        </div>
        <!-- end preheader -->
      
        <!-- start body -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
      
          <!-- start logo -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="center" valign="top" style="padding: 36px 24px;">
                    <a href=${process.env.FRONTURL} target="_blank" style="display: inline-block;">
                      <img src=${baseurl}/images/logo.png alt="Logo" border="0" width="60" style="display: flex; width: 75px; max-width: 80px; min-width: 60px;">
                    </a>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end logo -->
      
          <!-- start hero -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Reset Password</h1>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end hero -->
      
          <!-- start copy block -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
            <h2> Hi ${fname}, </h2>        
                    <p style="margin: 0;"> Somebody requested a new password for the Elfrique account associated with ${user.email}. No changes have been made to your account yet. If you didn't request for password reset from your account with Elfrique, you can safely delete this email.</p>
                    <p style="margin: 0;"> You can reset your password by clicking the link below: </p>
                  </td>
                </tr>
                <!-- end copy -->
      
                <!-- start button -->
                <tr>
                  <td align="left" bgcolor="#ffffff">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" bgcolor="#90ee90" style="border-radius: 6px;">
                                <a href=${link} target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #000000; text-decoration: none; border-radius: 6px;">Reset Password</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- end button -->
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                  <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                  <br>
                  <p style="margin: 0;"><a href=${link} target="_blank">${link}</a></p>
                  <br>
                  <p style="margin: 0;">Please Note: This link will expire in 24 hours</p>
                    </td>
                </tr>
                <!-- end copy -->
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                    <p style="margin: 0;">Cheers,<br> Elfrique Team</p>
                  </td>
                </tr>
                <!-- end copy -->
      
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end copy block -->
      
          <!-- start footer -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start permission -->
                <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                    <p style="margin: 0;">You received this email because we received a request for password reset for your Elfrique account. If you didn't request signing up you can safely delete this email.</p>
                  </td>
                </tr>
                <!-- end permission -->
      
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end footer -->
      
        </table>
        <!-- end body -->
      
      </body>
      </html>
      `;

      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USERNAME, // generated ethereal user
          pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let mailOptions = {
        from: ` "elfrique" <${process.env.EMAIL_USERNAME}>`, // sender address
        to: `${email}`, // list of receivers
        subject: "[elfrique] Please reset your password", // Subject line
        text: "Elfrique", // plain text body
        html: output, // html body
      };

      // insert into forgot password the value of the token and email
      // if email exists already update else insert new
      const reset = await ResetPasswords.findOne({
        where: {
          useremail: {
            [Op.eq]: email,
          },
        },
      });
      if (reset) {
        const update = await ResetPasswords.update(
          {
            token: token,
          },
          {
            where: {
              useremail: {
                [Op.eq]: email,
              },
            },
          }
        );
      } else {
        const newRes = await ResetPasswords.create({
          useremail: email,
          token: token,
        });
      }

      // Send mail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).send({ message: "Error sending mail" });
        } else {
          // console.log('Mail Sent: ', info);
          return res.status(200).send({
            message:
              "Reset password link sent, check your email for reset link.",
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.resetpassword = async (req, res, next) => {
  try {
    const { email, password, confirmpassword } = req.body;
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    } else if (password !== confirmpassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    } else {
      let currentPassword = bcrypt.hashSync(password, 10);
      const update = User.update(
        {
          password: currentPassword,
        },
        {
          where: {
            email: {
              [Op.eq]: email,
            },
          },
        }
      )
        .then((result) => {
          return res.status(200).send({ message: "Password changed" });
        })
        .catch((err) => {
          return res.status(500).send({ message: "Server Error" });
        });
    }
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.createSuperAdmin = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      phonenumber,
      confirmpassword,
    } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).send({ message: "This email already exists" });
    } else if (password !== confirmpassword) {
      return res.status(400).send({ message: "Password does not match" });
    } else {
      let newUser;
      const hashPwd = bcrypt.hashSync(password, 10);
      let uniqueRef = generateUniqueId({
        length: 8,
        useLetters: true,
      });

      newUser = await User.create({
        firstname,
        lastname,
        phonenumber,
        email,
        password: hashPwd,
        activated: 1,
        role: "admin",
      });

      const newProfile = await profile.create({
        firstname,
        lastname,
        phonenumber,
        email,
        adminuserId: newUser.id,
      });

      return res.status(200).send({ message: "SuperAdmin created" });
    }
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

exports.loginSuperAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    } else {
      if (user.role !== "admin") {
        return res.status(401).send({
          message:
            "You are not authorized to login, please contact the administrator",
        });
      } else {
        let compare = bcrypt.compareSync(password, user.password);
        if (user.password[0] != "$") {
          compare =
            crypto.createHash("sha1").update(password).digest("hex") ===
            user.password;
        }

        if (!compare) {
          return res.status(400).send({ message: "Invalid Password oh" });
        } else {
          const payload = {
            user: {
              id: user.id,
            },
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "3d",
          });
          return res.status(200).send({ token, user });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
