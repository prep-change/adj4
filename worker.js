export async function startWorker(inputData) {
  const workerUrl = new URL('./workerModule.js', import.meta.url);
  const worker = new Worker(workerUrl, { type: 'module' });

  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      resolve(e.data);
      worker.terminate();
    };
    worker.onerror = (e) => {
      reject(e);
      worker.terminate();
    };
    worker.postMessage(inputData);
  });
}
