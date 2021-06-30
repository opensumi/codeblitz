import { parseGitmodules, parseSubmoduleUrl } from '../src/utils';

const submodules = [
  {
    platform: 'github',
    owner: 'microsoft',
    name: 'vscode',
    path: 'lib/vscode',
    url: 'https://github.com/microsoft/vscode.git',
  },
  {
    platform: 'antcode',
    owner: 'kaitian',
    name: 'ide-framework',
    path: 'antcode/ide-framework',
    url: 'git@code.alipay.com:kaitian/ide-framework.git',
  },
  {
    platform: 'gitlab',
    owner: 'kaitian',
    name: 'kaitian-cli',
    path: 'gitlab/kaitian-cli',
    url: 'git@gitlab.alibaba-inc.com:kaitian/kaitian-cli.git',
  },
];

const submodulesContent = submodules.reduce((str, item) => {
  const submodule = `
[submodule "${item.name}"]
  path = ${item.path}
  url = ${item.url}
  `;
  return str + submodule;
}, '');

describe(__filename, () => {
  it('parseGitmodules', () => {
    expect(parseGitmodules(submodulesContent)).toEqual(
      submodules.map((item) => ({
        name: item.name,
        path: item.path,
        url: item.url,
      }))
    );
  });

  it('parseSubmoduleUrl', () => {
    submodules.forEach((item) => {
      expect(parseSubmoduleUrl(item.url)).toEqual({
        owner: item.owner,
        name: item.name,
        platform: item.platform,
      });
    });
  });
});
