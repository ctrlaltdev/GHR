const fetch = require('node-fetch')
const SimpleError = require('./SimpleError')

const DEBUG = process.argv.includes('-d', 2) || process.argv.includes('--debug', 2)
const API_URL = 'https://api.github.com'
const VERSION = 'application/vnd.github.v3+json'
const PREVIEW = 'application/vnd.github.inertia-preview+json'

class GitHub {
  constructor (token) {
    this.token = token
    if (!token) {
      throw new SimpleError('Invalid GitHub Personal Token', DEBUG)
    }
  }

  async getRepository (org, repo) {
    const repository = await fetch(`${API_URL}/repos/${org}/${repo}`, {
      method: 'GET',
      headers: {
        Accept: VERSION,
        Authorization: `Bearer ${this.token}`
      }
    })
      .then(r => r.json())
      .catch(e => console.error(e))
    return repository
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

  async getRef (org, repo, branch) {
    const ref = await fetch(`${API_URL}/repos/${org}/${repo}/git/ref/heads/${branch}`, {
      method: 'GET',
      headers: {
        Accept: VERSION,
        Authorization: `Bearer ${this.token}`
      }
    })
      .then(r => r.json())
      .catch(e => console.error(e))
    return ref
  }

  async getProjects (user, org, repo, state) {
    let type = ''
    if (user) {
      type = `users/${user}`
    } else if (org) {
      type = `orgs/${org}`
    } else {
      throw new SimpleError('Project has to be either bound to a user or an organization', DEBUG)
    }
    if (repo) type += `/${repo}`

    const projects = await fetch(`${API_URL}/${type}/projects${state ? `?state=${state}` : ''}`, {
      method: 'GET',
      headers: {
        Accept: PREVIEW,
        Authorization: `Bearer ${this.token}`
      }
    })
      .then(r => r.json())
      .catch(e => console.error(e))
    return projects
  }

  async getProject (id) {
    const project = await fetch(`${API_URL}/projects/${id}`, {
      method: 'GET',
      headers: {
        Accept: PREVIEW,
        Authorization: `Bearer ${this.token}`
      }
    })
      .then(r => r.json())
      .catch(e => console.error(e))
    return project
  }

  async getProjectColumns (id) {
    const columns = await fetch(`${API_URL}/projects/${id}/columns`, {
      method: 'GET',
      headers: {
        Accept: PREVIEW,
        Authorization: `Bearer ${this.token}`
      }
    })
      .then(r => r.json())
      .catch(e => console.error(e))
    return columns
  }

  async getProjectCards (id) {
    const cards = await fetch(`${API_URL}/projects/columns/${id}/cards`, {
      method: 'GET',
      headers: {
        Accept: PREVIEW,
        Authorization: `Bearer ${this.token}`
      }
    })
      .then(r => r.json())
      .catch(e => console.error(e))
    return cards
  }

  async getContent (url) {
    const content = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: VERSION,
        Authorization: `Bearer ${this.token}`
      }
    })
      .then(r => r.json())
      .catch(e => console.error(e))
    return content
  }

  async createRef (org, repo, branch) {
    const ref = await fetch(`${API_URL}/repos/${org}/${repo}/git/refs`, {
      method: 'POST',
      headers: {
        Accept: VERSION,
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(branch)
    })
      .then(r => r.json())
      .catch(e => console.error(e))
    return ref
  }

  async createPullRequest (org, repo, PR) {
    const pullRequest = await fetch(`${API_URL}/repos/${org}/${repo}/pulls`, {
      method: 'POST',
      headers: {
        Accept: VERSION,
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(PR)
    })
      .then(r => r.json())
      .catch(e => console.error(e))
    return pullRequest
  }
}

module.exports = GitHub
