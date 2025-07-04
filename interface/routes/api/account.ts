import { FreshContext, Handlers } from '$fresh/server.ts';
import { ArgumentInvalidException, NotMatchingPasswordException } from '@shared/lib/exceptions.ts';
import {DeleteAccountUseCase} from '@user/application/command/delete-account.use-case.ts';

export const handler = {
  async DELETE(req: Request, ctx: FreshContext) {
    if (!ctx.state.isLoggedIn) {
      return new Response('Unauthorized', { status: 403 });
    }

    const userId = ctx.state.userId as string;
    const form = await req.json();

    const headers = new Headers();
    headers.set('Content-Type', `application/json`);

    try {
      await new DeleteAccountUseCase().handle({
        userId,
        currentPassword: form.currentPassword as string,
      });

      return new Response(JSON.stringify({ value: 'OK' }), { headers });
    } catch (error) {
      if (error instanceof ArgumentInvalidException) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers });
      }

      if (error instanceof NotMatchingPasswordException) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers });
      }

      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
    }
  },
} as Handlers;
