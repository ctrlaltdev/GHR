const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

const updateCheck = require('../updateCheck')
const load = require('../load')
const SimpleError = require('../SimpleError')
const GitHub = require('../GitHub')
const Branch = require('./Branch')

const { GH_PERSONAL_TOKEN } = process.env
const GH = new GitHub(GH_PERSONAL_TOKEN)

updateCheck(GH)

const createBranch = async (org, repo, branch, DEBUG = false) => {
  if (!branch.src) {
    throw new SimpleError(`The source branch ${branch.ref} doesn't exist`, DEBUG)
  }
  const newBranch = await GH.createRef(org, repo, { ref: `refs/heads/${branch.prefix}${branch.tag}`, sha: branch.src })
    .then(r => {
      if (r.message) {
        throw new SimpleError(r.message, DEBUG)
      }
      console.info('✅ [CREATED]', `${org}/${repo}/${branch.prefix}${branch.tag}`, `from ${branch.ref}`)
      return r
    })
  return newBranch
}

module.exports = async (opts = {}) => {
  const DEBUG = opts.debug || (process.argv.includes('-d', 2) || process.argv.includes('--debug', 2))
  const DRYRUN = opts.dryrun || (process.argv.includes('-n', 2) || process.argv.includes('--dryrun', 2))

  const releases = load({ DEBUG, DRYRUN })

  const promises = []

  for (const org in releases) {
    for (const repo in releases[org]) {
      const branch = new Branch(releases[org][repo])
      const lastRef = await GH.getRef(org, repo, branch.ref)
      if (!lastRef.message) {
        branch.src = lastRef.object.sha
      }

      if (DRYRUN) {
        promises.push(new Promise((resolve, reject) => {
          if (branch.src) {
            console.info('✅ [CREATE ]', `${org}/${repo}/${branch.prefix}${branch.tag}`, `from ${branch.ref}`)
            resolve({ ...branch, dryrun: true })
          } else {
            console.warn('❌ [ERROR  ]', `${org}/${repo}/${branch.prefix}${branch.tag}`, `from ${branch.ref}`)
            reject(new SimpleError(`The source branch ${branch.ref} doesn't exist`, DEBUG))
          }
        }))
      } else {
        promises.push(createBranch(org, repo, branch, DEBUG))
      }
    }
  }

  return Promise.all(promises).catch(e => console.error(e))
}
