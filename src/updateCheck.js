const { isGreaterVersion } = require('./checkVersions')
const localVersion = require('../package.json').version

module.exports = GH => {
  GH.getLatestRelease('ctrlaltdev', 'GHR').then(GHR => {
    const remoteVersion = GHR.tag_name.substr(1)
    const needToUpdate = isGreaterVersion(remoteVersion, localVersion)
    if (needToUpdate) {
      console.warn(`A newer version of GHR is available: ${remoteVersion} (Local verison: ${localVersion}) - ${GHR.html_url}`)
    }
  })
}
