const path = require('path')
const fs = require('fs')

const getToken = () => {
  console.info('Please enter your personal token: ')
  process.stdin.on('data', data => {
    fs.writeFile(path.join(__dirname, '../.env'), `GH_PERSONAL_TOKEN=${data}`, () => {
      console.info('\nYour token has been saved. You can now run your command again.')
      process.exit(0)
    })
  })
}

const load = () => {
  const loaded = require('dotenv').config({ path: path.join(__dirname, '../.env') })

  return new Promise((resolve, reject) => {
    if (loaded.error || !loaded.parsed.GH_PERSONAL_TOKEN) {
      if ((loaded.error && loaded.error.code === 'ENOENT') || !loaded.parsed.GH_PERSONAL_TOKEN) {
        console.info('You need to provide a GitHub Personal Token, \nyou can get one at https://github.com/settings/tokens/new \nand grant it the repo scope.\n')
        getToken()
        reject(new Error('Creating .env'))
      } else {
        reject(new Error(loaded.error))
      }
    } else {
      resolve(loaded)
    }
  })
}

module.exports = { load }
