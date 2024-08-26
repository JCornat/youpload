import Button from '../../components/button.tsx';

import { effect, signal } from '@preact/signals';
import { JSX } from 'preact';
import Input from '../../components/input.tsx';

const newUsername = signal<string>('');
const formLoading = signal<boolean>(false);
const formError = signal<string>('');
const usernameUpdated = signal<boolean>(false);

const onSubmit = async (event: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (formLoading.value) {
    console.log('SKIP SUBMIT');
    return;
  }

  try {
    formLoading.value = true;
    formError.value = '';

    const res = await fetch('/api/username', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newUsername: newUsername.value,
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      const error = body.error ?? res.statusText;
      throw new Error(error);
    }

    usernameUpdated.value = true;
    newUsername.value = '';
    setTimeout(() => {
      usernameUpdated.value = false;
    }, 5000);
  } catch (error) {
    formError.value = error.message;
  } finally {
    formLoading.value = false;
  }
};

export default function AccountUsernameForm() {
  return (
    <>
      <form onSubmit={onSubmit}>
        <label>
          <span class={'flex mb-1 font-bold'}>
            New username <span class='text-red-500 ml-0.5'>*</span>
          </span>

          <Input
            type='text'
            required
            value={newUsername}
            autocomplete='off'
            onInput={(e) => newUsername.value = e.currentTarget.value}
          />
        </label>

        {formError.value && (
          <div class='my-4'>
            <p class={'text-red-500'}>{formError}</p>
          </div>
        )}

        {usernameUpdated.value ? (
          <Button type='submit' variant='success' disabled={true}>Success</Button>
        ) : (
          <Button type='submit' variant='primary'>Change Username</Button>
        )}
      </form>
    </>
  );
}
