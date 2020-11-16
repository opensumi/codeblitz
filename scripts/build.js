const path = require('path')
const child_process = require('child_process')
const util = require('util')
const signale = require('signale')

const exec = util.promisify(child_process.exec)

run()

async function run() {
  signale.pending('开始编译 ts 文件')
  const tsconfigPath = path.join(__dirname, '../configs/tsconfig/tsconfig.build.json')
  try {
    await exec(`npx tsc -b ${tsconfigPath}`)
    signale.success('编译成功')
  } catch (err) {
    signale.error('编译失败')
    console.log(err.stdout)
  }
}

// async function generateTSConfig(allPackages) {
//   const referencesDir = resolveTSConfig('.references')
//   if (!fs.existsSync(referencesDir)) {
//     await fsp.mkdir(referencesDir)
//   }

//   const buildJSON = {
//     references: [],
//     files: [],
//     include: []
//   }
//   const allTypes = ['cjs', 'esm', 'types']
//   for (const type of allTypes) {
//     const tsconfigTemplate = resolveTSConfig(`tsconfig.${type}.json`)
//     for (const name of allPackages) {
//       const { compilerOptions, include } = getPackageTSConfig(name, type)
//       const tsconfigJSON = {
//         extends: tsconfigTemplate,
//         compilerOptions,
//         include
//       }
//       const configPath = resolveTSConfig(`.references/tsconfig.${name}.${type}.json`)
//       await fsp.writeFile(configPath, JSON.stringify(tsconfigJSON, null, 2))
//       buildJSON.references.push({
//         path: configPath
//       })
//     }
//   }
//   await fsp.writeFile(resolveTSConfig('.references/tsconfig.build.json'), JSON.stringify(buildJSON, null, 2))

//   function getPackageTSConfig(name, type) {
//     const outDirs = {
//       cjs: 'lib',
//       esm: 'esm',
//       types: 'types'
//     }
//     const outDir = resolve(`packages/${name}/${outDirs[type]}`)
//     return {
//       compilerOptions: {
//         rootDir: resolve(`packages/${name}/src`),
//         ...(type === 'types' ? {
//           declarationDir: outDir
//         } : {
//           outDir
//         })
//       },
//       include: [resolve(`packages/${name}/src`)]
//     }
//   }
// }

// async function execTSBuild() {
//   try {
//     await exec(`npx tsc -b ${resolveTSConfig('.references/tsconfig.build.json')}`)
//   } catch (err) {
//     console.log(err.stdout)
//   }
// }

// function resolve(...relativePath) {
//   return path.join(__dirname, '..', ...relativePath)
// }

// function resolveTSConfig(relativePath) {
//   return resolve('configs/tsconfig', relativePath)
// }
