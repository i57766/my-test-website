const ScoringEngine = (() => {
  let _questions = null;

  function norm(a, b) {
    const t = a + b;
    return t === 0 ? 50 : (a - b) / t * 50 + 50;
  }

  function init(data) { _questions = data.questions; }

  function getQ(id) { return _questions && _questions.find(q => q.id === id); }

  function calculate(answers) {
    const d = {
      yang:0,yin:0, xing:0,shen:0, yi:0,ren:0,
      li:0,dao:0, lan:0,yuan:0, langxing:0,foxi:0, qun:0,du:0
    };
    answers.forEach(({questionId, choice}) => {
      const q = getQ(questionId);
      if (!q) return;
      const opt = q.options.find(o => o.label === choice);
      if (!opt || !opt.scores) return;
      Object.entries(opt.scores).forEach(([k, v]) => { if (k in d) d[k] += v; });
    });

    const yangScore    = norm(d.yang, d.yin);
    const xingScore    = norm(d.xing, d.shen);
    const yiScore      = norm(d.yi,   d.ren);
    const liScore      = norm(d.li,   d.dao);
    const lanScore     = norm(d.lan,  d.yuan);
    const langxingScore= norm(d.langxing, d.foxi);
    const qunScore     = norm(d.qun,  d.du);

    const shenScore = 100 - xingScore;
    const renScore  = 100 - yiScore;
    const yuanScore = 100 - lanScore;

    return { yangScore,xingScore,yiScore,liScore,lanScore,langxingScore,qunScore,
             shenScore,renScore,yuanScore, raw:d };
  }

  function getTypeCode(s) {
    return (s.yangScore>=50?'阳':'阴') +
           (s.xingScore>=50?'形':'神') +
           (s.yiScore  >=50?'义':'仁') +
           (s.liScore  >=50?'礼':'道') + '·' +
           (s.lanScore >=50?'澜':'渊');
  }

  function getTraitId(s) {
    const wolf  = s.langxingScore >= 50;
    const group = s.qunScore      >= 50;
    if (wolf  && !group) return 'wolf_solo';
    if (wolf  &&  group) return 'wolf_group';
    if (!wolf && !group) return 'buddha_solo';
    return 'buddha_group';
  }

  function isNeutral(s) {
    return [s.yangScore,s.xingScore,s.yiScore,s.liScore,s.lanScore]
      .every(v => v >= 44 && v <= 56);
  }

  function calcWuChang(s) {
    return {
      zhi: Math.round(s.shenScore * 0.7 + (100 - s.xingScore) * 0.3),
      yi:  Math.round(s.yiScore   * 0.6 + s.langxingScore     * 0.4),
      li:  Math.round(s.liScore),
      ren: Math.round(s.renScore  * 0.6 + s.qunScore          * 0.4),
      xin: Math.round(s.yuanScore * 0.8 + (100 - s.langxingScore) * 0.2)
    };
  }

  function calcWuXing(element) {
    const GEN = {木:'火',火:'土',土:'金',金:'水',水:'木'};
    const RES = {木:'土',土:'水',水:'火',火:'金',金:'木'};
    const elems = ['木','火','土','金','水'];
    const r = {};
    elems.forEach(e => {
      if (e === element) r[e] = 100;
      else if (GEN[element]===e || GEN[e]===element) r[e] = 60;
      else if (RES[element]===e || RES[e]===element) r[e] = 30;
      else r[e] = 80;
    });
    return r;
  }

  return { init, calculate, getTypeCode, getTraitId, isNeutral, calcWuChang, calcWuXing };
})();
