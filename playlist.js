const ypi = require('youtube-playlist-info')
const lang = require('./messages.json')
const { LoggerFactory } = require('logger.js')
const logger = LoggerFactory.getLogger('playlist', 'darkgray')

module.exports = async text => {
  if (!text) return lang.pls_playlist
  if (text.length < 34) text = null
  if (text.length > 34) text = (text.match(/[&?]list=([^&]+)/i) || [])[1]
  if (!text) return lang.invalid_playlist
  return await ypi(process.env.APIKEY, text)
    .catch(error => {
      if (error === 'Error: The request is not properly authorized to retrieve the specified playlist.') {
        return lang.unavailable_playlist
      } else if (error === 'Error: The playlist identified with the requests <code>playlistId</code> parameter cannot be found.') {
        return lang.invalid_playlist
      } else if (error === 'Error: Bad Request') {
        return lang.bad_request_playlist
      } else {
        logger.error(`An unknown error occurred: ${error.stack || error}`)
        return lang.unknown_error
      }
    })
}
