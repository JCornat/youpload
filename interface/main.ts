/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import '@std/dotenv';

import { start } from '$fresh/server.ts';
import manifest from '@interface/fresh.gen.ts';
import config from '@interface/fresh.config.ts';
import { removeExpiredFilesCron } from '@file/application/cron/remove-expired-file.cron.ts';

const isBuildMode = Deno.args.includes('build');
if (!isBuildMode) {
  Deno.cron('Remove expired files cron job', '* * * * *', async () => {
    await removeExpiredFilesCron.execute();
  });
}

await start(manifest, config);
