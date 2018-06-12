const ypi = require(`youtube-playlist-info`);

module.exports = async (text) => {
  if(text.length < 34) return `:x: 文字数が足りません(34文字以上であることが必須です)。`;
  text = text.replace(`https://www.youtube.com/playlist?list=`, ``);
  if (~text.indexOf(`https://www.youtube.com/watch?v=`) && ~text.indexOf(`&list=`)) {
    text = text.replace(`&list=`, ``);
    text = text.replace(`https://www.youtube.com/watch?v=`, ``).slice(11);
    text = text.replace(/&index=(\\.|[^&])*/gm, ``);
  }
  return await ypi(process.env.APIKEY, text).
    catch((error) => {
      if (error === `Error: The request is not properly authorized to retrieve the specified playlist.`) {
        return `:x: このプレイリストは非公開です。`;
      } else if (error === `Error: The playlist identified with the requests <code>playlistId</code> parameter cannot be found.`) {
        return `:x: このプレイリストは存在しません。`;
      } else if (error === `Error: Bad Request`) {
        return `:x: Bad Request: YouTube Data APIキーが間違っている可能性があります。`;
      } else {
        return `再生リスト読み込みエラー：\`${error}\``;
      }
    });
};
