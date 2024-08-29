import { type PageProps } from '$fresh/server.ts';

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>YouPload</title>
        <link rel='stylesheet' href='/styles.css' />
        <link href='https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;600;700&amp;display=swap' rel='stylesheet' />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
