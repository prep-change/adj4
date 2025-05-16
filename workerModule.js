self.onmessage = (e) => {
  const input = e.data;
  // 本来の重い処理をここで実行
  const output = {
    message: 'Worker成功！',
    received: input,
    timestamp: new Date().toISOString(),
  };

  postMessage(output);
};
