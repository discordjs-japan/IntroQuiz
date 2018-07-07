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
const fs = require(`fs`);
const mkdirp = require(`node-mkdirp`);
const format = require(`string-format`);
const messages = require(`./messages.json`);
// eslint-disable-next-line
const levenshtein = require('levenshtein');
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
      const similarCmds = commandList.filter((e) => e.levenshtein.distance <= 2)
        .sort((a, b) => a.no - b.no)
        .map((e) => `・\`${settings.PREFIX}${e.command}\``)
        .join(`\n`);
      if (!similarCmds) return;
      msg.channel.send(messages.no_command);
      msg.channel.send(format(messages.didyoumean, similarCmds));
    }
  } else if (status) {
    const answera = songReplace(songinfo[1]); // pickup answer
    const answerb = songReplace2(songinfo[1]); // pickup another answer
    const answerc = songReplace3(songinfo[1]); // pickup another another answer
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
        msg.channel.send(messages.quiz.loading);
        const list = await playlist(messages, split[2]);
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
    if (/\s/gm.test(split[1]) || split[1] === null) return msg.channel.send(messages.cantsave_nospace);
    settings.PREFIX = split[1];
    writeSettings(guildSettings, settings, msg.channel);
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
  setTimeout({
    console.error("強制終了中...");
    process.exit();
  }, 5000);
  console.error(`SIGINTを検知しました。`);
  client.destroy();
});

client.login(Buffer.from(Buffer.from(Buffer.from(env.TOKEN, `base64`).toString(`ascii`), `base64`).toString(`ascii`), `base64`).toString(`ascii`));

process.on('unhandledRejection', console.error)
