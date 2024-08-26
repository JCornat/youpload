import Button from '../../components/button.tsx';

import { signal, computed } from '@preact/signals';
import { JSX } from 'preact';
import Input from '../../components/input.tsx';

const fakeReferralValue = '**********************'
const referral = signal<string>(fakeReferralValue);
const formLoading = signal<boolean>(false);
const formError = signal<string>('');
const disableSubmitButton = computed(() => referral.value !== fakeReferralValue);

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
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();
    referral.value = data.value;
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

          <Input type='text'
            value={referral}
            disabled={true}
          />
        </label>

        {formError.value && (
          <div class='my-4'>
            <p class={'text-red-500'}>{formError}</p>
          </div>
        )}

        <Button type='submit' variant='primary' disabled={disableSubmitButton.value}>Reveal</Button>
      </form>
    </>
  );
}
