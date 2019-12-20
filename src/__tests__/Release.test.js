const Release = require('../Release')

describe('Release Class', () => {
  it('initialize a new instance', () => {
    const release = new Release({})
    expect(release).toBeInstanceOf(Release)
  })

  it('has the correct shape', () => {
    const releaseShort = new Release({ tag: 'tag', name: 'name', branch: 'branch', body: 'body', draft: true, prerelease: true })
    expect(releaseShort.info).toHaveProperty('tag_name', 'tag')
    expect(releaseShort.info).toHaveProperty('name', 'name')
    expect(releaseShort.info).toHaveProperty('target_commitish', 'branch')
    expect(releaseShort.info).toHaveProperty('body', 'body')
    expect(releaseShort.info).toHaveProperty('draft', true)
    expect(releaseShort.info).toHaveProperty('prerelease', true)

    const releaseLong = new Release({ tag: 'tag' })
    expect(releaseLong.info).toHaveProperty('tag_name', 'tag')
    expect(releaseLong.info).toHaveProperty('name', 'tag')
    expect(releaseLong.info).toHaveProperty('target_commitish', 'master')
    expect(releaseLong.info).toHaveProperty('body', '')
    expect(releaseLong.info).toHaveProperty('draft', false)
    expect(releaseLong.info).toHaveProperty('prerelease', false)
  })
})
