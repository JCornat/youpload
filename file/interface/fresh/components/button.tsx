import { JSX } from "preact";

export default function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      class={`rounded-md px-4 py-1 ${props.class ?? ''}`}
    />
  )
}