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
      <div class='flex items-center justify-center w-full mb-8'>
        <label class='flex flex-col items-center justify-center w-full h-64 border-2 border-slate-400 border-dashed rounded-lg cursor-pointer bg-slate-200'>
          <div class='flex flex-col items-center justify-center pt-5 pb-6'>
            {!fileInput.value
              ? (
                <>
                  <svg
                    class='w-16 h-16 mb-4 text-gray-500'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 20 16'
                    width='128'
                    height='128'
                  >
                    <path
                      stroke='currentColor'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                    />
                  </svg>

                  <p class='mb-2 mx-4 text-sm text-gray-500 text-center'>
                    <span class='font-semibold'>Click to upload</span> or drag and drop
                  </p>
                </>
              )
              : (
                <>
                  <p class='mb-2 mx-4 text-sm text-gray-500 text-center font-semibold'>{fileInput.value.name}</p>
                  <p class='mb-2 mx-4 text-sm text-gray-500 text-center font-semibold'>{fileSize}</p>
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

      <h3 class='mb-2 font-medium text-gray-900'>Expire in :</h3>

      <div class={'btn-segmented inline-flex flex-row items-center mb-4'}>
        <SegmentedButton value={1} type={'radio'} state={amount}>One hour</SegmentedButton>
        <SegmentedButton value={24} type={'radio'} state={amount}>One day</SegmentedButton>
        <SegmentedButton value={24 * 7} type={'radio'} state={amount}>One week</SegmentedButton>
      </div>

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
          <>
            <Button onClick={abort} variant={'secondary'} class={'w-full'}>Abort</Button>
          </>
        )
        : (
          <>
            <Button onClick={upload} disabled={!fileInput.value} variant={'primary'} class={'w-full'}>Upload</Button>
          </>
        )}
    </>
  );
}
