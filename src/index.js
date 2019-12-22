const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const yaml = require('js-yaml')
const fs = require('fs')

const SimpleError = require('./SimpleError')
const GitHub = require('./GitHub')
const Release = require('./Release')
const { isGreaterVersion, checkVersions } = require('./checkVersions')
const localVersion = require('../package.json').version

const { GH_PERSONAL_TOKEN } = process.env
const GH = new GitHub(GH_PERSONAL_TOKEN)

GH.getLatestRelease('ctrlaltdev', 'GHR').then(GHR => {
  const remoteVersion = GHR.tag_name.substr(1)
  const needToUpdate = isGreaterVersion(remoteVersion, localVersion)
  if (needToUpdate) {
    console.warn(`A newer version of GHR is available: ${remoteVersion} (Local verison: ${localVersion}) - ${GHR.html_url}`)
  }
})

const getLatestRelease = async (org, repo) => {
  const lastRelease = await GH.getLatestRelease(org, repo)
  return lastRelease
}

const createRelease = async (org, repo, release) => {
  const newRelease = await GH.createRelease(org, repo, release)
    .then(r => {
      console.info('✅ [CREATED]', `${org}/${repo}`, `${r.target_commitish}@${r.tag_name}`, r.name, r.body.split('\n')[0].length > 80 ? r.body.split('\n')[0].slice(80) : r.body.split('\n')[0])
      return r
    })
  return newRelease
}

const shouldCreate = (last, next) => {
  if (last.message === 'Not Found' || last.tag_name !== next.tag_name || last.name !== next.name || last.target_commitish !== next.target_commitish) {
    return true
  }

  return false
}

module.exports = async (opts = {}) => {
  const DEBUG = opts.debug || (process.argv.includes('-d', 2) || process.argv.includes('--debug', 2))
  const DRYRUN = opts.dryrun || (process.argv.includes('-n', 2) || process.argv.includes('--dryrun', 2))

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

  const promises = []

  for (const org in releases) {
    for (const repo in releases[org]) {
      const release = new Release(releases[org][repo]).info

      const latestRes = await getLatestRelease(org, repo)

      const versOK = checkVersions(latestRes, release)
      const CREATE = shouldCreate(latestRes, release)

      if (!versOK) {
        promises.push(new Promise((resolve, reject) => {
          console.warn('❌ [ERROR  ]', `${org}/${repo}`, `${release.target_commitish}@${release.tag_name}`, release.name, release.body.split('\n')[0].length > 80 ? release.body.split('\n')[0].slice(80) : release.body.split('\n')[0])
          reject(new SimpleError('The version you want to create is lesser or equal to the latest remote one', DEBUG))
        }).catch(e => console.error(e)))
      } else if (DRYRUN && CREATE) {
        promises.push(new Promise((resolve) => resolve()).then(() => {
          console.info('✅ [CREATE ]', `${org}/${repo}`, `${release.target_commitish}@${release.tag_name}`, release.name, release.body.split('\n')[0].length > 80 ? release.body.split('\n')[0].slice(80) : release.body.split('\n')[0])
          return { ...release, dryrun: true }
        }))
      } else if (CREATE) {
        promises.push(createRelease(org, repo, release))
      } else {
        promises.push(new Promise((resolve) => resolve()).then(() => {
          console.info('✅ [EXISTS ]', `${org}/${repo}`, `${latestRes.target_commitish}@${latestRes.tag_name}`, latestRes.name, latestRes.body.split('\n')[0].length > 80 ? latestRes.body.split('\n')[0].slice(80) : latestRes.body.split('\n')[0])
          return { ...latestRes, exists: true }
        }))
      }
    }
  }

  return Promise.all(promises).catch(e => console.error(e))
}
