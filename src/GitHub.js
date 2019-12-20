const fetch = require('isomorphic-unfetch')
const SimpleError = require('./SimpleError')

const DEBUG = process.argv.includes('-d', 2) || process.argv.includes('--debug', 2)
const API_URL = 'https://api.github.com'
const VERSION = 'application/vnd.github.v3+json'

class GitHub {
  constructor (token) {
    this.token = token
    if (!token) {
      throw new SimpleError('Invalid GitHub Personal Token', DEBUG)
    }
  }

  async getLatestRelease (org, repo) {
    const release = await fetch(`${API_URL}/repos/${org}/${repo}/releases/latest`, {
      method: 'GET',
      headers: {
        Accept: VERSION,
        Authorization: `Bearer ${this.token}`
      }
    })
      .then(r => r.json())
      .catch(e => console.error(e))
    return release
  }

  async createRelease (org, repo, release) {
    const newRelease = await fetch(`${API_URL}/repos/${org}/${repo}/releases`, {
      method: 'POST',
      headers: {
        Accept: VERSION,
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(release)
    })
      .then(r => r.json())
      .catch(e => console.error(e))
    return newRelease
  }
}

module.exports = GitHub
