const updateCheck = require('../updateCheck')
const load = require('../load')
const SimpleError = require('../SimpleError')
const GitHub = require('../GitHub')
const Release = require('./Release')
const { repoExists } = require('../checkRepo')
const { checkVersions } = require('../checkVersions')

const { GH_PERSONAL_TOKEN } = process.env
const GH = new GitHub(GH_PERSONAL_TOKEN)

updateCheck(GH)

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

  const releases = load({ DEBUG, DRYRUN })

  const promises = []

  for (const org in releases) {
    for (const repo in releases[org]) {
      const release = new Release(releases[org][repo]).info
      const doesRepoExist = await repoExists(org, repo)
      if (!doesRepoExist) {
        promises.push(new Promise((resolve, reject) => {
          console.warn('❌ [ERROR  ]', `${org}/${repo}`, `${release.target_commitish}@${release.tag_name}`, release.name, release.body.split('\n')[0].length > 80 ? release.body.split('\n')[0].slice(80) : release.body.split('\n')[0])
          reject(new SimpleError('The repository doesn\'t exist or you don\'t have access to it', DEBUG))
        }).catch(e => console.error(e)))
        continue
      }

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
