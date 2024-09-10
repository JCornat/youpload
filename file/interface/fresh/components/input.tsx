import { JSX } from 'preact';

export default function Input(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <>
      <div class='relative flex flex-col'>
        <div class='relative z-0'>
          <input
            {...props}
            class='w-full h-14 block leading-5 relative pt-2 px-4 rounded-t text-gray-800 bg-gray-100 border-b focus:border-b-2 border-gray-500 overflow-x-auto focus:outline-none focus:border-blue-600 focus:ring-0 peer'
            placeholder=' '
          />

          <label class='pointer-events-none absolute text-gray-500 duration-300 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:left-4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-invalid:text-error-600'>
            {props.label ?? 'Input'}
          </label>
        </div>
      </div>
    </>
  );
}
