import { FreshContext, Handlers } from '$fresh/server.ts';
import { ArgumentInvalidException } from '@shared/lib/exceptions.ts';
import { UpdateNameUseCase } from '@user/application/command/update-name.use-case.ts';

export const handler = {
  async PUT(req: Request, ctx: FreshContext) {
    if (!ctx.state.isLoggedIn) {
      return new Response('Unauthorized', { status: 403 });
    }

    const userId = ctx.state.userId as string;
    const form = await req.json();

    const headers = new Headers();
    headers.set('Content-Type', `application/json`);

    try {
      await new UpdateNameUseCase().handle({
        userId,
        newName: form.newName as string,
      });

      return new Response(JSON.stringify({ value: 'OK' }), { headers });
    } catch (error) {
      if (error instanceof ArgumentInvalidException) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers });
      }

      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
    }
  },
} as Handlers;
