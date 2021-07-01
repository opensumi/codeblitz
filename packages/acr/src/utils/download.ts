export function downloadFile(filename: string, text: string) {
  const element = document.createElement('a');
  element.href = window.URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  element.download = filename;

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
