'use strict';
const LS = { user:'eventhub_user', users:'eventhub_users', events:'eventhub_events', state:'eventhub_state', tickets:'eventhub_tickets' };
const PALETTE = ['#FF3A5C','#FF6A35','#7B3FFF','#00CDA8','#F59E0B','#3B82F6','#EC4899','#10B981'];
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials = n => String(n||'?').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const colorFor = s => { let h=0; for (const c of String(s||'')) h=(h*31+c.charCodeAt(0))>>>0; return PALETTE[h%PALETTE.length]; };
const uid = () => Math.random().toString(36).slice(2,10);
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2600);}

let user = JSON.parse(localStorage.getItem(LS.user) || 'null');
let users = JSON.parse(localStorage.getItem(LS.users) || '[]');
let events = JSON.parse(localStorage.getItem(LS.events) || '[]');
let app = JSON.parse(localStorage.getItem(LS.state) || '{"saved":[],"rsvp":{},"orgFollowing":[]}');
let tickets = JSON.parse(localStorage.getItem(LS.tickets) || '[]');
if (localStorage.getItem('eventhub_theme') === 'light') document.documentElement.setAttribute('data-theme','light');

function paintAvatar() {
  const p = $('#avatarPreview');
  if (user.avatar) p.innerHTML = `<img src="${user.avatar}" style="width:100%;height:100%;object-fit:cover;">`;
  else { p.textContent = initials(user.name); p.style.background = colorFor(user.id); p.innerHTML = p.textContent || initials(user.name); p.textContent = initials(user.name); }
}

function paintForm() {
  const f = $('#profileForm');
  f.name.value = user.name; f.bio.value = user.bio || ''; f.role.value = user.role || 'attendee';
  f.region.value = user.region || ''; f.age.value = user.age || ''; f.gender.value = user.gender || 'Female';
}

function paintConnections() {
  const conns = (user.connections || []).map(id => users.find(u => u.id === id)).filter(Boolean);
  $('#connList').innerHTML = conns.length ? conns.map(u => `
    <div class="list-row">
      <div class="av" style="background:${colorFor(u.id)};">${esc(initials(u.name))}</div>
      <div class="info"><h5>${esc(u.name)}</h5><p>${esc(u.region)} · ${esc(u.role)}</p></div>
      <div class="actions"><button class="btn-danger" data-disc="${u.id}">Disconnect</button></div>
    </div>`).join('') : '<p style="color:var(--text-s);font-size:13px;">No connections yet — find people below.</p>';
  $$('[data-disc]').forEach(b => b.addEventListener('click', () => {
    user.connections = user.connections.filter(id => id !== b.dataset.disc);
    persist(); paintConnections();
  }));
  const sugg = users.filter(u => u.id !== user.id && !(user.connections||[]).includes(u.id)).slice(0,5);
  $('#suggList').innerHTML = sugg.length ? sugg.map(u => `
    <div class="list-row">
      <div class="av" style="background:${colorFor(u.id)};">${esc(initials(u.name))}</div>
      <div class="info"><h5>${esc(u.name)}</h5><p>${esc(u.region)} · ${esc(u.role)}</p></div>
      <div class="actions"><button class="btn-glass" data-conn="${u.id}">Connect</button></div>
    </div>`).join('') : '<p style="color:var(--text-s);font-size:13px;">No one new to suggest.</p>';
  $$('[data-conn]').forEach(b => b.addEventListener('click', () => {
    user.connections = user.connections || []; user.connections.push(b.dataset.conn);
    persist(); paintConnections(); toast('Connected');
  }));
}

