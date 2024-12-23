import express from 'express';
import vendorRegistration from '../controllers/vendorController/vendor.registration.controller.js';
import vendorLogin from '../controllers/vendorController/vendor.login.controller.js';
import verifyEmail from '../controllers/emailVerification.controller.js';
import jwtAuthentication from '../middleware/auth.middleware.js';
import vendorLogout from '../controllers/vendorController/vendor.logout.controller.js';
import requestVendorPasswordReset from '../controllers/vendorController/vendor.reqPasswordReset.js';
import  resetVendorPassword  from '../controllers/vendorController/vendor.resetPassword.controller.js';
import  vendorRefreshAccessToken  from '../controllers/vendorController/vendor.refreshAccessToken.controlller.js';

const vendorRouter = express.Router();


vendorRouter.route("/register").post(vendorRegistration);
vendorRouter.route("/login").post(vendorLogin);
vendorRouter.route("/verify-email").get(verifyEmail);
vendorRouter.route("/logout").post(jwtAuthentication,vendorLogout);
vendorRouter.route("/request-password-reset").post(requestVendorPasswordReset)
vendorRouter.route("/reset-password").post(resetVendorPassword)
vendorRouter.route("/refresh-access-token").get(vendorRefreshAccessToken);
// vendorRouter.route("/delete-user").post(jwtAuthentication,deleteUserAccount)

export default vendorRouter