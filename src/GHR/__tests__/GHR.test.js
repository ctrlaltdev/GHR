const GHR = require('../')

const srcReleases = {
  ctrlaltdev: {
    GHR: {
      tag: 'v1.0.0',
      name: 'v1.0.0',
      branch: 'master',
      body: "Yay, it's out",
      draft: false,
      prerelease: false
    }
  }
}

describe('Main Module', () => {
  it('loads successfully', () => {
    const releases = GHR({ dryrun: true, releases: srcReleases })
    expect(releases).resolves.toBe([
      {
        tag_name: 'v1.0.0',
        name: 'v1.0.0',
        body: 'Yay, it\'s out',
        target_commitish: 'master',
        draft: false,
        prerelease: false,
        dryrun: true
      }
    ])
  })
})
