import InputNew from '../../components/input-new.tsx';
import Button from '../../components/button.tsx';
import { signal } from '@preact/signals';
import { JSX } from 'preact';

const formLoading = signal<boolean>(false);
const formError = signal<string>('');
const name = signal<string>('');
const email = signal<string>('');
const password = signal<string>('');
const passwordRepeat = signal<string>('');
const referral = signal<string>('');

const onSubmit = async (event: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (formLoading.value) {
    return;
  }

  try {
    formLoading.value = true;
    formError.value = '';

    const res = await fetch('/api/sign-up', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        referral: referral.value,
      }),
    });

    const isJSON = res.headers.get('content-type')?.includes('application/json');
    const body = isJSON && await res.json();
    if (!res.ok) {
      const error = body.error ?? res.statusText;
      throw new Error(error);
    }

    name.value = '';
    email.value = '';
    password.value = '';
    referral.value = '';
    window.location.replace('/');
  } catch (error) {
    formError.value = error.message;
  } finally {
    formLoading.value = false;
  }
};

export default function SignUpForm() {
  return (
    <form onSubmit={onSubmit}>
      <div className='mb-4'>
        <InputNew
          type='text'
          required
          label={'Name'}
          onInput={(e) => name.value = e.currentTarget.value}
        />
      </div>

      <div className='mb-4'>
        <InputNew
          type='email'
          required
          label={'Email'}
          onInput={(e) => email.value = e.currentTarget.value}
        />
      </div>

      <div className='mb-4'>
        <InputNew
          type='password'
          required
          label={'Password'}
          onInput={(e) => password.value = e.currentTarget.value}
        />
      </div>

      <div className='mb-4'>
        <InputNew
          type='password'
          required
          label={'Repeat password'}
          onInput={(e) => passwordRepeat.value = e.currentTarget.value}
        />
      </div>

      <div className='mb-4'>
        <InputNew
          type='text'
          required
          label={'Referral code'}
          onInput={(e) => referral.value = e.currentTarget.value}
        />
      </div>

      {formError.value && (
        <div class='my-4'>
          <p class={'text-red-500'}>{formError}</p>
        </div>
      )}

      <div class={'flex justify-end gap-8 items-center'}>
        <a href='/sign-up' class={'text-blue-600'}>Sign in</a>
        <Button type='submit' variant='primary'>Create account</Button>
      </div>
    </form>
  );
}
