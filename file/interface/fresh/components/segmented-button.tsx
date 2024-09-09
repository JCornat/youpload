import { JSX } from 'preact';
import { computed, Signal } from '@preact/signals';

export default function SegmentedButton(props: JSX.HTMLAttributes<HTMLButtonElement> & { value: number; type: 'radio'; state: Signal }) {
  const checked = computed(() => props.value === props.state.value);

  const updateState = () => {
    props.state.value = props.value;
  };

  return (
    <>
      <div class={`segmented-item h-10 btn-outline relative inline-flex flex-row items-center justify-center gap-x-2 py-2.5 px-6 text-sm tracking-[.00714em] border border-blue-600 c flex-auto ${checked.value ? 'bg-blue-600 text-white' : 'bg-white/30'}`}>
        <input type={props.type} class='z-10 opacity-0 absolute inset-0 cursor-pointer' checked={checked} onClick={updateState} />
        <label class='flex items-center gap-3 text-nowrap' for='check1'>
          <span class='material-symbols-outlined check-icon'>check</span>
          {props.children}
        </label>
      </div>
    </>
  );
}
