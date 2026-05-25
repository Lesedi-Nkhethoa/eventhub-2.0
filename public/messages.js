'use strict';
const LS = { user:'eventhub_user', users:'eventhub_users', events:'eventhub_events', inbox:'eventhubInboxState' };
const PALETTE = ['#FF3A5C','#FF6A35','#7B3FFF','#00CDA8','#F59E0B','#3B82F6','#EC4899','#10B981'];
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials = n => String(n||'?').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const colorFor = s => { let h=0; for (const c of String(s||'')) h=(h*31+c.charCodeAt(0))>>>0; return PALETTE[h%PALETTE.length]; };
const uid = () => Math.random().toString(36).slice(2,10);
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2600);}
function timeAgo(ts){const d=Math.max(1,Date.now()-ts);const m=Math.floor(d/60000);if(m<1)return'now';if(m<60)return m+'m';const h=Math.floor(m/60);if(h<24)return h+'h';return Math.floor(h/24)+'d';}

if (localStorage.getItem('eventhub_theme') === 'light') document.documentElement.setAttribute('data-theme','light');

let user = JSON.parse(localStorage.getItem(LS.user) || 'null');
if (!user) { location.href = '/index.html'; throw new Error('login required'); }
let users = JSON.parse(localStorage.getItem(LS.users) || '[]');
let events = JSON.parse(localStorage.getItem(LS.events) || '[]');
let inbox = JSON.parse(localStorage.getItem(LS.inbox) || 'null') || { conversations: [], messages: {} };

// seed conversations with the first few users (other than self)
function seedConvs() {
  if (inbox.conversations.length) return;
  const others = users.filter(u => u.id !== user.id).slice(0, 3);
  others.forEach((o, i) => {
    const cid = uid();
    inbox.conversations.push({ id: cid, userId: o.id, lastTs: Date.now() - i*3600000, unread: i === 0 ? 1 : 0 });
    inbox.messages[cid] = [
      { id: uid(), conversationId: cid, senderId: o.id, text: i === 0 ? 'Hey! Going to Afropunk this weekend? 🎉' : 'Saw your latest event — looks awesome!', timestamp: Date.now() - i*3600000 - 60000, type: 'text' },
    ];
  });
  save();
}
function save() { localStorage.setItem(LS.inbox, JSON.stringify(inbox)); }

let activeCid = null;
let convFilter = '';

