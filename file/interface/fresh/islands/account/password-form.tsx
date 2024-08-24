import Button from '../../components/button.tsx';

import { effect, signal } from '@preact/signals';
import { JSX } from 'preact';
import Input from '../../components/input.tsx';

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
      throw new Error(res.statusText);
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
        <label>
          <span class={'flex mb-1 font-bold'}>
            Current password <span class='text-red-500 ml-0.5'>*</span>
          </span>

          <Input
            type='password'
            required
            onInput={(e) => currentPassword.value = e.currentTarget.value}
          />
        </label>

        <label>
          <span class={'flex mb-1 font-bold'}>
            New password <span class='text-red-500 ml-0.5'>*</span>
          </span>

          <Input
            type='password'
            required
            onInput={(e) => newPassword.value = e.currentTarget.value}
          />
        </label>

        <label>
          <span class={'flex mb-1 font-bold'}>
            Repeat new password <span class='text-red-500 ml-0.5'>*</span>
          </span>

          <Input
            type='password'
            required
            onInput={(e) => newPasswordRepeat.value = e.currentTarget.value}
          />
        </label>

        {formError.value &&
          (
            <div class='my-4'>
              <p class={'text-red-500'}>{formError}</p>
            </div>
          )}

        <Button type='submit' variant='primary'>Update</Button>
      </form>
    </>
  );
}
