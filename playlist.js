const ypi = require(`youtube-playlist-info`)
const messages = require(`./messages.json`)

module.exports = async text => {
  if (!text) return messages.QUIZ.PLEASE_PLAYLIST
  if (text.length < 34) text = null
  if (text.length > 34) text = (text.match(/[&?]list=([^&]+)/i) || [])[1]
  if (!text) return messages.QUIZ.INVALID_PLAYLIST
  return await ypi(process.env.APIKEY, text)
    .catch(error => {
      if (error === `Error: The request is not properly authorized to retrieve the specified playlist.`) {
        return messages.QUIZ.ERROR.UNAVAILABLE
      } else if (error === `Error: The playlist identified with the requests <code>playlistId</code> parameter cannot be found.`) {
        return messages.QUIZ.ERROR.NOTFOUND
      } else if (error === `Error: Bad Request`) {
        return messages.QUIZ.ERROR.BADREQUEST
      } else {
        return messages.QUIZ.ERROR.UNKNOWN_ERROR(error)
      }
    })
}
