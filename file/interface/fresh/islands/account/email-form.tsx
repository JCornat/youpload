import Button from '../../components/button.tsx';

import { effect, signal } from '@preact/signals';
import { JSX } from 'preact';
import Input from '../../components/input.tsx';

const currentPassword = signal<string>('');
const newEmail = signal<string>('');
const formLoading = signal<boolean>(false);
const formError = signal<string>('');
const emailUpdated = signal<boolean>(false);

const onSubmit = async (event: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (formLoading.value) {
    console.log('SKIP SUBMIT');
    return;
  }

  try {
    formLoading.value = true;
    formError.value = '';

    const res = await fetch('/api/email', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newEmail: newEmail.value,
        currentPassword: currentPassword.value,
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      const error = body.error ?? res.statusText;
      throw new Error(error);
    }

    emailUpdated.value = true;
    currentPassword.value = '';
    newEmail.value = '';
    setTimeout(() => {
      emailUpdated.value = false;
    }, 5000);
  } catch (error) {
    formError.value = error.message;
  } finally {
    formLoading.value = false;
  }
};

export default function AccountEmailForm() {
  return (
    <>
      <form onSubmit={onSubmit}>
        <label>
          <span class={'flex mb-1 font-bold'}>
            New email address <span class='text-red-500 ml-0.5'>*</span>
          </span>

          <Input
            type='email'
            required
            autocomplete='off'
            value={newEmail}
            onInput={(e) => newEmail.value = e.currentTarget.value}
          />
        </label>

        <label>
          <span class={'flex mb-1 font-bold'}>
            Current password <span class='text-red-500 ml-0.5'>*</span>
          </span>

          <Input
            type='password'
            required
            autocomplete='off'
            value={currentPassword}
            onInput={(e) => currentPassword.value = e.currentTarget.value}
          />
        </label>

        {formError.value && (
          <div class='my-4'>
            <p class={'text-red-500'}>{formError}</p>
          </div>
        )}

        {emailUpdated.value ? (
          <Button type='submit' variant='success' disabled={true}>Success</Button>
        ) : (
          <Button type='submit' variant='primary'>Change Email</Button>
        )}
      </form>
    </>
  );
}
