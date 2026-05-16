const MatchingEngine = (() => {
  let _types = null, _traits = null, _matches = null;

  function init(typesData, traitsData, matchesData) {
    _types = typesData; _traits = traitsData; _matches = matchesData;
  }

  function findType(code) {
    return _types && _types.types.find(t => t.code === code);
  }
  function findTypeByName(name) {
    return _types && _types.types.find(t => t.name === name);
  }
  function findTrait(id) {
    return _traits && _traits.traits.find(t => t.id === id);
  }

  function wuxingRel(a, b) {
    if (a === b) return '比和';
    const GEN = {木:'火',火:'土',土:'金',金:'水',水:'木'};
    const RES = {木:'土',土:'水',水:'火',火:'金',金:'木'};
    if (GEN[a]===b || GEN[b]===a) return '相生';
    if (RES[a]===b || RES[b]===a) return '相克';
    return '比和';
  }

  function findMatches(userType) {
    if (!_types) return {soulmate:null,bestie:null,nemesis:null};
    const out = {soulmate:null,bestie:null,nemesis:null};

    for (const t of _types.types) {
      if (t.id === userType.id) continue;
      const diff = Math.abs(userType.yangValue - t.yangValue);
      const rel  = wuxingRel(userType.element, t.element);
      if (!out.soulmate && diff >= 4 && rel === '相生') out.soulmate = t;
      if (!out.bestie   && diff <= 3 && rel === '相生') out.bestie   = t;
      if (!out.nemesis  && diff >= 4 && rel === '相克') out.nemesis  = t;
      if (out.soulmate && out.bestie && out.nemesis) break;
    }

    // Fallback: find anything with the right element relationship
    if (!out.soulmate) {
      out.soulmate = _types.types.find(t => t.id !== userType.id && wuxingRel(userType.element,t.element)==='相生') || null;
    }
    if (!out.bestie) {
      out.bestie = _types.types.find(t => t.id !== userType.id && t.id !== out.soulmate?.id && wuxingRel(userType.element,t.element)==='相生') || null;
    }
    if (!out.nemesis) {
      out.nemesis = _types.types.find(t => t.id !== userType.id && wuxingRel(userType.element,t.element)==='相克') || null;
    }
    return out;
  }

  function matchIntro(kind) {
    return _matches?.matchLogic?.[kind]?.introTemplate || '';
  }

  return { init, findType, findTypeByName, findTrait, findMatches, matchIntro, wuxingRel };
})();
