const isGreaterVersion = (a, b) => {
  if (a === b) {
    return false
  }
  const aVers = a.split('.')
  const bVers = b.split('.')
  for (let i = 0; i < aVers.length; i++) {
    if (Number(aVers[i]) > Number(bVers[i])) {
      return true
    }
    if (Number(aVers[i]) < Number(bVers[i])) {
      return false
    }
  }
  return false
}

const checkVersions = (last, next) => {
  if (last.message && last.message === 'Not Found') {
    return true
  }
  if (last.tag_name === next.tag_name) {
    return false
  }
  let curVer = last.tag_name
  let nextVer = next.tag_name
  const useSEMVER = curVer.match(/v?\d+\.\d+\.\d+/) && nextVer.match(/v?\d+\.\d+\.\d+/)
  if (useSEMVER) {
    if (curVer.match(/v\d+\.\d+\.\d+/)) {
      curVer = curVer.substr(1)
    }
    if (nextVer.match(/v\d+\.\d+\.\d+/)) {
      nextVer = nextVer.substr(1)
    }
    return isGreaterVersion(nextVer, curVer)
  }
  return true
}

module.exports = {
  isGreaterVersion,
  checkVersions
}
