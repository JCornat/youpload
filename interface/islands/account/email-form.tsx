import Button from '@interface/components/button.tsx';

import { signal } from '@preact/signals';
import { JSX } from 'preact';
import Input from '@interface/components/input.tsx';

const currentPassword = signal<string>('');
const newEmail = signal<string>('');
const formLoading = signal<boolean>(false);
const formError = signal<string>('');
const emailUpdated = signal<boolean>(false);

const onSubmit = async (event: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (formLoading.value) {
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

    const isJSON = res.headers.get('content-type')?.includes('application/json');
    const body = isJSON && await res.json();
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
        <div className='mb-4'>
          <Input
            type='email'
            required
            label={'New email address'}
            value={newEmail}
            onInput={(e) => newEmail.value = e.currentTarget.value}
          />
        </div>

        <div className='mb-4'>
          <Input
            type='password'
            required
            label={'Current password'}
            value={currentPassword}
            onInput={(e) => currentPassword.value = e.currentTarget.value}
          />
        </div>

        {formError.value && (
          <div class='my-4'>
            <p class={'text-red-500'}>{formError}</p>
          </div>
        )}

        {emailUpdated.value ? <Button type='submit' variant='success' disabled={true}>Success</Button> : <Button type='submit' variant='primary'>Change Email</Button>}
      </form>
    </>
  );
}
