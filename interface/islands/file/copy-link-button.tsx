import Button from '@interface/components/button.tsx';
import { signal } from '@preact/signals';

const linkCopied = signal<boolean>(false);

export default function FileCopyLinkButton(props: { payload: string }) {
  const copyLink = async () => {
    const link = `${location.origin}${props.payload}`;
    await navigator.clipboard.writeText(link);
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
    }, 5000);
  };

  return (
    <>
      {linkCopied.value
        ? (
          <>
            <Button variant={'secondary'} class={'w-full'}>Copied !</Button>
          </>
        )
        : (
          <>
            <Button variant={'secondary'} class={'w-full'} onClick={copyLink}>Copy link</Button>
          </>
        )}
    </>
  );
}
