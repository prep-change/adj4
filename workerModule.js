const TARGET = {
  5000: 15,
  1000: 42,
  500: 50,
  100: 100,
  50: 50,
  10: 100,
  5: 16,
  1: 20
};

const DENOMS = [10000, 5000, 1000, 500, 100, 50, 10, 5, 1];

function prepareChange(stock) {
  let use = {};
  let shortage = {};
  let total = 0;

  for (const yen of DENOMS) {
    const want = TARGET[yen] || 0;
    const have = stock[yen] || 0;
    const used = Math.min(want, have);
    use[yen] = used;
    if (used < want) {
      shortage[yen] = want - used;
    }
    total += yen * used;
  }

  const supplement = {};
  let shortAmount = Object.entries(shortage).reduce((sum, [yen, count]) => sum + yen * count, 0);
  let remain = shortAmount;

  for (const yen of DENOMS) {
    if (!(yen in stock)) continue;
    const left = (stock[yen] || 0) - (use[yen] || 0);
    if (left <= 0) continue;

    const need = Math.floor(remain / yen);
    const take = Math.min(need, left);
    if (take > 0) {
      supplement[yen] = take;
      use[yen] = (use[yen] || 0) + take;
      remain -= take * yen;
      if (remain <= 0) break;
    }
  }

  const useLines = DENOMS.map(yen => `${yen}円 × ${use[yen] || 0}`).join('\n');
  const shortageLines = Object.keys(shortage).length
    ? '不足金種:\n' + Object.entries(shortage).map(([yen, n]) => `${yen}円 × ${n}`).join('\n')
    : '不足なし';
  const supplementLines = Object.keys(supplement).length
    ? '補填内訳:\n' + Object.entries(supplement).map(([yen, n]) => `${yen}円 × ${n}`).join('\n')
    : '補填なし';

  return `${useLines}\n\n${shortageLines}\n\n${supplementLines}`;
}

self.onmessage = (e) => {
  const { stock } = e.data;
  const output = prepareChange(stock);
  self.postMessage({ output });
};
