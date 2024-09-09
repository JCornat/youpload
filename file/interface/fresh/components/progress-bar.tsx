import { JSX } from 'preact';

export default function ProgressBar(props: JSX.HTMLAttributes<HTMLInputElement> & { value?: number }) {
  const isDeterminate = typeof props.value === 'number';

  return (
    <>
      {isDeterminate
        ? (
          <div class='progress-bar-determinate relative overflow-hidden w-full h-1 flex bg-blue-300 rounded-lg overflow-hidden'>
            <div class='bar absolute inset-0 bg-blue-600' style={{ width: `${props.value}%` }}></div>
          </div>
        )
        : (
          <div class='progress-bar-indeterminate relative overflow-hidden w-full h-1 flex bg-blue-300 rounded-lg overflow-hidden'>
            <div class='bar absolute inset-0 w-full bg-blue-600'></div>
            <div class='bar absolute inset-0 w-full bg-blue-600'></div>
          </div>
        )}
    </>
  );
}
