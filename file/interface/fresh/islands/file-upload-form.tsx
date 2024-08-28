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
      <div class="flex items-center justify-center w-full mb-8">
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

      <div class={'w-full'}>
        <h3 class="mb-2 font-medium text-gray-900">Expire in :</h3>
      </div>

      <div class="flex flex-col">
        <div class="relative z-0">
          <input type="text" aria-label="inputtext" name="inputtext" id="input11" class="w-full h-14 block leading-5 relative pt-2 px-4 rounded-t text-gray-800 bg-gray-100 border-b focus:border-b-2 border-gray-500 overflow-x-auto focus:outline-none focus:border-primary-600 focus:ring-0 peer" placeholder=" " value=""/>
          <label for="input11" class="absolute text-gray-500 duration-300 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:left-4 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-invalid:text-error-600">First name</label>
        </div>

        <div class="pt-1 px-4 text-xs tracking-[0.4px]">Supporting text</div>
      </div>

      <div class="inline-flex flex-row items-center">
        <div class="[&.active]:bg-secondary-100 h-10 btn-outline relative inline-flex flex-row items-center justify-center gap-x-2 py-2.5 px-6 text-sm tracking-[.00714em] rounded-s-full font-medium border border-gray-500 text-primary-600">
          <input id="check4" type="radio" name="radios" class="z-10 opacity-0 absolute inset-0" value="1" checked/>
          <label class="flex items-center gap-3" for="check1">
            One hour
          </label>
        </div>

        <div class="[&.active]:bg-secondary-100 h-10 btn-outline relative inline-flex flex-row items-center justify-center gap-x-2 py-2.5 px-6 text-sm tracking-[.00714em] font-medium border border-gray-500 text-primary-600 active">
          <input id="check5" type="radio" name="radios" class="z-10 opacity-0 absolute inset-0" value="2"/>
          <label class="flex items-center gap-3" for="check2">
            One day
          </label>
        </div>

        <div class="[&.active]:bg-secondary-100 h-10 btn-outline relative inline-flex flex-row items-center justify-center gap-x-2 py-2.5 px-6 text-sm tracking-[.00714em] rounded-e-full font-medium border border-gray-500 text-primary-600">
          <input id="check6" type="radio" name="radios" class="z-10 opacity-0 absolute inset-0" value="3"/>
          <label class="flex items-center gap-3" for="check3">
            {/*<span class="material-symbols-outlined check-icon">check</span>*/}
            One week
          </label>
        </div>
      </div>

      <ul class="grid w-full md:grid-flow-col mb-8 grid-cols-2 md:grid-cols-none">
        <li>
          <input type="radio" id="hosting-small" name="hosting" value="hosting-small" class="hidden peer" required />
          <label for="hosting-small" class="inline-flex items-center justify-center rounded-s-lg w-full p-3 text-gray-500 bg-white border border-gray-200 cursor-pointer peer-checked:border-yellow-400 peer-checked:bg-yellow-400 peer-checked:text-slate-800 hover:text-gray-600 hover:bg-gray-100">
            <div class="font-semibold">1 hour</div>
          </label>
        </li>

        <li>
          <input type="radio" id="hosting-dbig" name="hosting" value="hosting-biEEg" class="hidden peer"/>
            <label for="hosting-dbig" class="inline-flex items-center justify-center w-full p-3 text-gray-500 bg-white border border-gray-200 cursor-pointer peer-checked:border-yellow-400 peer-checked:bg-yellow-400 peer-checked:text-slate-800 hover:text-gray-600 hover:bg-gray-100">
              <div class="block">
                <div class="font-semibold">1 day</div>
              </div>
            </label>
        </li>

        <li>
          <input type="radio" id="hosting-big" name="hosting" value="hosting-big" class="hidden peer"/>
            <label for="hosting-big" class="inline-flex items-center justify-center w-full p-3 text-gray-500 bg-white border border-gray-200 cursor-pointer peer-checked:border-yellow-400 peer-checked:bg-yellow-400 peer-checked:text-slate-800 hover:text-gray-600 hover:bg-gray-100">
              <div class="block">
                <div class="font-semibold">1 week</div>
              </div>
            </label>
        </li>

        <li>
          <input type="radio" id="hosting-bige" name="hosting" value="hosting-big" class="hidden peer"/>
            <label for="hosting-bige" class="inline-flex items-center justify-center rounded-e-lg w-full p-3 text-gray-500 bg-white border border-gray-200 cursor-pointer peer-checked:border-yellow-400 peer-checked:bg-yellow-400 peer-checked:text-slate-800 hover:bg-gray-100">
              <div class="block">
                <div class="font-semibold">1 month</div>
              </div>
            </label>
        </li>
      </ul>




      {/*<input type='number' name='amount' value={amount.value} />*/}
      {/*<br />*/}
      {/*<input type='file' name='my-file' />*/}
      {/*<br />*/}

      <Button onClick={log} variant={"primary"} class={'w-full'}>Upload</Button>
    </>
  );
}
