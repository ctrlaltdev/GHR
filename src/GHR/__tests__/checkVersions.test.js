const { isGreaterVersion, checkVersions } = require('../checkVersions')

const cases = [
  ['1.0.0', '0.0.0', true],
  ['1.0.0', '2.0.0', false],
  ['1.0.0', '1.0.0', false],
  ['2.1.0', '2.0.0', true],
  ['2.1.0', '2.2.0', false],
  ['2.1.0', '2.0.9', true],
  ['3.0.1', '3.0.0', true],
  ['3.0.1', '3.0.2', false],
  ['3.0.1', '3.1.0', false]
]

describe('isGreaterVersion Util', () => {
  it('correctly evaluates', () => {
    for (const c of cases) {
      expect(isGreaterVersion(c[0], c[1])).toBe(c[2])
    }
  })
})

describe('checkVersions Util', () => {
  it('correclty evaluates', () => {
    for (const c of cases) {
      expect(checkVersions({ tag_name: c[1] }, { tag_name: c[0] })).toBe(c[2])
    }
  })
})
