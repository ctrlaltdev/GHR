const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

const updateCheck = require('../updateCheck')
const load = require('../load')
const SimpleError = require('../SimpleError')
const GitHub = require('../GitHub')
const PullRequest = require('./PullRequest')

const { GH_PERSONAL_TOKEN } = process.env
const GH = new GitHub(GH_PERSONAL_TOKEN)

updateCheck(GH)

const createPR = async (org, repo, PR, DEBUG = false) => {
  const newPR = await GH.createPullRequest(org, repo, PR)
    .then(r => {
      if (r.message) {
        if (r.errors && r.errors.length > 0) {
          throw new SimpleError(r.errors.map(e => e.message).join(', '), DEBUG)
        }
        throw new SimpleError(r.message, DEBUG)
      }
      console.info('✅ [CREATED]', `${org}/${repo}`, `${PR.base} ᐸ ${PR.head}`, r.url)
      return r
    })
  return newPR
}

module.exports = async (opts = {}) => {
  const DEBUG = opts.debug || (process.argv.includes('-d', 2) || process.argv.includes('--debug', 2))
  const DRYRUN = opts.dryrun || (process.argv.includes('-n', 2) || process.argv.includes('--dryrun', 2))

  const releases = load({ DEBUG, DRYRUN })

  const promises = []

  for (const org in releases) {
    for (const repo in releases[org]) {
      const PR = new PullRequest(releases[org][repo]).info

      if (DRYRUN) {
        promises.push(new Promise((resolve, reject) => {
          console.info('✅ [CREATE ]', `${org}/${repo}`, `${PR.base} ᐸ ${PR.head}`)
          resolve({ ...PR, dryrun: true })
        }))
      } else {
        promises.push(createPR(org, repo, PR, DEBUG))
      }
    }
  }

  return Promise.all(promises).catch(e => console.error(e))
}
