import { Head } from '$fresh/runtime.ts';
import { RouteConfig } from '$fresh/server.ts';

export const config: RouteConfig = {
  skipInheritedLayouts: true, // Skip already inherited layouts
};

export default function FileNotFound() {
  return (
    <>
      <Head>
        <title>File not found</title>
      </Head>

      <div class='mx-auto px-4 h-dvh flex flex-col items-center justify-center'>
        <h1 class='text-3xl font-bold text-center mb-8'>
          The file requested doesn't exist
        </h1>

        <a href={'/'} class={'underline'}>
          Go back home
        </a>
      </div>
    </>
  );
}
