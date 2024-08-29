import { JSX } from 'preact';

export default function InputNew(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <div class="relative flex flex-col">
      <div class="relative z-0">
        <input {...props}
              name={props.name}
               class="w-full h-14 block leading-5 relative py-2 px-4 rounded bg-neutral-10 border focus:border-2 border-gray-500 overflow-x-auto focus:outline-none focus:border-primary-600 focus:ring-0 dark:text-gray-200 peer" placeholder=" "/>
        <label htmlFor={props.name} class="pointer-events-none absolute text-gray-500 bg-neutral-10 duration-300 transform px-1 -translate-y-7 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:left-4 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 peer-focus:bg-neutral-10 peer-focus:px-1 peer-invalid:text-error-600">{props.label ?? 'Input'}</label>
      </div>

      {/*<div class="pt-1 px-4 text-xs tracking-[0.4px]">Supporting text</div>*/}
    </div>
  );
}


/*
w-full h-14 block leading-5 relative pt-2 px-4 rounded text-gray-800 bg-gray-100 border focus:border-2 border-gray-500 overflow-x-auto focus:outline-none focus:border-primary-600 focus:ring-0 peer
w-full h-14 block leading-5 relative py-2 px-4 rounded bg-neutral-10 border focus:border-2 border-gray-500 overflow-x-auto focus:outline-none focus:border-primary-600 focus:ring-0 dark:text-gray-200 peer
pointer-events-none absolute text-gray-500 duration-300 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:left-4 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-invalid:text-error-600
pointer-events-none absolute text-gray-500 bg-neutral-10 duration-300 transform px-1 -translate-y-7 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:left-4 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 peer-focus:bg-neutral-10 peer-focus:px-1 peer-invalid:text-error-600
 */