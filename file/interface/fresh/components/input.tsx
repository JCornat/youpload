import { JSX } from 'preact';

export default function Input(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      class={`rounded-md w-full px-3.5 mb-4 py-2.5 text-sm font-semibold bg-white disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        props.class ?? ''
      }`}
    />
  );
}

/*


      <div class="flex flex-col">
        <div class="relative z-0">
          <input type="text" aria-label="inputtext" name="inputtext" id="input11" class="w-full h-14 block leading-5 relative pt-2 px-4 rounded-t text-gray-800 bg-gray-100 border-b focus:border-b-2 border-gray-500 overflow-x-auto focus:outline-none focus:border-primary-600 focus:ring-0 peer" placeholder=" " value=""/>
          <label for="input11" class="absolute text-gray-500 duration-300 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:left-4 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-invalid:text-error-600">First name</label>
        </div>

        <div class="pt-1 px-4 text-xs tracking-[0.4px]">Supporting text</div>
      </div>
 */