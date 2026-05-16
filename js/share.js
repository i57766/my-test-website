const ShareEngine = {
  async generate(mainType, selectedQuote) {
    const card = document.getElementById('share-card');
    if (!card || typeof html2canvas === 'undefined') {
      alert('分享功能加载中，请稍后重试。');
      return;
    }
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF 模块加载失败，请刷新重试。');
      return;
    }

    // 填充卡片内容
    card.querySelector('.sc-name').textContent     = mainType.name;
    card.querySelector('.sc-code').textContent     = mainType.code;
    card.querySelector('.sc-epigraph').textContent = mainType.portrait.epigraph;
    card.querySelector('.sc-quote').textContent    = selectedQuote || '';
    card.style.visibility = 'visible';

    // 等两帧，确保浏览器完成绘制
    await new Promise(r => requestAnimationFrame(r));
    await new Promise(r => requestAnimationFrame(r));

    try {
      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F5F1E8',
        logging: false
      });
      card.style.visibility = 'hidden';

      const imgData = canvas.toDataURL('image/png');

      // 生成 PDF（所有平台都用 PDF）
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const padding = 24;
      const maxW = pageW - padding * 2;
      const maxH = pageH - padding * 2;
      const ratio = canvas.width / canvas.height;
      let w = maxW, h = maxW / ratio;
      if (h > maxH) { h = maxH; w = maxH * ratio; }
      pdf.addImage(imgData, 'PNG', (pageW - w) / 2, (pageH - h) / 2, w, h);

      const fileName = `问心三十二相·${mainType.name}.pdf`;
      const ua = navigator.userAgent;
      const isWeChat = /MicroMessenger|WeChat/i.test(ua);
      const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);

      if (!isMobile && !isWeChat) {
        // 桌面浏览器：直接触发 PDF 下载
        pdf.save(fileName);
        return;
      }

      // 移动端 / 微信：展示覆层，给两种保存方式
      const pdfBlob = pdf.output('blob');
      const pdfUrl  = URL.createObjectURL(pdfBlob);

      this._showOverlay({ imgData, pdfUrl, fileName, isWeChat });

    } catch (e) {
      card.style.visibility = 'hidden';
      console.error('[share]', e);
      alert('生成失败，请截图保存。');
    }
  },

  _showOverlay({ imgData, pdfUrl, fileName, isWeChat }) {
    // 移除可能残留的旧覆层
    const old = document.getElementById('wxszx-save-overlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'wxszx-save-overlay';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'background:rgba(0,0,0,0.92)',
      'z-index:9999', 'display:flex', 'flex-direction:column',
      'align-items:center', 'justify-content:center',
      'gap:14px', 'padding:24px', 'overflow-y:auto'
    ].join(';');

    const tip = document.createElement('p');
    tip.innerHTML = isWeChat
      ? '长按图片 → 保存到相册<br><span style="opacity:0.6;">或点击下方按钮在浏览器中打开 PDF</span>'
      : '长按图片可保存到相册<br><span style="opacity:0.6;">或点击下方按钮下载 PDF</span>';
    tip.style.cssText = 'color:#F5F1E8;font-size:13px;letter-spacing:0.06em;opacity:0.85;margin:0;text-align:center;line-height:1.9;';

    const img = document.createElement('img');
    img.src = imgData;
    img.style.cssText = 'max-width:82vw;max-height:58vh;display:block;box-shadow:0 6px 24px rgba(0,0,0,0.4);';

    const pdfLink = document.createElement('a');
    pdfLink.href = pdfUrl;
    pdfLink.download = fileName;       // 桌面端识别
    pdfLink.target = '_blank';         // 微信/iOS 在新页打开
    pdfLink.rel = 'noopener';
    pdfLink.textContent = isWeChat ? '在浏览器中打开 PDF' : '下载 PDF';
    pdfLink.style.cssText = [
      'color:#F5F1E8', 'font-size:14px', 'letter-spacing:0.08em',
      'border:1px solid rgba(245,241,232,0.45)', 'background:rgba(245,241,232,0.05)',
      'padding:11px 32px', 'text-decoration:none', 'margin-top:4px',
      'display:inline-block'
    ].join(';');

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.cssText = [
      'color:#F5F1E8', 'font-size:13px', 'letter-spacing:0.08em',
      'border:1px solid rgba(245,241,232,0.25)', 'background:none',
      'padding:9px 28px', 'cursor:pointer'
    ].join(';');
    closeBtn.onclick = () => {
      URL.revokeObjectURL(pdfUrl);
      overlay.remove();
    };

    overlay.appendChild(tip);
    overlay.appendChild(img);
    overlay.appendChild(pdfLink);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
  }
};
