export function postFile(endpoint: string, file: File, field = "file") {
  const formData = new FormData();
  formData.append(field, file);

  const xhr = new XMLHttpRequest();

  xhr.open("POST", endpoint);
  xhr.send(formData);

  return xhr.upload;
}
