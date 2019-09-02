const { Command } = require('bot-framework')
const pkg = { name: '???', version: '???', repository: '???' }
const git = require('simple-git/promise')

module.exports = class extends Command {
  constructor() {
    super('version')
  }

  async run(msg, lang, args, sendDeletable) {
    const application = await msg.client.fetchApplication()
    const tag = application.owner.discriminator === '0000' ? '<Owned by Team>' : application.owner.tag
    sendDeletable(`${pkg.name} v${pkg.version} @ ${(await git().revparse(['HEAD'])).slice(0, 7)}
     - Source Code: ${pkg.repository}
     - Bot owner: \`${tag}\` (ID: ${application.owner.id})`)
  }
}
