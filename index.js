// |---------------------------------------------|
// |  ____      _ ____            _ ____  _   _  |
// | |  _ \    | / ___|          | |  _ \| \ | | |
// | | | | |_  | \___ \ _____ _  | | |_) |  \| | |
// | | |_| | |_| |___) |_____| |_| |  __/| |\  | |
// | |____/ \___/|____/       \___/|_|   |_| \_| |
// |                                             |
// |---------------------------------------------|
//
// GitHub Repository: https://github.com/DJS-JPN/IntroQuiz
//
// GitLab Repository: https://gitlab.com/DJS-JPN/IntroQuiz
//

/* Clear cache */
delete require.cache[require.resolve(`./messages.json`)];

const {"parsed": env} = require(`dotenv-safe`).config();
const discord = require(`discord.js`);
const client = new discord.Client();
const ytdl = require(`ytdl-core`);
const playlist = require(`./playlist`);
const {
  songReplace,
  songReplace2,
  songReplace3
} = require(`./song_replace`);
const process = require(`process`);
const fs = require(`fs`);
const mkdirp = require(`node-mkdirp`);
const format = require(`string-format`);
const messages = require(`./messages.json`);
// eslint-disable-next-line
const levenshtein = function (s1, s2) {if (s1 == s2) {return 0;}const s1_len = s1.length; const s2_len = s2.length; if (s1_len === 0) {return s2_len;}if (s2_len === 0) {return s1_len;}let split = false; try{split = !(`0`)[0];}catch(e){split = true;}if (split) {s1 = s1.split(``); s2 = s2.split(``);}let v0 = new Array(s1_len + 1); let v1 = new Array(s1_len + 1); let s1_idx = 0, s2_idx = 0, cost = 0; for (s1_idx = 0; s1_idx < s1_len + 1; s1_idx++) {v0[s1_idx] = s1_idx;}let char_s1 = ``, char_s2 = ``; for (s2_idx = 1; s2_idx <= s2_len; s2_idx++) {v1[0] = s2_idx; char_s2 = s2[s2_idx - 1]; for (s1_idx = 0; s1_idx < s1_len; s1_idx++) {char_s1 = s1[s1_idx]; cost = (char_s1 == char_s2) ? 0 : 1; let m_min = v0[s1_idx + 1] + 1; const b = v1[s1_idx] + 1; const c = v0[s1_idx] + cost; if (b < m_min) {m_min = b;}if (c < m_min) {m_min = c;}v1[s1_idx + 1] = m_min;}const v_tmp = v0; v0 = v1; v1 = v_tmp;}return v0[s1_len];}
const defaultSettings = {
  "PREFIX": env.PREFIX
};
const commands = {};

let status = false;
let correct = false;
let songinfo = ``;
let connection = ``;
let dispatcher;
let timeout;
let guildSettings;
let settings;
let songs;
let sigintCounts = 0;

client.on(`ready`, () => {
  console.log(messages.console.login_complete);
});

