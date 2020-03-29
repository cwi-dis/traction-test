export function postFile(endpoint: string, file: File, onProgress: (e: ProgressEvent) => void, field = "file") {
  const formData = new FormData();
  formData.append(field, file);

  const xhr = new XMLHttpRequest();
  xhr.upload.onprogress = onProgress;

  const promise = new Promise((resolve, reject) => {
    xhr.upload.onloadend = () => {
      resolve();
    }

    xhr.upload.onerror = (err) => {
      reject(err);
    };
  });

  xhr.open("POST", endpoint);
  xhr.send(formData);

  return promise;
}
