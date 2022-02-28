import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUser, errorHandler, NotFoundError } from '@jogging/common';
import cookieSession from 'cookie-session';
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { currentUserRouter } from "./routes/current-user";
import { forgetPasswordRouter } from "./routes/forget-password";
import { resetPasswordRouter } from "./routes/reset-password";
import { resendKeyRouter } from "./routes/resend-key";
import { checkPasswordKeyRouter } from "./routes/check-password-key";
import { activeRouter } from "./routes/active";
import { updateProfileRouter } from "./routes/update-profile";
import { deleteProfileRouter } from "./routes/delete-profile";
import { RegisterWithCoachRouter } from "./routes/trainee/register";
import { showCoachesName } from "./routes/coach/show";
import { CreateDomainRouter } from "./routes/admin/create-domain";
import { adminDeleteUsers } from "./routes/admin/delete-users";
import { emailCreatorRouter } from "./routes/admin/email-creator";
import { emailReservedRouter } from "./routes/admin/email-reserved";
import { listOfUsers } from "./routes/admin/list-of-users";
import { updatePermissionRouter } from "./routes/admin/update-permission";

const app = express();
app.set('trust proxy', true);
app.use([
  json(),
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }),
  signupRouter,
  signinRouter,
  signoutRouter,
  currentUserRouter,
  forgetPasswordRouter,
  resetPasswordRouter,
  resendKeyRouter,
  checkPasswordKeyRouter,
  currentUser,
  activeRouter,
  updateProfileRouter,
  deleteProfileRouter,
  RegisterWithCoachRouter,
  showCoachesName,
  CreateDomainRouter,
  adminDeleteUsers,
  emailCreatorRouter,
  emailReservedRouter,
  listOfUsers,
  updatePermissionRouter,
]);


app.use(
  '*',
  async () => {
    throw new NotFoundError();
  }, errorHandler);

export { app };