class Branch {
  constructor (info) {
    this.tag = info.tag
    this.ref = info.ref || 'develop'
    this.prefix = info.branchPrefix || 'rc/'
  }

  set src (hash) {
    this.sha = hash
  }

  get src () {
    return this.sha
  }
}

module.exports = Branch
