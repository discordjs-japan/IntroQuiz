const ypi = require(`youtube-playlist-info`);
const messages = require(`./messages.json`);
const format = require(`string-format`);

module.exports = async (text) => {
  if (!text) return messages.quiz.please_playlist;
  if (text.length < 34) text = null;
  if (text.length > 34) text = (text.match(/[&?]list=([^&]+)/i) || [])[1];
  if (!text) return messages.quiz.invalid_playlist;
  return await ypi(process.env.APIKEY, text)
    .catch((error) => {
      if (error === `Error: The request is not properly authorized to retrieve the specified playlist.`) {
        return messages.quiz.error.unavailable;
      } else if (error === `Error: The playlist identified with the requests <code>playlistId</code> parameter cannot be found.`) {
        return messages.quiz.error.notfound;
      } else if (error === `Error: Bad Request`) {
        return messages.quiz.error.badrequest;
      } else {
        return format(messages.quiz.error.unknown_error, error);
      }
    });
};
