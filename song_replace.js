module.exports = {
  song_replace(name) {
      let a = name.replace(`「`, ``).replace(/」[^]*/gm, ``);
      a = a.replace(/ -.*/gm, ``);
      a = a.replace(/ ～.*/gm, ``);
      a = a.replace(/[^]*(\\.|[^『])『/gm, ``).replace(/』[^]*/gm, ``);
      a = a.replace(/【.*?】/g, ``);
  ////    a = a.replace(/[^]*(\\.|[^- ])*- /gm, ""); // ダメ
      a = a.replace(/[^]*(\\.|[^／])／/gm, ``);
      a = a.replace(/[^]*(\\.|[^「])「/gm, ``).replace(/」[^]*/gm, ``);
  //    a = a.replace(/\(.*/gm, "");
      a = a.replace(/"/gm, ``);
  //    a = a.replace(/-[^]*/gm, "");
      a = a.replace(/\[[^]*/gm, ``);
      a = a.replace(/\/.*/, ``);
      if (/.*?-([^-].*?)-.*/gm.test(a)) {
        const result = a.replace(/.*?- /, ``).replace(/ -.*/, ``);
        return result;
      } else {
        a = a.replace(/.* -/g, ``);
      }
      const result = a.replace(/（.*/gm, ``);
      return result;
  },
  song_replace2(name) {
      let a = name;
      a = a.replace(`「`, ``).replace(/」[^]*/gm, ``);
      if (/.*『.*』.*-.*／.*/gm.test(a)) {
        a = a.replace(/／.*/g, ``).replace(/ -.*/, ``).replace(/.*』/, ``);
      } else {
        a = a.replace(/[^]*(\\.|[^『])『/gm, ``).replace(/』[^]*/gm, ``);
      }
      a = a.replace(/【.*?】/g, ``);
      a = a.replace(/.*:: /gm, ``);
  ////    a = a.replace(/[^]*(\\.|[^- ])*- /gm, ""); // ダメ
      a = a.replace(/[^]*(\\.|[^／])／/gm, ``);
      a = a.replace(/[^]*(\\.|[^「])「/gm, ``).replace(/」[^]*/gm, ``);
  //    a = a.replace(/\(.*/gm, "");
      a = a.replace(/"/gm, ``);
  //    a = a.replace(/-[^]*/gm, "");
      a = a.replace(/\[[^]*/gm, ``);
      a = a.replace(/.*\//, ``);
      if (/.*?-([^-].*?)-.*/gm.test(a)) {
        const result = a.replace(/ -.*/, ``);
        return result;
      } else {
        a = a.replace(/.* -/g, ``);
      }
      a = a.replace(/ & .*/gm, ``);
      a = a.replace(/[^a-zA-Z0-9!?\s]*/gm, ``);
      a = a.replace(/（.*/gm, ``);
      if (a != `Intro`) {
        a = a.replace(`Intro`, ``);
      }
      a = a.replace(/\s*(b|B)y.*/gm, ``);
      const result = a;
      return result;
  },
  song_replace3(name) {
    const songname = name;
    let a = songname.replace(`「`, ``).replace(/」[^]*/gm, ``);
    if (/.*『.*』.*-.*／.*/gm.test(a)) {
      a = a.replace(/／.*/g, ``).replace(/[^]*(\\.|[^- ])*- /gm, ``);
    } else {
      a = a.replace(/[^]*(\\.|[^『])『/gm, ``).replace(/』[^]*/gm, ``);
    }
    a = a.replace(/【.*?】/g, ``);
  ////    a = a.replace(/[^]*(\\.|[^- ])*- /gm, ""); // ダメ
    a = a.replace(/[^]*(\\.|[^／])／/gm, ``);
    a = a.replace(/[^]*(\\.|[^「])「/gm, ``).replace(/」[^]*/gm, ``);
  //    a = a.replace(/\(.*/gm, "");
    a = a.replace(/".*?"/gm, ``);
  //    a = a.replace(/-[^]*/gm, "");
    a = a.replace(/\[[^]*/gm, ``);
  //  a = a.replace(/.*\//, "");
    if (/.*?-([^-].*?)-.*/gm.test(a)) {
      const result = a.replace(/.*- /, ``);
      return result;
    } else {
      a = a.replace(/.* -/g, ``);
    }
    a = a.replace(/.* & /gm, ``);
    a = a.replace(/-.*/, ``);
    a = a.replace(/　/gm, ``);
    a = a.replace(/([!]*)/gm, ``);
    a = a.replace(/[^a-zA-Z0-9\s]*/gm, ``);
    a = a.replace(/ feat.*/gm, ``);
    if (a != `Extended`) {
      a = a.replace(`Extended`, ``);
    }
    const result = a.replace(/（.*/gm, ``);
    return result;
  }
};
