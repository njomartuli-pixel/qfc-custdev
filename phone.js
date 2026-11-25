/* =========================================================
   Телефон нөмірі маскасы: +7 (7XX) XXX-XX-XX
   Ережесі: өрісте әрқашан +7 тұрады, артынан 10 цифр.
   Өшіргенде (Backspace) бөлгішті (") - пробел") емес, соңғы цифрды өшіреді,
   сондықтан нөмір ешқашан өздігінен өзгермейді.
   ========================================================= */
window.QFCPhone = {
  // өрістегі мәтіннен +7-ден кейінгі 10 цифрды алу
  local(raw){
    const s = String(raw || '').trim();
    let d = s.replace(/\D/g, '');
    if (s.startsWith('+7')) d = d.slice(1);                                  // +7 — ел коды
    else if (d.length === 11 && (d[0] === '7' || d[0] === '8')) d = d.slice(1); // 8701... / 7701... қойылса
    return d.slice(0, 10);
  },
  // 10 цифрды көрсету: +7 (701) 234-56-78 (толық емес болса да)
  format(local){
    const d = String(local || '').replace(/\D/g, '').slice(0, 10);
    let s = '+7';
    if (d.length) s += ' (' + d.slice(0, 3);
    if (d.length >= 3) s += ')';
    if (d.length > 3) s += ' ' + d.slice(3, 6);
    if (d.length > 6) s += '-' + d.slice(6, 8);
    if (d.length > 8) s += '-' + d.slice(8, 10);
    return d.length ? s : '+7 ';
  },
  // сақталған 11 таңбалы нөмірді (77011234567) көрсету
  pretty(full){ const d = String(full || '').replace(/\D/g, ''); return this.format(d.length === 11 ? d.slice(1) : d); },
  // толық нөмір (11 цифр, 7-ден басталады) немесе толық емес болса ''
  full(raw){ const l = this.local(raw); return l.length === 10 ? '7' + l : ''; },
  // input өрісіне маска орнату
  attach(input){
    let prev = this.local(input.value);
    const apply = (e) => {
      let l = this.local(input.value);
      // бөлгішті өшірмек болса — оның орнына соңғы цифрды өшіреміз
      if (e && e.inputType && e.inputType.indexOf('delete') === 0 && l === prev && l.length) l = l.slice(0, -1);
      prev = l;
      input.value = this.format(l);
      const end = input.value.length;
      try { input.setSelectionRange(end, end); } catch (_) {}
    };
    input.addEventListener('input', apply);
    input.addEventListener('focus', () => { if (!input.value) input.value = '+7 '; });
    input.value = this.format(prev);
    return { set: (v) => { prev = this.local(v); input.value = this.format(prev); }, clear: () => { prev = ''; input.value = '+7 '; } };
  }
};