client.on(`message`, async (msg) => {
  if (!msg.guild) return;
  if (msg.author.bot || msg.system) return;
  if (!fs.existsSync(`./data/servers`)) {
    console.log(messages.console.creating_data_folder, `(設定)`);
    mkdirp(`./data/servers`);
  }
  if (!fs.existsSync(`./data/votes/${msg.guild.id}`)) {
    console.log(messages.console.creating_data_folder, `(投票)`);
    mkdirp(`./data/votes/${msg.guild.id}`);
  }
  guildSettings = `./data/servers/${msg.guild.id}.json`;
  if (!fs.existsSync(guildSettings)) {
    console.log(messages.console.creating_settingsfile, guildSettings);
    fs.writeFileSync(guildSettings, JSON.stringify(defaultSettings, null, 4), `utf8`, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  settings = require(guildSettings);
  if (msg.content.startsWith(settings.PREFIX)) {
    console.log(`${msg.author.tag}がコマンドを送信しました: ${msg.content}`);
    const split = msg.content.replace(settings.PREFIX, ``).split(` `);
    const command = split[0];
    if (commands[command]) commands[command].run(msg, split);
    else {
      const cmds = Object.keys(commands);
      const commandList = cmds.map((cmd) => ({
        "command": cmd,
        "levenshtein": levenshtein(split[0], cmd)
      }));
      const similarCmds = commandList.filter((e) => e.levenshtein <= 2)
        .sort((a, b) => a.no - b.no)
        .map((e) => `・\`${settings.PREFIX}${e.command}\``)
        .join(`\n`);
      if (!similarCmds) return;
      msg.channel.send(messages.no_command);
      msg.channel.send(format(messages.didyoumean, similarCmds));
    }
  } else if (status) {
    const answera = songReplace(songinfo[1]);
    const answerb = songReplace2(songinfo[1]); // pickup another answer
    const answerc = songReplace3(songinfo[1]); // pickup another another answer (experimental)
    if (msg.content.includes(answera) || msg.content.includes(answerb) || msg.content.includes(answerc)) {
      correct = true;
      msg.channel.send(format(messages.correct, songinfo[1], songinfo[0]));
      dispatcher.end();
    }
  }
});
commands.ping = {
  "description": `ボットのPingを確認`,
  "usage": [[`ping`, `ボットのPingを確認`]],
  run(msg) {
    msg.channel.send(format(messages.pong, Math.floor(client.ping)));
  }
};

commands.help = {
  "description": `ヘルプを表示`,
  "usage": [[`help [<command>]`, `ヘルプを表示`]],
  run(msg, split) {
    if (split[1]) {
      const cmd = commands[split[1]];
      if (!cmd || !cmd.description && !cmd.usage)
        return msg.channel.send(messages.no_command);
      const embed = new discord.RichEmbed()
        .setTitle(split[1])
        .setTimestamp();
      if (cmd.description) embed.setDescription(cmd.description);
      if (cmd.usage) cmd.usage.forEach((usage) => embed.addField(...usage));
      msg.channel.send(embed);
    } else {
      const embed = new discord.RichEmbed()
        .setTitle(`コマンド一覧`)
        .setTimestamp();
      Object.keys(commands).forEach((cmd) => {
        const command = commands[cmd];
        if (command.description)
          embed.addField(cmd, command.description);
      });
      msg.channel.send(embed);
    }
  }
};

commands.connect = {
  "description": `ボイスチャンネルに接続`,
  "usage": [[`connect`, `ボイスチャンネルに接続`]],
  run(msg) {
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.join().then(() =>
        msg.channel.send(format(messages.join_vc.success, msg.member.voiceChannel.name))
      ).catch((error) => {
        if (msg.member.voiceChannel.full) {
          msg.channel.send(format(messages.join_vc.full, msg.member.voiceChannel.name));
        } else if (!msg.member.voiceChannel.joinable) {
          msg.channel.send(format(messages.join_vc.no_permission, msg.member.voiceChannel.name));
        } else {
          msg.channel.send(format(messages.join_vc.unknown_error, msg.member.voiceChannel.name));
          console.error(format(messages.console.join_vc_error, error));
        }
      });
    } else {
      msg.channel.send(messages.join_vc.tryagain);
    }
  }
};

commands.vote = {
  "description": `投票を作成、投票、終了、状態表示`,
  "usage": [
    [`vote (create|start) <名前> <回答1>|<回答2>[|<回答3>[|...[|<回答10>]]]`, `投票を作成`],
    [`vote vote <投票ID> <投票する番号(1-10)>`, `投票する`],
    [`vote (close|end) <投票ID>`, `投票を閉じる`],
    [`vote list`, `投票IDの一覧を表示`],
    [`vote info`, `投票IDの状況を表示`]
  ],
  run(msg, split) {
    if (split[1] === `create` || split[1] === `start`) {
      if (!(/.*?\|.*?/gm).test(split[3])) return msg.channel.send(messages.votes.invalid_usage);
      if (split[3].split(`|`).length > 10) return msg.channel.send(format(messages.votes.too_many_args, split[3].split(`|`).length - 1));
      let voteId = Math.random().toString(36).substr(2, 5);
      const guildId = msg.guild.id;
      while (true) {
        if (fs.existsSync(`./data/votes/${guildId}/${voteId}.json`)) {
          voteId = Math.random().toString(36).substr(2, 5);
          continue;
        } else {
          break;
        }
      }
      const args = split[3].split(`|`);
      const voteFile = `./data/votes/${guildId}/${voteId}.json`;
      const voteData = {
        "title": `${split[2]}`,
        "data1": `${args[0]}`,
        "data2": `${args[1]}`,
        "data3": `${args[2]}`,
        "data4": `${args[3]}`,
        "data5": `${args[4]}`,
        "data6": `${args[5]}`,
        "data7": `${args[6]}`,
        "data8": `${args[7]}`,
        "data9": `${args[8]}`,
        "data10": `${args[9]}`,
        "closed": false,
        "votes1": 0,
        "votes2": 0,
        "votes3": 0,
        "votes4": 0,
        "votes5": 0,
        "votes6": 0,
        "votes7": 0,
        "votes8": 0,
        "votes9": 0,
        "votes10": 0,
        "creator": `${msg.author.id}`
      };
      fs.writeFileSync(voteFile, JSON.stringify(voteData, null, 4), `utf8`, (err) => {
        console.error(err);
      });
      const vote = require(voteFile);
      msg.channel.send(`\`${voteId}\`を作成しました。\n投票には、\`${settings.PREFIX}vote vote <ID> <数値>\`を入力してください。`);
      const voteEmbed = new discord.RichEmbed()
        .setTitle(`投票`)
        .addField(vote.data1, vote.votes1)
        .addField(vote.data2, vote.votes2);
      if (vote.data3.toString() !== `undefined`) {
        voteEmbed.addField(vote.data3, vote.votes3);
      }
      if (vote.data4.toString() !== `undefined`) {
        voteEmbed.addField(vote.data4, vote.votes4);
      }
      if (vote.data5.toString() !== `undefined`) {
        voteEmbed.addField(vote.data5, vote.votes5);
      }
      if (vote.data6.toString() !== `undefined`) {
        voteEmbed.addField(vote.data6, vote.votes6);
      }
      if (vote.data7.toString() !== `undefined`) {
        voteEmbed.addField(vote.data7, vote.votes7);
      }
      if (vote.data8.toString() !== `undefined`) {
        voteEmbed.addField(vote.data8, vote.votes8);
      }
      if (vote.data9.toString() !== `undefined`) {
        voteEmbed.addField(vote.data9, vote.votes9);
      }
      if (vote.data10.toString() !== `undefined`) {
        voteEmbed.addField(vote.data10, vote.votes10);
      }
      voteEmbed.addField(`作成者`, client.users.get(vote.creator).toString())
        .setFooter(`閉じられているか: ${vote.closed}`);
      msg.channel.send(voteEmbed);
    } else if (split[1] === `close` || split[1] === `end`) {
      if (!split[2]) return msg.channel.send(messages.wrong_args);
      const voteId = split[2];
      const guildId = msg.guild.id;
      const voteFile = `./data/votes/${guildId}/${voteId}.json`;
      if (!fs.existsSync(voteFile)) return msg.channel.send(messages.votes.no_file);
      let vote = require(voteFile);
      if (vote.creator === msg.author.id) {
        vote.closed = true;
        writeSettings(voteFile, vote, msg.channel);
        vote = require(voteFile);
        msg.channel.send(messages.votes.close);
        const voteEmbed = new discord.RichEmbed()
          .setTitle(`投票`)
          .addField(vote.data1, vote.votes1)
          .addField(vote.data2, vote.votes2);
        if (vote.data3.toString() !== `undefined`) {
          voteEmbed.addField(vote.data3, vote.votes3);
        }
        if (vote.data4.toString() !== `undefined`) {
          voteEmbed.addField(vote.data4, vote.votes4);
        }
        if (vote.data5.toString() !== `undefined`) {
          voteEmbed.addField(vote.data5, vote.votes5);
        }
        if (vote.data6.toString() !== `undefined`) {
          voteEmbed.addField(vote.data6, vote.votes6);
        }
        if (vote.data7.toString() !== `undefined`) {
          voteEmbed.addField(vote.data7, vote.votes7);
        }
        if (vote.data8.toString() !== `undefined`) {
          voteEmbed.addField(vote.data8, vote.votes8);
        }
        if (vote.data9.toString() !== `undefined`) {
          voteEmbed.addField(vote.data9, vote.votes9);
        }
        if (vote.data10.toString() !== `undefined`) {
          voteEmbed.addField(vote.data10, vote.votes10);
        }
        voteEmbed.addField(`作成者`, client.users.get(vote.creator).toString())
          .setFooter(`閉じられているか: ${vote.closed}`);
        msg.channel.send(voteEmbed);
      } else {
        msg.channel.send(messages.no_permission);
      }
    } else if (split[1] === `vote`) {
      if (!split[3]) return msg.channel.send(`${messages.wrong_args}\n投票IDを指定してください。一覧は\`${settings.PREFIX}vote list\`で見れます。`);
      const voteId = split[2];
      const guildId = msg.guild.id;
      const voteFile = `./data/votes/${guildId}/${voteId}.json`;
      if (!fs.existsSync(voteFile)) return msg.channel.send(messages.votes.no_file);
      let vote = require(voteFile);
      if (vote[`closed`] === true) return msg.channel.send(messages.votes.closed);
      vote[`votes${split[3]}`] = ++vote[`votes${split[3]}`];
      writeSettings(voteFile, vote, msg.channel);
      vote = require(voteFile);
      msg.channel.send(messages.votes.voted);
      const voteEmbed = new discord.RichEmbed()
        .setTitle(`投票`)
        .addField(vote.data1, vote.votes1)
        .addField(vote.data2, vote.votes2);
      if (vote.data3.toString() !== `undefined`) {
        voteEmbed.addField(vote.data3, vote.votes3);
      }
      if (vote.data4.toString() !== `undefined`) {
        voteEmbed.addField(vote.data4, vote.votes4);
      }
      if (vote.data5.toString() !== `undefined`) {
        voteEmbed.addField(vote.data5, vote.votes5);
      }
      if (vote.data6.toString() !== `undefined`) {
        voteEmbed.addField(vote.data6, vote.votes6);
      }
      if (vote.data7.toString() !== `undefined`) {
        voteEmbed.addField(vote.data7, vote.votes7);
      }
      if (vote.data8.toString() !== `undefined`) {
        voteEmbed.addField(vote.data8, vote.votes8);
      }
      if (vote.data9.toString() !== `undefined`) {
        voteEmbed.addField(vote.data9, vote.votes9);
      }
      if (vote.data10.toString() !== `undefined`) {
        voteEmbed.addField(vote.data10, vote.votes10);
      }
      voteEmbed.addField(`作成者`, client.users.get(vote.creator).toString())
        .setFooter(`閉じられているか: ${vote.closed}`);
      msg.channel.send(voteEmbed);
    } else if (split[1] === `list`) {
      const embed = new discord.RichEmbed()
        .setTitle(`投票ID一覧`)
        .setTimestamp();
      const list = [];
      const items = fs.readdirSync(`./data/votes/${msg.guild.id}/`);
      for (let i = 0; i < items.length; i++) {
        list.push(items[i].replace(`.json`, ``));
      }
      embed.setDescription(list.join(`\n`));
      msg.channel.send(embed);
    } else if (split[1] === `info`) {
      if (!split[2]) return msg.channel.send(`${messages.wrong_args}\n投票IDを指定してください。一覧は\`${settings.PREFIX}vote list\`で見れます。`);
      const voteId = split[2];
      const guildId = msg.guild.id;
      const voteFile = `./data/votes/${guildId}/${voteId}.json`;
      if (!fs.existsSync(voteFile)) return msg.channel.send(messages.votes.no_file);
      const vote = require(voteFile);
      const voteEmbed = new discord.RichEmbed()
        .setTimestamp()
        .setTitle(`投票`)
        .addField(vote.data1, vote.votes1)
        .addField(vote.data2, vote.votes2);
      if (vote.data3.toString() !== `undefined`) {
        voteEmbed.addField(vote.data3, vote.votes3);
      }
      if (vote.data4.toString() !== `undefined`) {
        voteEmbed.addField(vote.data4, vote.votes4);
      }
      if (vote.data5.toString() !== `undefined`) {
        voteEmbed.addField(vote.data5, vote.votes5);
      }
      if (vote.data6.toString() !== `undefined`) {
        voteEmbed.addField(vote.data6, vote.votes6);
      }
      if (vote.data7.toString() !== `undefined`) {
        voteEmbed.addField(vote.data7, vote.votes7);
      }
      if (vote.data8.toString() !== `undefined`) {
        voteEmbed.addField(vote.data8, vote.votes8);
      }
      if (vote.data9.toString() !== `undefined`) {
        voteEmbed.addField(vote.data9, vote.votes9);
      }
      if (vote.data10.toString() !== `undefined`) {
        voteEmbed.addField(vote.data10, vote.votes10);
      }
      voteEmbed.addField(`作成者`, client.users.get(vote.creator).toString())
        .setFooter(`閉じられているか: ${vote.closed}`);
      msg.channel.send(voteEmbed);
    } else {
      msg.channel.send(messages.wrong_args);
    }
  }
};

commands.disconnect = {
  "description": `ボイスチャンネルから切断`,
  "usage": [[`disconnect`, `ボイスチャンネルから切断`]],
  run(msg) {
    client.clearTimeout(timeout);
    if (status) {
      status = false;
      correct = false;
      dispatcher.end();
      connection.disconnect();
    }
    if (!msg.guild.me.voiceChannel) return msg.channel.send(messages.exit_vc_notjoined);
    msg.guild.me.voiceChannel.leave();
    msg.channel.send(format(messages.exit_vc, msg.guild.me.voiceChannel.name));
  }
};

commands.quiz = {
  "description": `イントロクイズを開始、終了`,
  "usage": [
    [`quiz start <YouTubeプレイリスト>`, `イントロクイズを開始`],
    [`quiz (end|stop)`, `イントロクイズを終了`]
  ],
  async run(msg, split) {
    if (split[1] === `start`) {
      if (status) return;
      if (msg.member.voiceChannel) {
        if (!split[2]) return msg.channel.send(messages.quiz.please_playlistid);
        split[2] = split[2].replace(/_/gm, `M`);
        console.log(`Argument2: ${split[2]}`);
        msg.channel.send(messages.quiz.loading);
        if (split[2].length === 0) {
          return msg.channel.send(`読み込めません。バグの可能性が高いです。引数[2]: ${split[2]}`);
        }
        if (split[2].length < 34) {
          return msg.channel.send(messages.quiz.not_enough_count);
        }
        split[2] = split[2].replace(`https://www.youtube.com/playlist?list=`, ``);
        if (split[2].includes(`https://www.youtube.com/watch?v=`) && split[2].includes(`&list=`)) {
          split[2] = split[2].replace(`&list=`, ``);
          split[2] = split[2].replace(`https://www.youtube.com/watch?v=`, ``).slice(11);
          split[2] = split[2].replace(/&index=(\\.|[^&])*/gm, ``);
        }
        const list = await playlist(split[2])
          .catch((error) => {
            if (error.toString() === `Error: The request is not properly authorized to retrieve the specified playlist.`) {
              return msg.channel.send(messages.quiz.error.unavailable);
            } else if (error.toString() === `Error: The playlist identified with the requests <code>playlistId</code> parameter cannot be found.`) {
              return msg.channel.send(messages.quiz.error.notfound);
            } else if (error.toString() === `Error: Bad Request`) {
              return msg.channel.send(messages.quiz.error.badrequest);
            } else {
              return msg.channel.send(format(messages.quiz.error.unknown_error, error));
            }
          });
        if (!Array.isArray(list)) return msg.channel.send(list);
        songs = list.map((video) => [video.resourceId.videoId, video.title]);
        msg.member.voiceChannel.join().then((con) => {
          connection = con;
          status = true;
          nextquiz(msg);
        }).catch((error) => {
          if (msg.member.voiceChannel.full) {
            msg.channel.send(format(messages.join_vc.full, msg.member.voiceChannel.name));
          } else if (!msg.member.voiceChannel.joinable) {
            msg.channel.send(format(messages.join_vc.no_permission, msg.member.voiceChannel.name));
          } else {
            msg.channel.send(format(messages.join_vc.unknown_error, msg.member.voiceChannel.name));
            console.error(format(messages.console.join_vc_error, error));
          }
        });
      } else {
        msg.channel.send(messages.join_vc.tryagain);
      }
    } else if (split[1] === `end` || split[1] === `stop`) {
      if (status) {
        client.clearTimeout(timeout);
        status = false;
        correct = false;
        dispatcher.end();
        connection.disconnect();
        msg.channel.send(messages.quiz.stop);
      } else {
        msg.channel.send(messages.quiz.not_started);
      }
    } else {
      msg.channel.send(messages.wrong_args);
    }
  }
};

function nextquiz(msg, number = 0) {
  msg.channel.send(format(messages.quiz.nextquiz, ++number));
  correct = false;
  timeout = client.setTimeout(() => {
    msg.channel.send(messages.quiz.start);
    songinfo = songs[Math.floor(Math.random() * songs.length)];
    console.log(songinfo);
    const stream = ytdl(songinfo[0], {"filter": `audioonly`});
    dispatcher = connection.playStream(stream);
    dispatcher.on(`end`, () => {
      if (!correct)
        msg.channel.send(format(messages.quiz.uncorrect, songinfo[1], songinfo[0]));
      if (status) nextquiz(msg, number);
    });
  }, 5000);
}

commands.test = {
  run(msg) {
    msg.channel.send(`Extracted name: \`` + songReplace(msg.content.replace(settings.PREFIX + `test `, ``)) + `\``);
  }
};

commands.test2 = {
  run(msg) {
    msg.channel.send(`Extracted name: \`` + songReplace2(msg.content.replace(settings.PREFIX + `test2 `, ``)) + `\``);
  }
};

commands.test3 = {
  run(msg) {
    msg.channel.send(`Extracted name: \`` + songReplace3(msg.content.replace(settings.PREFIX + `test3 `, ``)) + `\``);
  }
};

commands.testmulti = {
  run(msg) {
    const embed = new discord.RichEmbed()
      .setTitle(`判定テスト`)
      .addField(`1つ目の答え`, `\`` + songReplace(msg.content.replace(settings.PREFIX + `testmulti `, ``)) + `\``)
      .addField(`2つ目の答え`, `\`` + songReplace2(msg.content.replace(settings.PREFIX + `testmulti `, ``)) + `\``)
      .addField(`3つ目の答え`, `\`` + songReplace3(msg.content.replace(settings.PREFIX + `testmulti `, ``)) + `\``)
      .setFooter(`元テキスト: \`` + msg.content + `\` / コマンド抜き: \`` + msg.content.replace(settings.PREFIX + `testmulti `, ``) + `\``);
    msg.channel.send(embed);
  }
};

commands.setprefix = {
  "description": `プレフィックスを設定`,
  "usage": [[`setprefix <プレフィックス>`, `プレフィックスを設定`]],
  run(msg, split) {
    if (!msg.member.hasPermission(8)) return msg.channel.send(messages.no_permission);
    const set = settings;
    if (/\s/gm.test(split[1]) || split[1] === null) {
      msg.channel.send(messages.cantsave_nospace);
    } else {
      set.PREFIX = split[1];
      writeSettings(guildSettings, set, msg.channel);
    }
  }
};

function writeSettings(settingsFile, wsettings, channel) {
  fs.writeFileSync(settingsFile, JSON.stringify(wsettings, null, 4), `utf8`, (err) => {
    if (err) {
      console.error(err);
    }
  });
  channel.send(messages.saved_settings);
}

process.on(`SIGINT`, () => {
  console.error(`SIGINTを検知しました。`);
  if (sigintCounts === 0) {
    sigintCounts = ++sigintCounts;
    console.error(`シャットダウン中...`);
    client.destroy();
  }
});

client.login(Buffer.from(Buffer.from(Buffer.from(env.TOKEN, `base64`).toString(`ascii`), `base64`).toString(`ascii`), `base64`).toString(`ascii`));
