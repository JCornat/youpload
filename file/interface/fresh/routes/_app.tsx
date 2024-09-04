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
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