function paintEvents() {
  const created = events.filter(e => e.createdBy === user.id);
  $('#createdList').innerHTML = created.length ? created.map(e => `
    <div class="list-row">
      <img src="${e.image}" style="width:50px;height:50px;border-radius:8px;object-fit:cover;">
      <div class="info"><h5>${esc(e.title)}</h5><p>${esc(e.date)} · ${e.going} going</p></div>
      <div class="actions"><a class="btn-glass" href="/create.html?edit=${e.id}">Edit</a><button class="btn-danger" data-del="${e.id}">Delete</button></div>
    </div>`).join('') : '<p style="color:var(--text-s);font-size:13px;">You haven\'t created any events yet.</p>';
  $$('[data-del]').forEach(b => b.addEventListener('click', () => {
    if (!confirm('Delete this event?')) return;
    events = events.filter(e => e.id !== b.dataset.del); localStorage.setItem(LS.events, JSON.stringify(events)); paintEvents();
  }));

  const rsvpd = Object.keys(app.rsvp).map(id => events.find(e => e.id === id)).filter(Boolean);
  $('#rsvpList').innerHTML = rsvpd.length ? rsvpd.map(e => `
    <div class="list-row">
      <img src="${e.image}" style="width:50px;height:50px;border-radius:8px;object-fit:cover;">
      <div class="info"><h5>${esc(e.title)}</h5><p>${esc(e.date)} · ${app.rsvp[e.id]}</p></div>
      <div class="actions"><a class="btn-glass" href="/index.html#${e.id}">View</a></div>
    </div>`).join('') : '<p style="color:var(--text-s);font-size:13px;">No RSVPs yet.</p>';
}

function paintTickets() {
  const mine = tickets.filter(t => t.userId === user.id);
  $('#ticketsList').innerHTML = mine.length ? mine.map(t => `
    <div class="ticket-card">
      <h4>${esc(t.eventTitle)}</h4>
      <p style="font-size:12px;color:var(--text-s);">${esc(t.eventDate)} · ${esc(t.eventLocation)}</p>
      <p style="font-size:13px;margin-top:6px;">${t.quantity} × ${t.type === 'vip' ? 'VIP' : 'General'} · <strong>R ${t.totalPrice.toFixed(2)}</strong></p>
      <p class="ref">REF · ${t.bookingRef}</p>
      <div style="margin-top:10px;display:flex;gap:8px;"><button class="btn-glass" data-view="${t.id}">View ticket</button></div>
    </div>`).join('') : '<p style="color:var(--text-s);font-size:13px;">No tickets yet.</p>';
  $$('[data-view]').forEach(b => b.addEventListener('click', () => openTicket(b.dataset.view)));
}

