(() => {
  const root = document.querySelector('.es-chat');
  if (!root) return;
  const toggle = root.querySelector('.es-chat-toggle');
  const panel = root.querySelector('.es-chat-panel');
  const close = root.querySelector('.es-chat-close');
  const form = root.querySelector('.es-chat-form');
  const input = root.querySelector('#es-chat-input');
  const messages = root.querySelector('.es-chat-messages');
  const quick = root.querySelector('.es-chat-quick');
  const whatsapp = (root.dataset.chatWhatsapp || '').replace(/\D/g, '');
  const name = root.dataset.chatName || 'EasyStore Assistant';
  function bubble(text, who) {
    const p = document.createElement('p');
    p.className = 'es-chat-bubble' + (who === 'user' ? ' user' : '');
    p.textContent = text;
    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
  }
  function answer(text) {
    const q = text.toLowerCase();
    if (/delivery|shipping|deliver|ڈیلیوری|پہنچ/.test(q)) return 'We deliver across Pakistan. Delivery charges and timing are shown at checkout.';
    if (/track|order|آرڈر/.test(q)) return 'For order updates, please check your order confirmation email or contact our support team with your order number.';
    if (/return|refund|واپس/.test(q)) return 'Please review the store return and refund policy, or contact support for help.';
    if (/payment|pay|cash|ادائیگی/.test(q)) return 'Available payment methods appear at checkout for your delivery address.';
    if (whatsapp) return 'Our team can help you with this. Use the WhatsApp button below to contact support.';
    return 'Thanks for your message! Please contact our support team for further assistance.';
  }
  function send(text) {
    text = (text || '').trim().slice(0, 400);
    if (!text) return;
    bubble(text, 'user');
    const reply = answer(text);
    bubble(reply, 'assistant');
    if (whatsapp && /support|contact|help|مدد|رابطہ/i.test(text)) {
      const a = document.createElement('a');
      a.href = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(text);
      a.target = '_blank'; a.rel = 'noopener'; a.className = 'es-text-link';
      a.textContent = 'Chat with us on WhatsApp';
      messages.appendChild(a);
    }
  }
  function open() { panel.hidden = false; toggle.setAttribute('aria-expanded', 'true'); input.focus(); }
  function shut() { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
  toggle.addEventListener('click', () => panel.hidden ? open() : shut());
  close.addEventListener('click', shut);
  form.addEventListener('submit', e => { e.preventDefault(); send(input.value); input.value = ''; input.focus(); });
  quick.addEventListener('click', e => { const b = e.target.closest('[data-chat-question]'); if (b) send(b.dataset.chatQuestion); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) shut(); });
})();