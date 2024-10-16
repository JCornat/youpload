import Footer from '@interface/components/footer.tsx';
import { FreshContext } from '$fresh/server.ts';
import { State } from '@interface/routes/_middleware.ts';
import Header from '@interface/components/header.tsx';

export default async function Layout(_req: Request, ctx: FreshContext<State>) {
  return (
    <>
      <Header isLoggedIn={ctx.state.isLoggedIn} />

      <ctx.Component />

      <Footer />
    </>
  );
}
