const path = require('path')

const yaml = require('js-yaml')
const fs = require('fs')

const SimpleError = require('./SimpleError')

module.exports = (opts = {}) => {
  const DEBUG = opts.debug || (process.argv.includes('-d', 2) || process.argv.includes('--debug', 2))

  const ymlFiles = process.argv.filter(a => a.match(/(\.ya?ml)$/))
  const jsonFiles = process.argv.filter(a => a.match(/(\.json)$/))

  let releasesFile
  let isYML = process.argv.includes('--yml', 2)
  let isJSON = process.argv.includes('--json', 2)

  if (jsonFiles.length > 0 || isJSON) {
    isJSON = true
    releasesFile = jsonFiles.length > 0 ? path.join(process.cwd(), jsonFiles[0]) : `${process.cwd()}/.releases.json`
  } else {
    isYML = true
    releasesFile = ymlFiles.length > 0 ? path.join(process.cwd(), ymlFiles[0]) : `${process.cwd()}/.releases.yml`
  }

  let releases = {}

  try {
    if (opts.releases) {
      releases = opts.releases
    } if (isYML) {
      releases = yaml.safeLoad(fs.readFileSync(releasesFile, 'utf8'))
    } else if (isJSON) {
      releases = JSON.parse(fs.readFileSync(releasesFile, 'utf8'))
    }
  } catch (e) {
    throw new SimpleError(`${releasesFile} not found or invalid`, DEBUG)
  }

  return releases
}
