import Button from '../../components/button.tsx';

import { effect, signal } from '@preact/signals';
import { JSX } from 'preact';
import Input from '../../components/input.tsx';

const referral = signal<string>('**********************');
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

    const res = await fetch('/api/referral', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
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

export default function AccountReferralForm() {
  return (
    <>
      <form onSubmit={onSubmit}>
        <label>
          <span class={'flex mb-1 font-bold'}>
            Referral code
          </span>

          <Input
            type='text'
            value={referral}
            disabled={true}
          />
        </label>

        {formError.value &&
          (
            <div class='my-4'>
              <p class={'text-red-500'}>{formError}</p>
            </div>
          )}

        <Button type='submit' variant='primary'>Reveal</Button>
      </form>
    </>
  );
}
