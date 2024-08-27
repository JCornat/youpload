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
      <div class="flex items-center justify-center w-full">
        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-400 border-dashed rounded-lg cursor-pointer bg-slate-200">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>

            <p class="mb-2 mx-4 text-sm text-gray-500 text-center"><span class="font-semibold">Click to upload</span> or drag and drop</p>
          </div>

          <input id="dropzone-file" type="file" class="hidden" />
        </label>
      </div>

      {/*<input type='number' name='amount' value={amount.value} />*/}
      {/*<br />*/}
      {/*<input type='file' name='my-file' />*/}
      {/*<br />*/}
      {/*<Button onClick={log}>Upload</Button>*/}
    </>
  );
}
