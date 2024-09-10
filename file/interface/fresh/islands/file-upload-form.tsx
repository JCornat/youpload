import Button from '../components/button.tsx';
import { computed, signal } from '@preact/signals';
import SegmentedButton from '../components/segmented-button.tsx';
import ProgressBar from '../components/progress-bar.tsx';

const uploadProgress = signal<number>(0);
const fileInput = signal<File | undefined>(undefined);
const amount = signal<number>(1);
const fileSize = computed(() => formatBytes(fileInput.value?.size));
const formError = signal<string>('');
const uploadInProgress = signal<boolean>(false);
let xhr: XMLHttpRequest | null = null;

const upload = () => {
  if (!fileInput.value) {
    formError.value = 'No file selected';
    return;
  }

  formError.value = '';
  uploadInProgress.value = true;

  const formData = new FormData();
  formData.append('file', fileInput.value);
  formData.append('amount', '1');

  try {
    xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload'); // Replace with your actual upload endpoint

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        uploadProgress.value = Math.round((e.loaded / e.total) * 100);
      }
    };

    xhr.onload = () => {
      if (!xhr) {
        return;
      }

      const response = JSON.parse(xhr.responseText);
      if (xhr.status !== 200) {
        uploadProgress.value = 0; // Reset progress
        formError.value = response.error ?? 'Error';
        uploadInProgress.value = false;
        return;
      }

      window.location.href = `/file/${response.value}`;
    };

    xhr.onerror = () => {
      uploadProgress.value = 0; // Reset progress
      formError.value = 'Upload failed';
      uploadInProgress.value = false;
    };

    xhr.onabort = () => {
      uploadProgress.value = 0; // Reset progress
      uploadInProgress.value = false;
    };

    xhr.send(formData);
  } catch (error) {
    console.error('Upload error:', error);
    uploadProgress.value = 0; // Reset progress
    uploadInProgress.value = false;
  }
};

const abort = () => {
  if (!xhr) {
    return;
  }

  xhr.abort();
};

const formatBytes = (bytes: number = 0, decimals = 2) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function FileUploadForm() {
  return (
    <>
      <div class='flex flex-col md:flex-row mx-auto px-4 md:px-8 lg:px-16 justify-center'>
        <div class='flex items-center justify-center w-full bg-[url(images/bg-blue.jpg)] bg-blue-600 lg:max-w-xl bg-cover p-8 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow ease-in-out duration-300 z-10 relative overflow-hidden'>
          <label class='flex flex-col items-center justify-center w-full md:h-56 border-2 border-white border-dashed rounded-lg cursor-pointer z-10'>
            <div class='flex flex-col items-center justify-center pt-5 pb-6 px-12'>
              <span class='material-symbols-outlined opacity-20 text-[7rem]'>cloud_upload</span>

              {!fileInput.value
                ? (
                  <>
                    <div class='mb-2 mx-4 text-center'>
                      <span class='font-semibold'>Click to upload</span> or drag and drop
                    </div>
                  </>
                )
                : (
                  <>
                    <div class='text-xl text-center font-semibold leading-5 break-all'>{fileInput.value.name}</div>
                    <div class='text-md text-center opacity-70'>{fileSize}</div>
                  </>
                )}
            </div>

            <input
              type='file'
              class='hidden'
              onInput={(e) => fileInput.value = e.currentTarget?.files?.[0]}
            />
          </label>
        </div>

        <div
          class={'border border-gray-300 border-1 bg-indigo-50 overflow-hidden flex flex-col relative -mt-4 mx-6 md:-ml-2 md:mr-0 md:my-8 p-4 pt-8 md:p-8 md:pl-10 shadow-md hover:shadow-lg transition-shadow ease-in-out duration-300 rounded-xl md:min-w-[25rem] bg-white/30'}
        >
          <h3 class='mb-2 font-medium text-slate-700 font-semibold text-center'>Expire in</h3>

          <div class={'btn-segmented inline-flex flex-row items-center mb-4'}>
            <SegmentedButton value={1} type={'radio'} state={amount}>1 hour</SegmentedButton>
            <SegmentedButton value={24} type={'radio'} state={amount}>1 day</SegmentedButton>
            <SegmentedButton value={24 * 7} type={'radio'} state={amount}>1 week</SegmentedButton>
          </div>

          <div className='flex-auto'></div>

          {uploadInProgress.value && (
            <div class={'mb-4 w-full'}>
              <ProgressBar value={uploadProgress.value} />
            </div>
          )}

          {formError.value && (
            <div class='mb-4'>
              <p class={'text-red-500'}>{formError}</p>
            </div>
          )}

          {uploadInProgress.value
            ? (
              <Button onClick={abort} variant={'secondary'} class={'w-full'}>Abort ({uploadProgress.value}%)</Button>
            )
            : (
              <Button onClick={upload} disabled={!fileInput.value} variant={'primary'} class={'w-full'}>Upload</Button>
            )}
        </div>
      </div>
    </>
  );
}
