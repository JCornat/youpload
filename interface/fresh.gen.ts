// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from './routes/_404.tsx';
import * as $_app from './routes/_app.tsx';
import * as $_layout from './routes/_layout.tsx';
import * as $_middleware from './routes/_middleware.ts';
import * as $account from './routes/account.tsx';
import * as $api_account from './routes/api/account.ts';
import * as $api_email from './routes/api/email.ts';
import * as $api_name from './routes/api/name.ts';
import * as $api_password from './routes/api/password.ts';
import * as $api_referral from './routes/api/referral.ts';
import * as $api_sign_in from './routes/api/sign-in.ts';
import * as $api_sign_up from './routes/api/sign-up.ts';
import * as $api_upload from './routes/api/upload.ts';
import * as $file_not_found from './routes/file-not-found.tsx';
import * as $file_id_ from './routes/file/[id].tsx';
import * as $file_id_download from './routes/file/[id]/download.ts';
import * as $index from './routes/index.tsx';
import * as $logout from './routes/logout.ts';
import * as $sign_in from './routes/sign-in.tsx';
import * as $sign_up from './routes/sign-up.tsx';
import * as $account_delete_form from './islands/account/delete-form.tsx';
import * as $account_email_form from './islands/account/email-form.tsx';
import * as $account_name_form from './islands/account/name-form.tsx';
import * as $account_password_form from './islands/account/password-form.tsx';
import * as $account_referral_form from './islands/account/referral-form.tsx';
import * as $file_upload_form from './islands/file-upload-form.tsx';
import * as $file_copy_link_button from './islands/file/copy-link-button.tsx';
import * as $file_download_link_button from './islands/file/download-link-button.tsx';
import * as $sign_in_sign_in_form from './islands/sign-in/sign-in-form.tsx';
import * as $sign_up_sign_up_form from './islands/sign-up/sign-up-form.tsx';
import type { Manifest } from '$fresh/server.ts';

const manifest = {
  routes: {
    './routes/_404.tsx': $_404,
    './routes/_app.tsx': $_app,
    './routes/_layout.tsx': $_layout,
    './routes/_middleware.ts': $_middleware,
    './routes/account.tsx': $account,
    './routes/api/account.ts': $api_account,
    './routes/api/email.ts': $api_email,
    './routes/api/name.ts': $api_name,
    './routes/api/password.ts': $api_password,
    './routes/api/referral.ts': $api_referral,
    './routes/api/sign-in.ts': $api_sign_in,
    './routes/api/sign-up.ts': $api_sign_up,
    './routes/api/upload.ts': $api_upload,
    './routes/file-not-found.tsx': $file_not_found,
    './routes/file/[id].tsx': $file_id_,
    './routes/file/[id]/download.ts': $file_id_download,
    './routes/index.tsx': $index,
    './routes/logout.ts': $logout,
    './routes/sign-in.tsx': $sign_in,
    './routes/sign-up.tsx': $sign_up,
  },
  islands: {
    './islands/account/delete-form.tsx': $account_delete_form,
    './islands/account/email-form.tsx': $account_email_form,
    './islands/account/name-form.tsx': $account_name_form,
    './islands/account/password-form.tsx': $account_password_form,
    './islands/account/referral-form.tsx': $account_referral_form,
    './islands/file-upload-form.tsx': $file_upload_form,
    './islands/file/copy-link-button.tsx': $file_copy_link_button,
    './islands/file/download-link-button.tsx': $file_download_link_button,
    './islands/sign-in/sign-in-form.tsx': $sign_in_sign_in_form,
    './islands/sign-up/sign-up-form.tsx': $sign_up_sign_up_form,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
