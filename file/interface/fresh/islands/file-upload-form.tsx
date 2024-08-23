import Button from '../components/button.tsx';
import { signal } from '@preact/signals';

const amount = signal<number>(0);

const log = (event: any) => {
  console.log('mdr');
  amount.value++;
};

export default function FileUploadForm() {
  return (
    <>
      <input type='number' name='amount' value={amount.value} />
      <br />
      <input type='file' name='my-file' />
      <br />
      <Button onClick={log}>Upload</Button>
    </>
  );
}
