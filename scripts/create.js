const fs = require('fs')
const path = require('path')
const signale = require('signale')

const pkgName = process.argv[2]

if (!pkgName) {
  signale.error('未提供模块名\n')
  process.exit(1)
}

const pkgPath = path.join(__dirname, `../packages/${pkgName}`)
if (fs.existsSync(pkgPath)) {
  signale.error(`模块 ${pkgName} 已存在\n`)
  process.exit(1)
}

fs.mkdirSync(pkgPath)

require('./bootstrap')
