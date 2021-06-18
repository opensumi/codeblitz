import { registerColor, Color } from '@ali/ide-theme';

// vscode.git colors contribution，部分插件依赖这里的颜色
registerColor(
  'gitDecoration.addedResourceForeground',
  {
    light: Color.Format.CSS.parseHex('#587c0c'),
    dark: Color.Format.CSS.parseHex('#81b88b'),
    hc: Color.Format.CSS.parseHex('#1b5225'),
  },
  'Color for added resources.'
);

registerColor(
  'gitDecoration.modifiedResourceForeground',
  {
    light: Color.Format.CSS.parseHex('#895503'),
    dark: Color.Format.CSS.parseHex('#E2C08D'),
    hc: Color.Format.CSS.parseHex('#E2C08D'),
  },
  'Color for modified resources.'
);

registerColor(
  'gitDecoration.deletedResourceForeground',
  {
    light: Color.Format.CSS.parseHex('#ad0707'),
    dark: Color.Format.CSS.parseHex('#c74e39'),
    hc: Color.Format.CSS.parseHex('#c74e39'),
  },
  'Color for deleted resources.'
);

registerColor(
  'gitDecoration.renamedResourceForeground',
  {
    light: Color.Format.CSS.parseHex('#007100'),
    dark: Color.Format.CSS.parseHex('#73C991'),
    hc: Color.Format.CSS.parseHex('#73C991'),
  },
  'Color for renamed or copied resources.'
);

registerColor(
  'gitDecoration.untrackedResourceForeground',
  {
    light: Color.Format.CSS.parseHex('#007100'),
    dark: Color.Format.CSS.parseHex('#73C991'),
    hc: Color.Format.CSS.parseHex('#73C991'),
  },
  'Color for untracked resources.'
);

registerColor(
  'gitDecoration.ignoredResourceForeground',
  {
    light: Color.Format.CSS.parseHex('#8E8E90'),
    dark: Color.Format.CSS.parseHex('#8C8C8C'),
    hc: Color.Format.CSS.parseHex('#A7A8A9'),
  },
  'Color for ignored resources.'
);

registerColor(
  'gitDecoration.stageModifiedResourceForeground',
  {
    light: Color.Format.CSS.parseHex('#895503'),
    dark: Color.Format.CSS.parseHex('#E2C08D'),
    hc: Color.Format.CSS.parseHex('#E2C08D'),
  },
  'Color for modified resources which have been staged.'
);

registerColor(
  'gitDecoration.stageDeletedResourceForeground',
  {
    light: Color.Format.CSS.parseHex('#ad0707'),
    dark: Color.Format.CSS.parseHex('#c74e39'),
    hc: Color.Format.CSS.parseHex('#c74e39'),
  },
  'Color for deleted resources which have been staged.'
);

registerColor(
  'gitDecoration.conflictingResourceForeground',
  {
    light: Color.Format.CSS.parseHex('#ad0707'),
    dark: Color.Format.CSS.parseHex('#e4676b'),
    hc: Color.Format.CSS.parseHex('#c74e39'),
  },
  'Color for resources with conflicts.'
);

registerColor(
  'gitDecoration.submoduleResourceForeground',
  {
    light: Color.Format.CSS.parseHex('#1258a7'),
    dark: Color.Format.CSS.parseHex('#8db9e2'),
    hc: Color.Format.CSS.parseHex('#8db9e2'),
  },
  'Color for submodule resources.'
);
