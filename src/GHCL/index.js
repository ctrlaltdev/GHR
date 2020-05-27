const updateCheck = require('../updateCheck')
const GitHub = require('../GitHub')

const { GH_PERSONAL_TOKEN } = process.env
const GH = new GitHub(GH_PERSONAL_TOKEN)

updateCheck(GH)

const listProjects = async args => {
  const user = args.includes('-u') ? args[args.indexOf('-u') + 1] : null
  const org = args.includes('-o') ? args[args.indexOf('-o') + 1] : null
  const repo = args.includes('-r') ? args[args.indexOf('-r') + 1] : null
  const state = args.includes('-s') ? args[args.indexOf('-s') + 1] : null

  const projects = await GH.getProjects(user, org, repo, state)
  console.info(projects.map(p => `${p.name}: ${p.id}`).join('\n'))
}

const getLog = async (card) => {
  const issue = await GH.getContent(card.content_url)
  const PR = await GH.getContent(issue.pull_request.url)
  return { repo: PR.head.repo.name, title: PR.title }
}

const sortLog = async logs => {
  const repos = {}
  for (let i = 0; i < logs.length; i++) {
    if (!repos[logs[i].repo]) {
      repos[logs[i].repo] = []
    }
    repos[logs[i].repo].push(logs[i].title)
  }

  printLog(repos)
}

const printLog = repos => {
  const r = Object.keys(repos)
  for (let i = 0; i < r.length; i++) {
    console.info(`### ${r[i]}`)
    for (let k = 0; k < repos[r[i]].length; k++) {
      console.info(`- ${repos[r[i]][k]}`)
    }
  }
}

const getChangeLog = async args => {
  const id = args[1]

  // const project = await GH.getProject(id)
  const columns = await GH.getProjectColumns(id)
  const done = columns.filter(c => c.name === 'Done')[0]
  const cards = await GH.getProjectCards(done.id)

  const promises = []

  for (let i = 0; i < cards.length; i++) {
    promises.push(getLog(cards[i]))
  }

  return Promise.all(promises).then(sortLog).catch(e => console.error(e))
}

module.exports = async (opts = { args: [] }) => {
  const DEBUG = opts.debug || (process.argv.includes('-d', 2) || process.argv.includes('--debug', 2))
  const DRYRUN = opts.dryrun || (process.argv.includes('-n', 2) || process.argv.includes('--dryrun', 2))

  const action = opts.args[0]

  switch (action) {
    case 'list':
      return listProjects(opts.args)
    case 'get':
      return getChangeLog(opts.args)
    default:
      console.info('Please use action verbs: list or get')
      break
  }
}
