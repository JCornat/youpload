import { JSX } from 'preact';

export default function Button(props: JSX.HTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'success' | 'danger' }) {
  function getColor(variant?: 'primary' | 'secondary' | 'success' | 'danger') {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-600 focus-visible:outline-blue-600 text-white';
      case 'secondary':
        return 'bg-blue-400/50 hover:bg-blue-400 focus-visible:outline-cyan-600 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-500 focus-visible:outline-green-600';
      case 'danger':
        return 'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-500 focus-visible:outline-gray-600';
    }
  }

  const color = getColor(props.variant);

  return (
    <button
      {...props}
      class={`relative flex flex-row items-center disabled:bg-white/30 disabled:text-slate-500 justify-center gap-x-2 py-2.5 px-6 rounded-[6.25rem] hover:shadow-md disabled:hover:shadow-none disabled:cursor-not-allowed text-sm tracking-[.00714em] font-medium ${color} ${
        props.class ?? ''
      }`}
    />
  );
}
