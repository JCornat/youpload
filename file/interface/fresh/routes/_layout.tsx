import Footer from '../components/footer.tsx';
import { FreshContext } from '$fresh/server.ts';
import { State } from './_middleware.ts';
import Header from '../components/header.tsx';

export default async function Layout(_req: Request, ctx: FreshContext<State>) {
  return (
    <>
      <Header isLoggedIn={ctx.state.isLoggedIn} />

      <ctx.Component />

      <Footer />
    </>
  );
}
