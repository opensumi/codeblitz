if (!/yarn\.js$/.test(process.env.npm_execpath || '')) {
  console.warn('\u001b[33m⚠ 需要使用 Yarn >= 1.x 以支持 Workspaces\u001b[39m\n');
  process.exit(1);
}
