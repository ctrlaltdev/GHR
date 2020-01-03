const GitHub = require('./GitHub')

const repoExists = async (org, repo) => {
  const { GH_PERSONAL_TOKEN } = process.env
  const GH = new GitHub(GH_PERSONAL_TOKEN)
  const repository = await GH.getRepository(org, repo)
  if (!repository.message) {
    return true
  }
  return false
}

module.exports = {
  repoExists
}
