import Button from '@interface/components/button.tsx';
import { signal } from '@preact/signals';

const linkDownloaded = signal<boolean>(false);

export default function FileDownloadLinkButton(props: { url: string }) {
  const { url } = props;
  const downloadLink = () => {
    const link = document.createElement('a');
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    linkDownloaded.value = true;
  };

  return (
    <>
      {linkDownloaded.value
        ? (
          <>
            <Button variant={'primary'} class={'w-full'}>Download has started</Button>
          </>
        )
        : (
          <>
            <Button variant={'primary'} class={'w-full'} onClick={downloadLink}>Download</Button>
          </>
        )}
    </>
  );
}