function openTicket(id) {
  const t = tickets.find(x => x.id === id); if (!t) return;
  $('#ticketContent').innerHTML = `
    <div class="modal-head"><h2>Your ticket</h2><button class="close" data-close>✕</button></div>
    <div class="modal-body">
      <div style="text-align:center;font-size:48px;">🎟️</div>
      <h3 style="text-align:center;margin:8px 0;">${esc(t.eventTitle)}</h3>
      <p style="text-align:center;color:var(--text-s);font-size:13px;">${esc(t.eventDate)} · ${esc(t.eventLocation)}</p>
      <p style="text-align:center;font-family:monospace;font-size:24px;letter-spacing:.1em;color:var(--accent);margin-top:14px;">${t.bookingRef}</p>
      <div style="margin-top:18px;background:var(--surface);padding:14px;border-radius:var(--r-sm);">
        <p style="font-size:13px;"><strong>Name:</strong> ${esc(t.userName)}</p>
        <p style="font-size:13px;"><strong>Type:</strong> ${t.type === 'vip' ? 'VIP' : 'General'}</p>
        <p style="font-size:13px;"><strong>Quantity:</strong> ${t.quantity}</p>
        <p style="font-size:13px;"><strong>Total:</strong> R ${t.totalPrice.toFixed(2)}</p>
      </div>
    </div>
    <div class="modal-foot"><button class="btn-glass" data-dl="${t.id}">Download</button><button class="btn-primary" data-close>Close</button></div>`;
  $('#ticketModal').classList.add('open');
  $(`[data-dl="${t.id}"]`).addEventListener('click', () => {
    const txt = `EVENTHUB TICKET\n\n${t.eventTitle}\n${t.eventDate}\n${t.eventLocation}\n\nName: ${t.userName}\nType: ${t.type.toUpperCase()}\nQuantity: ${t.quantity}\nTotal: R ${t.totalPrice.toFixed(2)}\nBooking Ref: ${t.bookingRef}`;
    const blob = new Blob([txt], { type:'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `ticket-${t.bookingRef}.txt`; a.click();
  });
}

function persist() {
  const i = users.findIndex(u => u.id === user.id); if (i >= 0) users[i] = user;
  localStorage.setItem(LS.user, JSON.stringify(user));
  localStorage.setItem(LS.users, JSON.stringify(users));
}

function showAuth() { $('#authGate').hidden = false; $('#profileWrap').hidden = true; }
function showProfile() {
  $('#authGate').hidden = true; $('#profileWrap').hidden = false;
  paintAvatar(); paintForm(); paintConnections(); paintEvents(); paintTickets();
}

function wireProfile() {
  $('#uploadAvatar').addEventListener('click', () => $('#avatarFile').click());
  $('#avatarFile').addEventListener('change', (e) => {
    const f = e.target.files[0]; if (!f) return;
    if (f.size > 5*1024*1024) return toast('Image must be under 5MB');
    const r = new FileReader(); r.onload = () => { user.avatar = r.result; persist(); paintAvatar(); }; r.readAsDataURL(f);
  });
  $('#urlAvatar').addEventListener('click', () => {
    const u = prompt('Paste image URL'); if (u) { user.avatar = u; persist(); paintAvatar(); }
  });
  $('#clearAvatar').addEventListener('click', () => { user.avatar = ''; persist(); paintAvatar(); });

  $('#profileForm').addEventListener('submit', (e) => {
    e.preventDefault(); const fd = new FormData(e.target); const d = Object.fromEntries(fd);
    Object.assign(user, { name: d.name, bio: d.bio, role: d.role, region: d.region, age: +d.age, gender: d.gender });
    persist(); toast('Profile saved'); setTimeout(() => location.href = '/index.html', 800);
  });
  $('#logoutBtn').addEventListener('click', () => { if (confirm('Log out?')) { localStorage.removeItem(LS.user); location.href = '/index.html'; } });

  $$('.modal-overlay').forEach(o => o.addEventListener('click', (e) => { if (e.target === o || e.target.matches('[data-close]')) o.classList.remove('open'); }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.modal-overlay.open').forEach(o => o.classList.remove('open')); });
}

function wireAuth() {
  $$('[data-auth]').forEach(t => t.addEventListener('click', () => {
    $$('[data-auth]').forEach(x => x.classList.toggle('active', x === t));
    $('#loginForm').hidden = t.dataset.auth !== 'login';
    $('#signupForm').hidden = t.dataset.auth !== 'signup';
  }));
  $('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault(); const fd = new FormData(e.target);
    const u = users.find(x => x.email === fd.get('email') && x.password === fd.get('password'));
    if (!u) return toast('Wrong email or password');
    localStorage.setItem(LS.user, JSON.stringify(u)); location.reload();
  });
  $('#signupForm').addEventListener('submit', (e) => {
    e.preventDefault(); const fd = new FormData(e.target); const d = Object.fromEntries(fd);
    if (d.password !== d.confirm) return toast('Passwords don\'t match');
    if (users.some(x => x.email === d.email)) return toast('Email already registered');
    const nu = { id: uid(), name: d.name, email: d.email, password: d.password, role: d.role, region: d.region, age: +d.age, gender: d.gender, bio:'', avatar:'', connections:[], notifications:[], createdEvents:[], createdAt: Date.now() };
    users.push(nu); localStorage.setItem(LS.users, JSON.stringify(users));
    localStorage.setItem(LS.user, JSON.stringify(nu)); location.reload();
  });
}

if (!user) { showAuth(); wireAuth(); } else { showProfile(); wireProfile(); }
