import { CodePlatformRegistry } from '../../code-api/src/common/config';
import { parseGitmodules, parseSubmoduleUrl } from '../src/utils';

const submodules = [
  {
    platform: 'github',
    owner: 'microsoft',
    name: 'vscode',
    path: 'lib/vscode',
    url: 'https://github.com/microsoft/vscode.git',
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
      })),
    );
  });

  it('parseSubmoduleUrl', () => {
    const configs = CodePlatformRegistry.instance().getCodePlatformConfigs();
    submodules.forEach((item) => {
      expect(parseSubmoduleUrl(item.url, configs)).toEqual({
        owner: item.owner,
        name: item.name,
        platform: item.platform,
      });
    });
  });
});
