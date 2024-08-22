// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from './routes/_404.tsx';
import * as $_app from './routes/_app.tsx';
import * as $_middleware from './routes/_middleware.ts';
import * as $account from './routes/account.tsx';
import * as $f_id_ from './routes/f/[id].tsx';
import * as $file_not_found from './routes/file-not-found.tsx';
import * as $file_id_ from './routes/file/[id].tsx';
import * as $file_id_download from './routes/file/[id]/download.ts';
import * as $index from './routes/index.tsx';
import * as $logout from './routes/logout.ts';
import * as $sign_in from './routes/sign-in.tsx';
import * as $sign_up from './routes/sign-up.tsx';
import * as $success_upload_id_ from './routes/success-upload/[id].tsx';
import * as $form from './islands/form.tsx';
import type { Manifest } from '$fresh/server.ts';

const manifest = {
  routes: {
    './routes/_404.tsx': $_404,
    './routes/_app.tsx': $_app,
    './routes/_middleware.ts': $_middleware,
    './routes/account.tsx': $account,
    './routes/f/[id].tsx': $f_id_,
    './routes/file-not-found.tsx': $file_not_found,
    './routes/file/[id].tsx': $file_id_,
    './routes/file/[id]/download.ts': $file_id_download,
    './routes/index.tsx': $index,
    './routes/logout.ts': $logout,
    './routes/sign-in.tsx': $sign_in,
    './routes/sign-up.tsx': $sign_up,
    './routes/success-upload/[id].tsx': $success_upload_id_,
  },
  islands: {
    './islands/form.tsx': $form,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
