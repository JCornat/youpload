import Button from '../../components/button.tsx';

import { signal } from '@preact/signals';
import { JSX } from 'preact';
import Input from '../../components/input.tsx';

const currentPassword = signal<string>('');
const formLoading = signal<boolean>(false);
const formError = signal<string>('');

const onSubmit = async (event: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (formLoading.value) {
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

    const isJSON = res.headers.get('content-type')?.includes('application/json');
    const body = isJSON && await res.json();
    if (!res.ok) {
      const error = body.error ?? res.statusText;
      throw new Error(error);
    }

    window.location.replace('/logout');
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

        <Button type='submit' variant='danger'>Delete Account</Button>
      </form>
    </>
  );
}