function renderConvs() {
  const list = inbox.conversations.slice().sort((a,b) => b.lastTs - a.lastTs);
  const filtered = list.filter(c => {
    const u = users.find(x => x.id === c.userId);
    return !convFilter || (u && u.name.toLowerCase().includes(convFilter.toLowerCase()));
  });
  if (!filtered.length) { $('#convs').innerHTML = '<div class="empty"><p>No conversations.</p></div>'; return; }
  $('#convs').innerHTML = filtered.map(c => {
    const u = users.find(x => x.id === c.userId) || { name: 'Unknown', id: '?' };
    const last = (inbox.messages[c.id] || []).slice(-1)[0];
    return `<div class="conv ${activeCid===c.id?'active':''}" data-cid="${c.id}">
      <div class="av" style="background:${colorFor(u.id)};">${esc(initials(u.name))}</div>
      <div class="info">
        <div class="top"><h5>${esc(u.name)}</h5><span class="ts">${last?timeAgo(last.timestamp):''}</span></div>
        <div style="display:flex;align-items:center;gap:8px;">
          <p class="last">${last ? esc(last.type==='event_share' ? '📅 Shared an event' : last.text) : 'No messages'}</p>
          ${c.unread ? `<span class="badge">${c.unread}</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
  $$('.conv').forEach(el => el.addEventListener('click', () => openConv(el.dataset.cid)));
}

function openConv(cid) {
  activeCid = cid;
  const c = inbox.conversations.find(x => x.id === cid); if (!c) return;
  c.unread = 0; save();
  const u = users.find(x => x.id === c.userId) || { name: 'Unknown', id: '?' };
  $('#threadEmpty').hidden = true; $('#threadWrap').hidden = false;
  $('.thread-col').classList.remove('no-active'); $('.conv-col').classList.add('has-active');
  $('#threadName').textContent = u.name;
  $('#threadAv').textContent = initials(u.name); $('#threadAv').style.background = colorFor(u.id);
  renderThread(); renderConvs();
}

function renderThread() {
  const ms = inbox.messages[activeCid] || [];
  $('#thread').innerHTML = ms.map(m => {
    const mine = m.senderId === user.id;
    if (m.type === 'event_share') {
      const e = events.find(x => x.id === m.eventId);
      if (!e) return '';
      return `<div class="msg-bubble ${mine?'out':'in'}">
        <div class="event-share"><img src="${e.image}"><h5>${esc(e.title)}</h5><p>${esc(e.date)} · ${esc(e.location.split(',')[0])}</p></div>
        ${m.text ? esc(m.text) : ''}
        <span class="ts">${timeAgo(m.timestamp)}</span>
      </div>`;
    }
    return `<div class="msg-bubble ${mine?'out':'in'}">${esc(m.text)}<span class="ts">${timeAgo(m.timestamp)}</span></div>`;
  }).join('');
  $('#thread').scrollTop = $('#thread').scrollHeight;
}

function send(text, opts) {
  if (!activeCid) return;
  const m = { id: uid(), conversationId: activeCid, senderId: user.id, text: text || '', timestamp: Date.now(), type: 'text', ...opts };
  inbox.messages[activeCid] = inbox.messages[activeCid] || [];
  inbox.messages[activeCid].push(m);
  const c = inbox.conversations.find(x => x.id === activeCid); if (c) c.lastTs = Date.now();
  save(); renderThread(); renderConvs();
}

function renderShareList() {
  $('#shareList').innerHTML = events.slice(0, 4).map(e => `
    <div class="share-card">
      <img src="${e.image}"><h5>${esc(e.title)}</h5><p>${esc(e.date)}</p>
      <button class="btn-glass" data-quickshare="${e.id}">Share in chat</button>
    </div>`).join('');
  $$('[data-quickshare]').forEach(b => b.addEventListener('click', () => {
    if (!activeCid) return toast('Pick a conversation first');
    send('', { type: 'event_share', eventId: b.dataset.quickshare });
    toast('Event shared');
  }));
}

function openDiscover() {
  const others = users.filter(u => u.id !== user.id);
  $('#discoverGrid').innerHTML = others.map(u => `
    <div class="card" style="padding:14px;text-align:center;">
      <div class="av" style="width:60px;height:60px;border-radius:50%;background:${colorFor(u.id)};display:grid;place-items:center;color:#fff;font-weight:700;margin:0 auto 10px;">${esc(initials(u.name))}</div>
      <h5 style="font-family:'DM Sans';font-size:14px;">${esc(u.name)}</h5>
      <p style="font-size:12px;color:var(--text-s);margin:4px 0 10px;">${esc(u.region)}</p>
      <button class="btn-primary" data-start="${u.id}" style="width:100%;justify-content:center;">Start chat</button>
    </div>`).join('');
  $$('[data-start]').forEach(b => b.addEventListener('click', () => {
    const uid2 = b.dataset.start;
    let existing = inbox.conversations.find(c => c.userId === uid2);
    if (!existing) {
      const cid = uid(); existing = { id: cid, userId: uid2, lastTs: Date.now(), unread: 0 };
      inbox.conversations.push(existing); inbox.messages[cid] = []; save();
    }
    $('#discoverModal').classList.remove('open');
    openConv(existing.id);
  }));
  $('#discoverModal').classList.add('open');
}

function openShareModal() {
  if (!activeCid) return toast('Pick a conversation first');
  $('#shareGrid').innerHTML = events.map(e => `
    <div class="card" style="padding:10px;cursor:pointer;" data-share-ev="${e.id}">
      <img src="${e.image}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;">
      <h5 style="font-family:'DM Sans';font-size:13px;margin-top:8px;">${esc(e.title)}</h5>
      <p style="font-size:11px;color:var(--text-s);">${esc(e.date)}</p>
    </div>`).join('');
  $$('[data-share-ev]').forEach(c => c.addEventListener('click', () => {
    send('', { type: 'event_share', eventId: c.dataset.shareEv });
    $('#shareModal').classList.remove('open'); toast('Event shared');
  }));
  $('#shareModal').classList.add('open');
}

function wire() {
  $('#newChat').addEventListener('click', openDiscover);
  $('#sharePostBtn').addEventListener('click', openShareModal);
  $('#attachBtn').addEventListener('click', openShareModal);
  $('#convSearch').addEventListener('input', (e) => { convFilter = e.target.value; renderConvs(); });
  $('#msgInput').addEventListener('input', (e) => { e.target.style.height='auto'; e.target.style.height = Math.min(120, e.target.scrollHeight) + 'px'; });
  $('#msgInput').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#sendBtn').click(); } });
  $('#sendBtn').addEventListener('click', () => { const t = $('#msgInput').value.trim(); if (!t) return; send(t); $('#msgInput').value=''; $('#msgInput').style.height='auto'; });

  const emojis = ['😀','😂','😍','🥳','🎉','🔥','✨','👏','💯','🙌','😎','😭','❤️','💜','💙','💚','🤔','👀','🎶','🎸','🎤','🍻','📍','✅','🚀','💫','🌟','⚡','🎁','🥂'];
  $('#emojiPop').innerHTML = emojis.map(e => `<button>${e}</button>`).join('');
  $('#emojiBtn').addEventListener('click', (e) => { e.stopPropagation(); $('#emojiPop').classList.toggle('open'); });
  $('#emojiPop').addEventListener('click', (e) => { if (e.target.tagName === 'BUTTON') { $('#msgInput').value += e.target.textContent; $('#emojiPop').classList.remove('open'); $('#msgInput').focus(); } });
  document.addEventListener('click', () => $('#emojiPop').classList.remove('open'));

  $$('.modal-overlay').forEach(o => o.addEventListener('click', (e) => { if (e.target === o || e.target.matches('[data-close]')) o.classList.remove('open'); }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.modal-overlay.open').forEach(o => o.classList.remove('open')); });

  // ?share=<eventId> deep-link
  const params = new URLSearchParams(location.search);
  const shareId = params.get('share');
  if (shareId) {
    if (inbox.conversations.length === 0) seedConvs();
    setTimeout(() => { if (inbox.conversations[0]) { openConv(inbox.conversations[0].id); send('', { type: 'event_share', eventId: shareId }); } }, 200);
    history.replaceState({}, '', '/messages.html');
  }
}

seedConvs();
renderConvs();
renderShareList();
wire();
