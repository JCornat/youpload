import Button from '../../components/button.tsx';
import { computed, signal } from '@preact/signals';
import { JSX } from 'preact';
import Input from '../../components/input.tsx';
import InputNew from "../../components/input-new.tsx";

const fakeReferralValue = '**********************';
const referral = signal<string>(fakeReferralValue);
const formLoading = signal<boolean>(false);
const formError = signal<string>('');
const disableSubmitButton = computed(() => referral.value !== fakeReferralValue);

const onSubmit = async (event: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (formLoading.value) {
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

    const isJSON = res.headers.get('content-type')?.includes('application/json');
    const body = isJSON && await res.json();
    if (!res.ok) {
      const error = body.error ?? res.statusText;
      throw new Error(error);
    }

    referral.value = body.value;
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
        <div className="mb-4">
          <InputNew
            type='text'
            required
            label={'Referral code'}
            value={referral}
            readonly={true}
          />
        </div>

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
