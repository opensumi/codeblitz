const fs = require('fs')
const path = require('path')
const version = require('../package.json').version
const signale = require('signale')

const { promises: fsp } = fs

const packageDir = path.join(__dirname, '../packages')

const packages = fs.readdirSync(packageDir, { withFileTypes: true })

packages.forEach(async (pkg) => {
  if (!pkg.isDirectory()) return

  const { name } = pkg

  const resolve = (file = '') => path.join(__dirname, '../packages', name, file)

  const pkgPath = resolve('package.json')
  if (fs.existsSync(pkgPath)) return

  signale.pending(`开启初始化模块：${name}`)

  // package.json
  const pkgName = name === 'spacex' ? `@alipay/spacex` : `@alipay/spacex-${name}`
  const json = {
    name: pkgName,
    version,
    description: pkgName,
    main: 'lib/index.js',
    module: 'esm/index.js',
    typings: 'types/index.d.ts',
    files: ['lib', 'esm', 'types'],
    repository: {
      type: 'git',
      url: 'git@code.alipay.com:winjo.gwj/SpaceX.git',
    },
    keywords: ['kaitian AntCodespaces'],
    scripts: {},
    publishConfig: {
      registry: 'https://registry.npm.alibaba-inc.com',
    },
    dependencies: {
      '@alipay/spacex-core': version,
    },
    tnpm: {
      mode: 'yarn',
      lockfile: 'enable'
    },
  }
  await fsp.writeFile(resolve('package.json'), JSON.stringify(json, null, 2))

  // README.md
  await fsp.writeFile(resolve('README.md'), `# ${name}`)

  // src
  await fsp.mkdir(resolve('src'))
  await fsp.writeFile(resolve('src/index.ts'), '')

  // test
  await fsp.mkdir(resolve('__tests__'))
  await fsp.writeFile(
    resolve('__tests__/index.ts'),
    `
describe('test', () => {

})
    `.trim() + '\n'
  )

  // tsconfig.json
  const resolveTSConfig = (relativePath) =>
    path.join(__dirname, '../configs/tsconfig', relativePath)
  const pkgTSConfigPath = resolveTSConfig(name)
  if (fs.existsSync(pkgTSConfigPath)) return

  const buildTSConfigPath = resolveTSConfig('tsconfig.build.json')
  const buildTSConfigJSON = require(buildTSConfigPath)
  const configType = ['cjs', 'esm', 'types']
  for (const type of configType) {
    buildTSConfigJSON.references.push({
      path: `./${name}/tsconfig.${type}.json`,
    })
  }
  await fsp.writeFile(buildTSConfigPath, JSON.stringify(buildTSConfigJSON, null, 2))
  await fsp.mkdir(resolveTSConfig(name))
  const outDirs = {
    cjs: 'lib',
    esm: 'esm',
    types: 'types',
  }
  for (const type of configType) {
    const content = {
      extends: `../tsconfig.${type}.json`,
      compilerOptions: {
        rootDir: `../../../packages/${name}/src`,
        outDir: `../../../packages/${name}/${outDirs[type]}`,
      },
      include: [`../../../packages/${name}/src`],
    }
    if (type === 'types') {
      content.compilerOptions.declarationDir = content.compilerOptions.outDir
      delete content.compilerOptions.outDir
    }
    await fsp.writeFile(
      resolveTSConfig(`./${name}/tsconfig.${type}.json`),
      JSON.stringify(content, null, 2)
    )
  }

  signale.success(`模块 ${name} 初始化成功`)
})
