const App = {
  PROGRESS_KEY: 'wxszx_progress',
  RESULT_KEY:   'wxszx_result',

  saveProgress(data) {
    try { localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(data)); } catch(e){}
  },
  loadProgress() {
    try { const r = localStorage.getItem(this.PROGRESS_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; }
  },
  clearProgress() {
    localStorage.removeItem(this.PROGRESS_KEY);
  },
  saveResult(data) {
    const str = JSON.stringify(data);
    try { localStorage.setItem(this.RESULT_KEY, str); } catch(e){}
    // sessionStorage 双写兜底（私有模式下 localStorage 可能被阻断）
    try { sessionStorage.setItem(this.RESULT_KEY, str); } catch(e){}
  },
  loadResult() {
    try {
      const r = localStorage.getItem(this.RESULT_KEY)
             || sessionStorage.getItem(this.RESULT_KEY);
      return r ? JSON.parse(r) : null;
    } catch(e){ return null; }
  },
  clearResult() {
    try { localStorage.removeItem(this.RESULT_KEY); } catch(e){}
    try { sessionStorage.removeItem(this.RESULT_KEY); } catch(e){}
  },

  async fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to load ' + path);
    return res.json();
  }
};
