class Release {
  constructor (info) {
    this.tag = info.tag
    this.name = info.name
    this.body = info.body
    this.branch = info.branch
    this.draft = info.draft
    this.prerelease = info.prerelease
  }

  get info () {
    return {
      tag_name: this.tag,
      name: this.name ? this.name : this.tag,
      body: this.body ? this.body : '',
      target_commitish: this.branch ? this.branch : 'master',
      draft: this.draft ? this.draft : false,
      prerelease: this.prerelease ? this.prerelease : false
    }
  }
}

module.exports = Release
