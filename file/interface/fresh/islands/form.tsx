import Button from "../components/button.tsx";
import { signal } from '@preact/signals'

const amount = signal<number>(0)

export default function Form() {
  return (
    <>
      <input type='number' name='amount' value={amount.value}/>
      <br/>
      <input type='file' name='my-file'/>
      <br/>
      <Button onClick={(event) => log(event)}>Upload</Button>
    </>
  )
}

function log(event: any) {
  console.log('mdr')
  amount.value++;
}