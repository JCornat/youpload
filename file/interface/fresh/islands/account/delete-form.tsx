import Button from '../../components/button.tsx';

import { effect, signal } from '@preact/signals';
import { JSX } from 'preact';
import Input from '../../components/input.tsx';

const currentPassword = signal<string>('');
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

    const res = await fetch('/api/account', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: currentPassword.value,
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

export default function AccountDeleteForm() {
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

        {formError.value &&
          (
            <div class='my-4'>
              <p class={'text-red-500'}>{formError}</p>
            </div>
          )}

        <Button type='submit' variant='danger'>Delete Account</Button>
      </form>
    </>
  );
}
