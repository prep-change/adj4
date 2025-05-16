const DENOMS = [10000, 5000, 1000, 500, 100, 50, 10, 5, 1];
const inputsDiv = document.getElementById('inputs');
const resultPre = document.getElementById('result');
const loadingDiv = document.getElementById('loading');

// 金種入力欄を生成
DENOMS.forEach(yen => {
  const row = document.createElement('div');
  row.className = 'flex items-center justify-between';

  const label = document.createElement('label');
  label.textContent = `${yen}円`;
  label.className = 'w-20';

  const input = document.createElement('input');
  input.type = 'number';
  input.min = 0;
  input.value = 0;
  input.id = `input-${yen}`;
  input.className = 'w-24 border rounded p-1';

  row.appendChild(label);
  row.appendChild(input);
  inputsDiv.appendChild(row);
});

// ボタンイベント
document.getElementById('calc').onclick = () => {
  const stock = {};
  DENOMS.forEach(yen => {
    const val = parseInt(document.getElementById(`input-${yen}`).value, 10);
    stock[yen] = isNaN(val) ? 0 : val;
  });

  loadingDiv.classList.remove('hidden');
  resultPre.textContent = '';

  const worker = new Worker('workerModule.js', { type: 'module' });
  worker.postMessage({ stock });

  worker.onmessage = (e) => {
    loadingDiv.classList.add('hidden');
    resultPre.textContent = e.data.output;
    worker.terminate();
  };
};
