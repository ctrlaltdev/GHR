require('dotenv').config()
const GitHub = require('../GitHub')
const SimpleError = require('../SimpleError')

const { GH_PERSONAL_TOKEN } = process.env

describe('GitHub Class', () => {
  it('fails without a token', () => {
    expect(() => {
      return new GitHub()
    }).toThrowError(SimpleError)
  })

  const GH = new GitHub(GH_PERSONAL_TOKEN)
  it('initialize a new instance', () => {
    expect(GH).toBeInstanceOf(GitHub)
  })

  it('retrieve successfully a release', async () => {
    const release = await GH.getLatestRelease('ctrlaltdev', 'GHR')
    expect(release).toHaveProperty('tag_name')
    expect(release).toHaveProperty('name')
    expect(release).toHaveProperty('target_commitish')
    expect(release).toHaveProperty('body')
    expect(release).toHaveProperty('draft')
    expect(release).toHaveProperty('prerelease')
  })
})
