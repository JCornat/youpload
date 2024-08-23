import Button from '../components/button.tsx';

import { effect, signal } from '@preact/signals';
import { JSX } from 'preact';

const currentPassword = signal<string>('');
const newPassword = signal<string>('');
const newPasswordRepeat = signal<string>('');
const formLoading = signal<boolean>(false);
const formError = signal<string>('');

const onSubmit = async (event: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (formLoading.value) {
    console.log('SKIP SUBMIT');
    return;
  }

  try {
    formLoading.value = true;
    formError.value = '';

    if (newPassword.value !== newPasswordRepeat.value) {
      throw new Error(`New passwords don't match`);
    }

    const res = await fetch('/api/password', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      }),
    });

    if (res.ok) {
      console.log('success', res);
    } else {
      console.error('error', res);
    }
  } catch (error) {
    formError.value = error.message;
  } finally {
    formLoading.value = false;
  }
};

export default function AccountPasswordForm() {
  return (
    <>
      <form onSubmit={onSubmit}>
        <div class='my-4'>
          <label htmlFor='current-password'>Current password</label>
          <br />
          <input
            type='password'
            name='current-password'
            onInput={(e) => currentPassword.value = e.currentTarget.value}
          />
        </div>

        <div class='my-4'>
          <label htmlFor='new-password'>New password</label>
          <br />
          <input
            type='password'
            name='new-password'
            onInput={(e) => newPassword.value = e.currentTarget.value}
          />
        </div>

        <div class='my-4'>
          <label htmlFor='new-password-repeat'>Repeat new password</label>
          <br />
          <input
            type='password'
            name='new-password-repeat'
            onInput={(e) => newPasswordRepeat.value = e.currentTarget.value}
          />
        </div>

        {formError &&
          (
            <div class='my-4'>
              <p style='color: red'>{formError}</p>
            </div>
          )}

        <Button type='submit'>Update</Button>
      </form>
    </>
  );
}
