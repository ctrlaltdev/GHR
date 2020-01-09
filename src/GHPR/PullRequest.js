const Release = require('../GHR/Release')

class PullRequest {
  constructor (info) {
    this.release = new Release(info).info
    this.tag = info.tag
    this.prefix = info.branchPrefix || 'RC/'
  }

  get info () {
    return {
      title: this.release.name,
      body: this.release.body,
      head: `${this.prefix}${this.tag}`,
      base: this.release.target_commitish
    }
  }
}

module.exports = PullRequest
