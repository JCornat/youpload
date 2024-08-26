import Button from '../../components/button.tsx';
import { signal } from '@preact/signals';
import { JSX } from 'preact';
import Input from '../../components/input.tsx';

const currentPassword = signal<string>('');
const newPassword = signal<string>('');
const newPasswordRepeat = signal<string>('');
const formLoading = signal<boolean>(false);
const formError = signal<string>('');
const passwordUpdated = signal<boolean>(false);

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

    const body = await res.json();
    if (!res.ok) {
      const error = body.error ?? res.statusText;
      throw new Error(error);
    }

    passwordUpdated.value = true;
    currentPassword.value = '';
    newPassword.value = '';
    newPasswordRepeat.value = '';
    setTimeout(() => {
      passwordUpdated.value = false;
    }, 5000);
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
            value={currentPassword}
            autocomplete='off'
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
            value={newPassword}
            autocomplete='off'
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
            value={newPasswordRepeat}
            autocomplete='off'
            onInput={(e) => newPasswordRepeat.value = e.currentTarget.value}
          />
        </label>

        {formError.value && (
          <div class='my-4'>
            <p class={'text-red-500'}>{formError}</p>
          </div>
        )}

        {passwordUpdated.value ? (
          <Button type='submit' variant='success' disabled={true}>Success</Button>
        ) : (
          <Button type='submit' variant='primary'>Change Password</Button>
        )}
      </form>
    </>
  );
}
