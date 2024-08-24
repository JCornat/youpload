import { JSX } from 'preact';

export default function Input(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      class={`rounded-md w-full px-3.5 mb-4 py-2.5 text-sm font-semibold bg-white disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${props.class ?? ''}`}
    />
  );
}
