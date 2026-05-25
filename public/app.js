'use strict';

/* ============================================================
   EventHub — Main feed / auth / modals
   ============================================================ */

const LS = {
  user: 'eventhub_user',
  users: 'eventhub_users',
  events: 'eventhub_events',
  state: 'eventhub_state',
  comments: 'eventhub_comments',
  tickets: 'eventhub_tickets',
  theme: 'eventhub_theme',
};

const PALETTE = ['#FF3A5C', '#FF6A35', '#7B3FFF', '#00CDA8', '#F59E0B', '#3B82F6', '#EC4899', '#10B981'];
const CATS = ['All', 'Music', 'Sports', 'Tech', 'Art', 'Business', 'Gaming', 'Festival', 'Lifestyle'];

/* ---------- Seed data ---------- */
const SEED_USERS = [
  { id: 'u1', name: 'Nomvula Dlamini', email: 'nomvula@demo.za', password: 'demo123', role: 'organizer', region: 'Johannesburg', age: 28, gender: 'Female', bio: 'Music & festival curator. Soweto born.', avatar: '', connections: ['u2','u3'], notifications: [], createdEvents: [], createdAt: Date.now() - 9e8 },
  { id: 'u2', name: 'Sipho Mokoena', email: 'sipho@demo.za', password: 'demo123', role: 'organizer', region: 'Cape Town', age: 34, gender: 'Male', bio: 'Tech meetups. Capetonian. Surfer.', avatar: '', connections: ['u1'], notifications: [], createdEvents: [], createdAt: Date.now() - 8e8 },
  { id: 'u3', name: 'Aisha Patel', email: 'aisha@demo.za', password: 'demo123', role: 'attendee', region: 'Durban', age: 24, gender: 'Female', bio: 'Always at the next art opening.', avatar: '', connections: ['u1'], notifications: [], createdEvents: [], createdAt: Date.now() - 7e8 },
  { id: 'u4', name: 'Themba Khumalo', email: 'themba@demo.za', password: 'demo123', role: 'organizer', region: 'Pretoria', age: 31, gender: 'Male', bio: 'Sports & lifestyle events.', avatar: '', connections: [], notifications: [], createdEvents: [], createdAt: Date.now() - 6e8 },
];

function makeAttendees(count) {
  const names = ['Lerato','Bongani','Zinhle','Tebogo','Kagiso','Mpho','Naledi','Sibusiso','Palesa','Andile','Refilwe','Kabelo','Lindiwe','Tumi','Nandi'];
  const genders = ['Female','Male','Non-binary'];
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({ name: names[i % names.length], age: 18 + Math.floor(Math.random()*30), gender: genders[Math.floor(Math.random()*genders.length)] });
  }
  return arr;
}

const SEED_EVENTS = [
  {
    id: 'e1', title: 'Afropunk Joburg 2026', organizer: 'Nomvula Dlamini', orgInitials: 'ND', orgColor: '#FF3A5C',
    cat: 'Festival', date: 'Dec 28, 2026', location: 'Constitution Hill, Johannesburg',
    going: 2840, interested: 1320, comments: 142, price: 'R 850',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80','https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80','https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80'],
    caption: 'Three days, four stages, and every shade of Black creative expression. Afropunk lands in Joburg with the boldest lineup yet — expect a riot of sound, fashion, and freedom.',
    desc: 'Afropunk is more than a festival — it\'s a movement celebrating Black culture in all its rebellious, beautiful, and unapologetic forms. Three stages of headliners, an art village, a vintage clothing market, and the legendary Spinthrift Market. Food trucks from every corner of Africa.',
    posted: Date.now() - 1000*60*60*2, attendees: makeAttendees(40), createdBy: 'u1', createdAt: Date.now() - 1000*60*60*24*5,
  },
  {
    id: 'e2', title: 'DevConf Cape Town', organizer: 'Sipho Mokoena', orgInitials: 'SM', orgColor: '#7B3FFF',
    cat: 'Tech', date: 'Aug 14, 2026', location: 'CTICC, Cape Town',
    going: 1240, interested: 890, comments: 67, price: 'R 1,950',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80','https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80'],
    caption: 'SA\'s biggest developer gathering. Two days, 60+ talks, espresso on tap.',
    desc: 'DevConf brings together engineers from across Africa for two days of deep technical talks on AI, distributed systems, frontend architecture, and platform engineering. Includes hands-on workshops and a hiring expo.',
    posted: Date.now() - 1000*60*60*8, attendees: makeAttendees(35), createdBy: 'u2', createdAt: Date.now() - 1000*60*60*24*10,
  },
  {
    id: 'e3', title: 'Sho Madjozi Live at Kirstenbosch', organizer: 'Nomvula Dlamini', orgInitials: 'ND', orgColor: '#FF3A5C',
    cat: 'Music', date: 'Nov 22, 2026', location: 'Kirstenbosch Gardens, Cape Town',
    going: 4120, interested: 2870, comments: 312, price: 'R 650',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80','https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&q=80'],
    caption: 'Sunset show under the mountain. Bring a blanket and a friend.',
    desc: 'The Kirstenbosch Summer Sunset Concerts return with Sho Madjozi headlining. Gates open at 4pm, support acts from 5pm.',
    posted: Date.now() - 1000*60*60*24, attendees: makeAttendees(45), createdBy: 'u1', createdAt: Date.now() - 1000*60*60*24*15,
  },
  {
    id: 'e4', title: 'Springboks vs All Blacks', organizer: 'Themba Khumalo', orgInitials: 'TK', orgColor: '#00CDA8',
    cat: 'Sports', date: 'Sep 5, 2026', location: 'Loftus Versfeld, Pretoria',
    going: 5230, interested: 1890, comments: 421, price: 'R 1,200',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80'],
    caption: 'The classic. Bok country at Loftus. Don\'t miss it.',
    desc: 'The Rugby Championship reaches its peak as the world champion Springboks defend home turf against the All Blacks at Loftus.',
    posted: Date.now() - 1000*60*60*36, attendees: makeAttendees(50), createdBy: 'u4', createdAt: Date.now() - 1000*60*60*24*20,
  },
  {
    id: 'e5', title: 'First Thursdays Art Walk', organizer: 'Aisha Patel', orgInitials: 'AP', orgColor: '#EC4899',
    cat: 'Art', date: 'Aug 7, 2026', location: 'Bree Street, Cape Town',
    going: 890, interested: 1240, comments: 56, price: 'Free',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&q=80','https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=1200&q=80'],
    caption: 'Galleries open late. Wine flows. Streets buzz.',
    desc: 'Every first Thursday, the Cape Town art scene opens its doors after hours. Walk between 20+ galleries on and around Bree Street.',
    posted: Date.now() - 1000*60*60*48, attendees: makeAttendees(30), createdBy: 'u3', createdAt: Date.now() - 1000*60*60*24*25,
  },
  {
    id: 'e6', title: 'Comic Con Africa', organizer: 'Themba Khumalo', orgInitials: 'TK', orgColor: '#00CDA8',
    cat: 'Gaming', date: 'Sep 18–20, 2026', location: 'Johannesburg Expo Centre',
    going: 3450, interested: 2120, comments: 187, price: 'R 320',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80','https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80','https://images.unsplash.com/photo-1556438064-2d7646166914?w=1200&q=80'],
    caption: 'Cosplay, gaming, anime, esports tournaments — three days of geek nirvana.',
    desc: 'Africa\'s largest pop culture event. Meet creators, compete in esports tournaments, queue for celeb panels, shop the artist alley.',
    posted: Date.now() - 1000*60*60*72, attendees: makeAttendees(42), createdBy: 'u4', createdAt: Date.now() - 1000*60*60*24*30,
  },
  {
    id: 'e7', title: 'SA Startup Summit', organizer: 'Sipho Mokoena', orgInitials: 'SM', orgColor: '#7B3FFF',
    cat: 'Business', date: 'Oct 10, 2026', location: 'Sandton Convention Centre',
    going: 780, interested: 540, comments: 38, price: 'R 2,800',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80'],
    caption: 'Where SA\'s next unicorns get funded.',
    desc: 'Founders, VCs and operators converge for one day of frank talks, pitch sessions, and dealmaking.',
    posted: Date.now() - 1000*60*60*96, attendees: makeAttendees(28), createdBy: 'u2', createdAt: Date.now() - 1000*60*60*24*40,
  },
  {
    id: 'e8', title: 'Sunday Sundowner Yoga', organizer: 'Aisha Patel', orgInitials: 'AP', orgColor: '#EC4899',
    cat: 'Lifestyle', date: 'Every Sunday', location: 'Sea Point Promenade, Cape Town',
    going: 240, interested: 410, comments: 22, price: 'R 80',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80'],
    caption: 'Stretch into the week. Ocean view. All levels.',
    desc: 'A weekly outdoor flow on the promenade led by certified instructors. Mats provided.',
    posted: Date.now() - 1000*60*60*120, attendees: makeAttendees(20), createdBy: 'u3', createdAt: Date.now() - 1000*60*60*24*50,
  },
];

const EXTRA_EVENTS = [
  { id: 'e9', title: 'Knysna Oyster Festival', organizer: 'Themba Khumalo', orgInitials: 'TK', orgColor: '#00CDA8', cat: 'Festival', date: 'Jul 4–13, 2026', location: 'Knysna, Western Cape', going: 1620, interested: 980, comments: 78, price: 'R 450', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80', images:['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80'], caption: 'Ten days of oysters, marathons, and waterfront fun.', desc: 'A South African summer classic since 1983.', posted: Date.now() - 1000*60*60*150, attendees: makeAttendees(20), createdBy: 'u4', createdAt: Date.now() },
  { id: 'e10', title: 'AfricaCon Game Jam', organizer: 'Sipho Mokoena', orgInitials: 'SM', orgColor: '#7B3FFF', cat: 'Gaming', date: 'Aug 30, 2026', location: 'University of Cape Town', going: 320, interested: 410, comments: 24, price: 'R 150', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&q=80', images:['https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&q=80'], caption: '48 hours. One theme. Build something weird.', desc: 'A weekend game jam open to all skill levels.', posted: Date.now() - 1000*60*60*180, attendees: makeAttendees(18), createdBy: 'u2', createdAt: Date.now() },
];

/* ---------- State ---------- */
let state = {
  user: null,
  users: [],
  events: [],
  comments: [],
  tickets: [],
  app: { saved: [], rsvp: {}, orgFollowing: [], extraLoaded: false },
  activeTab: 'foryou',
  activeCat: 'All',
  search: '',
  sort: 'recent',
};

function load() {
  state.user = JSON.parse(localStorage.getItem(LS.user) || 'null');
  let users = JSON.parse(localStorage.getItem(LS.users) || 'null');
  if (!users) { users = SEED_USERS.slice(); localStorage.setItem(LS.users, JSON.stringify(users)); }
  state.users = users;
  let events = JSON.parse(localStorage.getItem(LS.events) || 'null');
  if (!events) { events = SEED_EVENTS.slice(); localStorage.setItem(LS.events, JSON.stringify(events)); }
  state.events = events;
  state.comments = JSON.parse(localStorage.getItem(LS.comments) || '[]');
  state.tickets = JSON.parse(localStorage.getItem(LS.tickets) || '[]');
  state.app = JSON.parse(localStorage.getItem(LS.state) || 'null') || { saved: [], rsvp: {}, orgFollowing: [], extraLoaded: false };
  // theme
  const t = localStorage.getItem(LS.theme) || 'dark';
  if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
}
function saveAppState() {
  localStorage.setItem(LS.events, JSON.stringify(state.events));
  localStorage.setItem(LS.users, JSON.stringify(state.users));
  localStorage.setItem(LS.comments, JSON.stringify(state.comments));
  localStorage.setItem(LS.tickets, JSON.stringify(state.tickets));
  localStorage.setItem(LS.state, JSON.stringify(state.app));
  if (state.user) localStorage.setItem(LS.user, JSON.stringify(state.user));
}

/* ---------- Utils ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function uid() { return Math.random().toString(36).slice(2, 10); }
function bookingRef() { return Array.from({length:8}, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*32)]).join(''); }
function colorFor(seed) { let h = 0; for (const c of String(seed||'')) h = (h*31 + c.charCodeAt(0)) >>> 0; return PALETTE[h % PALETTE.length]; }
function initials(name) { return String(name||'?').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase(); }
function timeAgo(ts) {
  const d = Math.max(1, Date.now() - ts);
  const m = Math.floor(d / 60000); if (m < 1) return 'just now';
  if (m < 60) return `${m} minute${m>1?'s':''} ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h} hour${h>1?'s':''} ago`;
  const dd = Math.floor(h / 24); if (dd < 30) return `${dd} day${dd>1?'s':''} ago`;
  return new Date(ts).toLocaleDateString();
}
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2600);
}
function avatarHTML(name, color, size) {
  const c = color || colorFor(name);
  const s = size ? `width:${size}px;height:${size}px;font-size:${Math.max(10, size*0.36)}px;` : '';
  return `<div class="av" style="background:${c};${s}">${esc(initials(name))}</div>`;
}

/* ---------- Notifications ---------- */
function pushNotif(type, message, eventId) {
  if (!state.user) return;
  const n = { id: uid(), type, message, eventId, timestamp: Date.now(), read: false };
  state.user.notifications = state.user.notifications || [];
  state.user.notifications.unshift(n);
  const u = state.users.find(x => x.id === state.user.id); if (u) u.notifications = state.user.notifications;
  saveAppState(); updateNotifBadge();
}
function updateNotifBadge() {
  const badge = $('#notifBadge');
  const count = (state.user?.notifications || []).filter(n => !n.read).length;
  if (count > 0) { badge.textContent = count; badge.hidden = false; } else badge.hidden = true;
}
function updateSavedBadge() {
  const badge = $('#savedBadge');
  const c = state.app.saved.length;
  if (c > 0) { badge.textContent = c; badge.hidden = false; } else badge.hidden = true;
}

/* ---------- Filtering / sorting ---------- */
function visibleEvents() {
  let list = state.events.slice();
  if (state.activeTab === 'following') {
    const conns = (state.user?.connections) || [];
    list = list.filter(e => conns.includes(e.createdBy));
  } else if (state.activeTab === 'nearby') {
    const r = (state.user?.region || '').toLowerCase();
    list = r ? list.filter(e => (e.location||'').toLowerCase().includes(r)) : [];
  }
  if (state.activeCat !== 'All') list = list.filter(e => e.cat === state.activeCat);
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(e => [e.title, e.organizer, e.location, e.cat].some(v => (v||'').toLowerCase().includes(q)));
  }
  if (state.sort === 'popular') list.sort((a,b) => b.going - a.going);
  else if (state.sort === 'upcoming') list.sort((a,b) => new Date(a.date) - new Date(b.date));
  else list.sort((a,b) => b.posted - a.posted);
  // region first for foryou
  if (state.activeTab === 'foryou' && state.user?.region && state.sort === 'recent') {
    const r = state.user.region.toLowerCase();
    list.sort((a,b) => {
      const aM = (a.location||'').toLowerCase().includes(r) ? 0 : 1;
      const bM = (b.location||'').toLowerCase().includes(r) ? 0 : 1;
      return aM - bM;
    });
  }
  return list;
}

/* ---------- Render: sidebar ---------- */
function renderSidebar() {
  $('#catList').innerHTML = CATS.map(c => `<button class="cat-chip ${c===state.activeCat?'active':''}" data-cat="${c}">${c}</button>`).join('');
  $$('#catList .cat-chip').forEach(b => b.addEventListener('click', () => { state.activeCat = b.dataset.cat; renderSidebar(); buildFeed(); }));

  const trending = state.events.slice().sort((a,b) => b.going - a.going).slice(0,3);
  $('#trendingList').innerHTML = trending.map(e => `
    <div class="mini-event" data-event="${e.id}">
      <img src="${e.image}" alt="${esc(e.title)}">
      <div class="mini-event-info"><h5>${esc(e.title)}</h5><p>${esc(e.date)} · ${e.going.toLocaleString()} going</p></div>
    </div>`).join('');
  $$('#trendingList .mini-event').forEach(el => el.addEventListener('click', () => openEventModal(el.dataset.event)));

  const orgs = SEED_USERS.filter(u => u.role === 'organizer');
  $('#orgList').innerHTML = orgs.map(o => {
    const following = state.app.orgFollowing.includes(o.id);
    return `<div class="org-row">${avatarHTML(o.name, colorFor(o.id), 34)}<div class="name">${esc(o.name)}</div><button class="${following?'following':''}" data-org="${o.id}">${following?'Following':'Follow'}</button></div>`;
  }).join('');
  $$('#orgList button').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.org;
    const i = state.app.orgFollowing.indexOf(id);
    if (i >= 0) state.app.orgFollowing.splice(i,1); else state.app.orgFollowing.push(id);
    if (state.user) {
      state.user.connections = state.user.connections || [];
      const ci = state.user.connections.indexOf(id);
      if (ci >= 0) state.user.connections.splice(ci,1); else state.user.connections.push(id);
    }
    saveAppState(); renderSidebar(); if (state.activeTab === 'following') buildFeed();
  }));
}

/* ---------- Render: right panel ---------- */
function renderRightPanel() {
  const picks = state.events.slice().sort((a,b) => b.interested - a.interested).slice(0,3);
  $('#picksList').innerHTML = picks.map(rpCard).join('');
  const r = (state.user?.region || 'Cape Town').toLowerCase();
  const near = state.events.filter(e => (e.location||'').toLowerCase().includes(r)).slice(0,3);
  $('#nearbyList').innerHTML = near.length ? near.map(rpCard).join('') : '<p style="font-size:12px;color:var(--text-d);padding:8px;">Nothing nearby yet.</p>';
  $$('.rp-card').forEach(el => el.addEventListener('click', () => openEventModal(el.dataset.event)));
}
function rpCard(e) {
  return `<div class="rp-card" data-event="${e.id}"><img src="${e.image}" alt=""><div class="info"><h5>${esc(e.title)}</h5><p>${esc(e.date)} · ${esc(e.location.split(',')[0])}</p></div></div>`;
}

/* ---------- Render: hero ---------- */
function renderHero() {
  const featured = state.events.slice().sort((a,b) => b.going - a.going)[0];
  if (!featured) { $('#hero').innerHTML = ''; return; }
  const collage = state.events.slice(0,3).map(e => `<img src="${e.image}" alt="">`).join('');
  $('#hero').innerHTML = `
    <div class="hero-bg" style="background-image:url('${featured.image}')"></div>
    <div class="hero-collage">${collage}</div>
    <div class="hero-content">
      <span class="tag">⭐ Featured</span>
      <h1>${esc(featured.title)}</h1>
      <div class="meta"><span>📅 ${esc(featured.date)}</span><span>📍 ${esc(featured.location)}</span><span>👥 ${featured.going.toLocaleString()} going</span></div>
      <div class="actions"><button class="btn-primary" data-hero-tix="${featured.id}">Get Tickets</button><button class="btn-glass" data-hero-save="${featured.id}">🔖 ${state.app.saved.includes(featured.id)?'Saved':'Save'}</button></div>
    </div>`;
  $('[data-hero-tix]')?.addEventListener('click', () => openTicketModal(featured.id));
  $('[data-hero-save]')?.addEventListener('click', () => { toggleSave(featured.id); renderHero(); });
}

/* ---------- Render: feed ---------- */
function buildFeed() {
  const list = visibleEvents();
  $('#feedCount').textContent = `${list.length} event${list.length===1?'':'s'}`;
  const feed = $('#feed');
  if (list.length === 0) {
    feed.innerHTML = `<div class="card empty"><div class="ico">📭</div><h4>No events here yet</h4><p>${state.activeTab==='following'?'Connect with organizers to see their events.':'Try a different category or search.'}</p></div>`;
    return;
  }
  feed.innerHTML = list.map(renderPost).join('');
  list.forEach(e => wirePost(e.id));
}

function renderPost(e) {
  const saved = state.app.saved.includes(e.id);
  const rsvp = state.app.rsvp[e.id];
  const captionShort = e.caption && e.caption.length > 110;
  const cap = captionShort ? `<span data-cap-short>${esc(e.caption.slice(0,110))}…</span><span data-cap-full hidden>${esc(e.caption)}</span> <span class="more-toggle" data-toggle-cap="${e.id}">more</span>` : esc(e.caption||'');
  const imgs = (e.images && e.images.length) ? e.images : [e.image];
  const attendeeStack = (e.attendees||[]).slice(0,4).map(a => avatarHTML(a.name, colorFor(a.name), 24)).join('');
  return `<article class="card post" data-post="${e.id}">
    <div class="post-head">
      ${avatarHTML(e.organizer, e.orgColor, 40)}
      <div class="meta"><h4>${esc(e.organizer)}</h4><p>${timeAgo(e.posted)} · 📍 ${esc(e.location.split(',')[0])}</p></div>
      <div class="dropdown"><button class="more" data-more="${e.id}">⋯</button><div class="dropdown-menu" data-menu="${e.id}"></div></div>
    </div>
    <div class="post-img-wrap" data-carousel="${e.id}" data-idx="0">
      <img src="${imgs[0]}" alt="${esc(e.title)}" data-open="${e.id}">
      ${imgs.length>1 ? `<button class="carousel-arrow prev" data-prev="${e.id}">‹</button><button class="carousel-arrow next" data-next="${e.id}">›</button><div class="carousel-count">1/${imgs.length}</div>` : ''}
      <div class="img-actions">
        <button class="${saved?'saved':''}" data-save="${e.id}" title="Save">🔖</button>
        <button data-download="${e.id}" title="Download flyer">⬇</button>
      </div>
    </div>
    <div class="post-body">
      <div class="post-date-loc"><span>📅 ${esc(e.date)}</span><span>📍 ${esc(e.location)}</span></div>
      <h3 class="post-title" data-open="${e.id}">${esc(e.title)}</h3>
      <p class="post-caption">${cap}</p>
    </div>
    <div class="rsvp-row">
      <button class="rsvp-btn ${rsvp==='going'?'active going':''}" data-rsvp="${e.id}" data-kind="going">✓ Going</button>
      <button class="rsvp-btn ${rsvp==='interested'?'active interested':''}" data-rsvp="${e.id}" data-kind="interested">★ Interested</button>
    </div>
    <div class="attendee-row">
      <div class="av-stack">${attendeeStack}</div>
      <span><strong>${e.going.toLocaleString()}</strong> going · ${e.interested.toLocaleString()} interested</span>
    </div>
    <div class="post-foot">
      <button class="foot-btn" data-comments="${e.id}">💬 ${commentCount(e.id)}</button>
      <button class="foot-btn" data-share="${e.id}">↗ Share</button>
      <span class="price-badge">${esc(e.price)}</span>
    </div>
    <div class="comments" data-comments-box="${e.id}" hidden></div>
  </article>`;
}

function commentCount(eid) { return state.comments.filter(c => c.eventId === eid).length + (state.events.find(e=>e.id===eid)?.comments || 0); }

function wirePost(eid) {
  const post = $(`[data-post="${eid}"]`); if (!post) return;
  const e = state.events.find(x => x.id === eid);
  const imgs = (e.images && e.images.length) ? e.images : [e.image];

  post.querySelectorAll('[data-open]').forEach(el => el.addEventListener('click', () => openEventModal(eid)));
  post.querySelector(`[data-save="${eid}"]`)?.addEventListener('click', (ev) => { ev.stopPropagation(); toggleSave(eid); buildFeed(); });
  post.querySelector(`[data-download="${eid}"]`)?.addEventListener('click', (ev) => { ev.stopPropagation(); downloadFlyer(e); });
  post.querySelectorAll('[data-rsvp]').forEach(b => b.addEventListener('click', () => toggleRsvp(eid, b.dataset.kind)));
  post.querySelector(`[data-comments="${eid}"]`)?.addEventListener('click', () => toggleComments(eid));
  post.querySelector(`[data-share="${eid}"]`)?.addEventListener('click', () => { navigator.clipboard?.writeText(location.origin + '/index.html#' + eid); toast('Link copied'); });

  const carousel = post.querySelector(`[data-carousel="${eid}"]`);
  const move = (delta) => {
    let idx = (+carousel.dataset.idx + delta + imgs.length) % imgs.length;
    carousel.dataset.idx = idx;
    carousel.querySelector('img').src = imgs[idx];
    const cnt = carousel.querySelector('.carousel-count'); if (cnt) cnt.textContent = `${idx+1}/${imgs.length}`;
  };
  post.querySelector(`[data-prev="${eid}"]`)?.addEventListener('click', (ev) => { ev.stopPropagation(); move(-1); });
  post.querySelector(`[data-next="${eid}"]`)?.addEventListener('click', (ev) => { ev.stopPropagation(); move(1); });

  // caption toggle
  post.querySelector(`[data-toggle-cap="${eid}"]`)?.addEventListener('click', (ev) => {
    const short = post.querySelector('[data-cap-short]'); const full = post.querySelector('[data-cap-full]');
    if (short.hidden) { short.hidden=false; full.hidden=true; ev.target.textContent='more'; }
    else { short.hidden=true; full.hidden=false; ev.target.textContent='less'; }
  });

  // ⋯ menu
  const moreBtn = post.querySelector(`[data-more="${eid}"]`);
  const menu = post.querySelector(`[data-menu="${eid}"]`);
  const isOwn = state.user && e.createdBy === state.user.id;
  menu.innerHTML = isOwn
    ? `<a class="dropdown-item" href="/create.html?edit=${eid}">✏ Edit</a><button class="dropdown-item" data-act="attendees">👥 View attendees</button><button class="dropdown-item danger" data-act="delete">🗑 Delete</button>`
    : `<button class="dropdown-item" data-act="copy">🔗 Copy link</button><button class="dropdown-item" data-act="report">🚩 Report</button><a class="dropdown-item" href="/messages.html?share=${eid}">↗ Share to messages</a>`;
  moreBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    $$('.dropdown-menu.open').forEach(m => { if (m !== menu) m.classList.remove('open'); });
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', (ev) => {
    ev.stopPropagation(); menu.classList.remove('open');
    const a = b.dataset.act;
    if (a === 'delete') { if (confirm('Delete this event?')) { state.events = state.events.filter(x => x.id !== eid); saveAppState(); buildFeed(); renderHero(); toast('Event deleted'); } }
    else if (a === 'attendees') { openAttendeesModal(e); }
    else if (a === 'copy') { navigator.clipboard?.writeText(location.origin + '/index.html#' + eid); toast('Link copied'); }
    else if (a === 'report') { toast('Reported — thanks'); }
  }));
}

function toggleSave(eid) {
  const i = state.app.saved.indexOf(eid);
  if (i >= 0) { state.app.saved.splice(i,1); toast('Removed from saved'); }
  else { state.app.saved.push(eid); pushNotif('save', `You saved "${state.events.find(e=>e.id===eid)?.title}"`, eid); toast('Saved'); }
  saveAppState(); updateSavedBadge();
}
function toggleRsvp(eid, kind) {
  if (!state.user) return openAuth();
  const e = state.events.find(x => x.id === eid); if (!e) return;
  const cur = state.app.rsvp[eid];
  if (cur === kind) { delete state.app.rsvp[eid]; if (kind==='going') e.going=Math.max(0,e.going-1); else e.interested=Math.max(0,e.interested-1); }
  else {
    if (cur === 'going') e.going=Math.max(0,e.going-1);
    if (cur === 'interested') e.interested=Math.max(0,e.interested-1);
    state.app.rsvp[eid] = kind;
    if (kind === 'going') e.going++; else e.interested++;
    pushNotif('rsvp', `You're ${kind} to "${e.title}"`, eid);
  }
  saveAppState(); buildFeed();
}
function downloadFlyer(e) {
  const a = document.createElement('a'); a.href = e.image; a.download = `${e.title.replace(/\W+/g,'-')}.jpg`; a.target = '_blank'; a.click();
  toast('Flyer download started');
}

/* ---------- Comments ---------- */
function toggleComments(eid) {
  const box = $(`[data-comments-box="${eid}"]`);
  box.hidden = !box.hidden;
  if (!box.hidden) renderComments(eid);
}
function renderComments(eid) {
  const box = $(`[data-comments-box="${eid}"]`);
  const all = state.comments.filter(c => c.eventId === eid).slice().sort((a,b) => b.timestamp - a.timestamp);
  const showAllKey = `_showAll_${eid}`;
  const showAll = box.dataset.showall === '1';
  const list = showAll ? all : all.slice(0, 3);
  const remaining = all.length - list.length;
  box.innerHTML = `
    ${remaining > 0 ? `<div class="comment-show-all" data-show-all="${eid}">View all ${all.length} comments</div>` : ''}
    ${list.map(c => `
      <div class="comment">
        ${avatarHTML(c.userName, colorFor(c.userId), 30)}
        <div class="comment-body">
          ${state.user && state.user.id === c.userId ? `<button class="del" data-del-comment="${c.id}">delete</button>` : ''}
          <span class="name">${esc(c.userName)}</span>${esc(c.text)}
          <span class="ts">${timeAgo(c.timestamp)}</span>
        </div>
      </div>`).join('') || '<p style="font-size:13px;color:var(--text-d);margin-bottom:8px;">Be the first to comment.</p>'}
    ${state.user
      ? `<div class="comment-form"><textarea data-comment-input="${eid}" placeholder="Add a comment…"></textarea><button class="btn-primary" data-comment-post="${eid}">Post</button></div>`
      : `<div style="text-align:center;padding:8px;font-size:13px;color:var(--text-s);"><a href="#" data-open-auth style="color:var(--accent);">Sign in</a> to comment.</div>`}
  `;
  box.querySelector(`[data-show-all="${eid}"]`)?.addEventListener('click', () => { box.dataset.showall = '1'; renderComments(eid); });
  box.querySelector(`[data-comment-post="${eid}"]`)?.addEventListener('click', () => {
    const ta = box.querySelector(`[data-comment-input="${eid}"]`);
    const text = ta.value.trim(); if (!text) return;
    state.comments.push({ id: uid(), eventId: eid, userId: state.user.id, userName: state.user.name, userAvatar: state.user.avatar, text, timestamp: Date.now() });
    saveAppState(); pushNotif('comment', `You commented on "${state.events.find(e=>e.id===eid)?.title}"`, eid);
    // update count
    const btn = $(`[data-comments="${eid}"]`); if (btn) btn.innerHTML = `💬 ${commentCount(eid)}`;
    ta.value = ''; renderComments(eid);
  });
  box.querySelectorAll('[data-del-comment]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.delComment; state.comments = state.comments.filter(c => c.id !== id); saveAppState(); renderComments(eid);
    const btn = $(`[data-comments="${eid}"]`); if (btn) btn.innerHTML = `💬 ${commentCount(eid)}`;
  }));
  box.querySelector('[data-open-auth]')?.addEventListener('click', (ev) => { ev.preventDefault(); openAuth(); });
}

/* ---------- Event detail modal ---------- */
function openEventModal(eid) {
  const e = state.events.find(x => x.id === eid); if (!e) return;
  const imgs = (e.images && e.images.length) ? e.images : [e.image];
  const att = e.attendees || [];
  const genderCounts = att.reduce((m,a) => (m[a.gender]=(m[a.gender]||0)+1, m), {});
  const ageBuckets = { '18-24':0,'25-34':0,'35-44':0,'45+':0 };
  att.forEach(a => { if(a.age<25)ageBuckets['18-24']++; else if(a.age<35)ageBuckets['25-34']++; else if(a.age<45)ageBuckets['35-44']++; else ageBuckets['45+']++; });
  const total = att.length || 1;
  const rsvp = state.app.rsvp[eid];

  $('#eventModalContent').innerHTML = `
    <div class="modal-head"><h2>${esc(e.title)}</h2><button class="close" data-close>✕</button></div>
    <div class="post-img-wrap" data-mod-carousel data-idx="0" style="aspect-ratio:16/9;max-height:380px;">
      <img src="${imgs[0]}" alt="">
      ${imgs.length>1?`<button class="carousel-arrow prev" data-mod-prev>‹</button><button class="carousel-arrow next" data-mod-next>›</button><div class="carousel-count">1/${imgs.length}</div>`:''}
    </div>
    <div class="modal-body">
      <p style="color:var(--text-s);font-size:13px;margin-bottom:6px;">by ${esc(e.organizer)} · <span style="background:var(--surface);padding:2px 8px;border-radius:999px;font-size:11px;">${esc(e.cat)}</span></p>
      <div class="detail-stats">
        <div><strong>${e.going.toLocaleString()}</strong>Going</div>
        <div><strong>${e.interested.toLocaleString()}</strong>Interested</div>
        <div><strong>${commentCount(eid)}</strong>Comments</div>
      </div>
      <div class="info-grid">
        <div class="info-cell"><label>Date</label><p>${esc(e.date)}</p></div>
        <div class="info-cell"><label>Location</label><p>${esc(e.location)}</p></div>
        <div class="info-cell"><label>Price</label><p>${esc(e.price)}</p></div>
        <div class="info-cell"><label>Category</label><p>${esc(e.cat)}</p></div>
      </div>
      <div class="section-card" style="margin:0 0 16px;padding:14px;">
        <div class="side-title" style="margin-bottom:8px;">Attendee mix</div>
        ${Object.entries(genderCounts).map(([k,v]) => `<div><div class="demo-row"><span>${esc(k)}</span><span>${Math.round(v/total*100)}%</span></div><div class="demo-bars"><div><span style="width:${v/total*100}%"></span></div></div></div>`).join('')}
        <div style="margin-top:10px;">
          ${Object.entries(ageBuckets).map(([k,v]) => `<div><div class="demo-row"><span>${k}</span><span>${Math.round(v/total*100)}%</span></div><div class="demo-bars"><div><span style="width:${v/total*100}%;background:linear-gradient(135deg,var(--accent3),var(--accent4));"></span></div></div></div>`).join('')}
        </div>
      </div>
      <h4 style="font-family:'DM Sans';font-size:14px;margin-bottom:8px;">About this event</h4>
      <p style="font-size:14px;color:var(--text-s);line-height:1.6;">${esc(e.desc || e.caption)}</p>
    </div>
    <div class="modal-foot">
      <button class="btn-glass" data-mod-rsvp="going">${rsvp==='going'?'✓ Going':'Going'}</button>
      <button class="btn-glass" data-mod-rsvp="interested">${rsvp==='interested'?'★ Interested':'Interested'}</button>
      <button class="btn-glass" data-mod-share>↗ Share</button>
      <button class="btn-primary" data-mod-tix>Get Tickets</button>
    </div>
  `;
  $('#eventModal').classList.add('open'); document.body.style.overflow = 'hidden';

  const mc = $('[data-mod-carousel]'); let idx = 0;
  const move = (d) => { idx = (idx + d + imgs.length) % imgs.length; mc.querySelector('img').src = imgs[idx]; const c = mc.querySelector('.carousel-count'); if (c) c.textContent = `${idx+1}/${imgs.length}`; };
  $('[data-mod-prev]')?.addEventListener('click', () => move(-1));
  $('[data-mod-next]')?.addEventListener('click', () => move(1));
  $$('[data-mod-rsvp]').forEach(b => b.addEventListener('click', () => { toggleRsvp(eid, b.dataset.modRsvp); closeEventModal(); }));
  $('[data-mod-share]')?.addEventListener('click', () => { navigator.clipboard?.writeText(location.origin + '/index.html#' + eid); toast('Link copied'); });
  $('[data-mod-tix]')?.addEventListener('click', () => { closeEventModal(); openTicketModal(eid); });
}
function closeEventModal() { $('#eventModal').classList.remove('open'); document.body.style.overflow = ''; }

function openAttendeesModal(e) {
  $('#eventModalContent').innerHTML = `
    <div class="modal-head"><h2>Attendees · ${e.going}</h2><button class="close" data-close>✕</button></div>
    <div class="modal-body">${(e.attendees||[]).map(a => `<div class="list-row">${avatarHTML(a.name, colorFor(a.name), 40)}<div class="info"><h5>${esc(a.name)}</h5><p>${a.age} · ${esc(a.gender)}</p></div></div>`).join('') || '<p>No attendees yet.</p>'}</div>`;
  $('#eventModal').classList.add('open'); document.body.style.overflow = 'hidden';
}

/* ---------- Ticket modal ---------- */
let ticketCtx = null;
function openTicketModal(eid) {
  if (!state.user) return openAuth();
  const e = state.events.find(x => x.id === eid); if (!e) return;
  ticketCtx = { eid, step: 0, type: 'general', qty: 1, name: state.user.name, email: state.user.email, asGuest: false };
  renderTicketStep();
  $('#ticketModal').classList.add('open'); document.body.style.overflow = 'hidden';
}
function priceOf(e, type) {
  const base = parseFloat((e.price || '').replace(/[^0-9.]/g,'')) || 0;
  return type === 'vip' ? base * 2.5 : base;
}
function renderTicketStep() {
  const { eid, step, type, qty, name, email, asGuest } = ticketCtx;
  const e = state.events.find(x => x.id === eid);
  const total = priceOf(e, type) * qty;
  const steps = `<div class="steps"><div class="step-pill ${step>=0?'active':''}"></div><div class="step-pill ${step>=1?'active':''}"></div><div class="step-pill ${step>=2?'active':''}"></div></div>`;
  let body = '';
  if (step === 0) {
    body = `
      <div class="ticket-option ${type==='general'?'selected':''}" data-type="general">
        <div class="info"><h4>General Admission</h4><p>Standard entry</p></div>
        <div class="price">R ${priceOf(e,'general').toFixed(0)}</div>
      </div>
      <div class="ticket-option ${type==='vip'?'selected':''}" data-type="vip">
        <div class="info"><h4>VIP</h4><p>Priority entry · lounge access</p></div>
        <div class="price">R ${priceOf(e,'vip').toFixed(0)}</div>
      </div>
      <div class="qty-row"><span>Quantity</span><div class="qty-ctrl"><button data-qty="-1">−</button><span>${qty}</span><button data-qty="1">+</button></div></div>
      <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid var(--border);font-weight:700;"><span>Total</span><span style="color:var(--accent);">R ${total.toFixed(2)}</span></div>`;
  } else if (step === 1) {
    body = `
      <div class="form-group"><label>Full name</label><input id="tixName" value="${esc(name)}" ${asGuest?'disabled':''}></div>
      <div class="form-group"><label>Email</label><input id="tixEmail" value="${esc(email)}" ${asGuest?'disabled':''}></div>
      <label style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--text-s);"><input type="checkbox" id="tixGuest" ${asGuest?'checked':''}> Attend as guest</label>
      <div style="margin-top:14px;background:var(--surface);padding:12px;border-radius:var(--r-sm);font-size:13px;"><strong>${esc(e.title)}</strong><br>${esc(e.date)} · ${esc(e.location)}<br>${qty} × ${type === 'vip' ? 'VIP' : 'General'} · <strong>R ${total.toFixed(2)}</strong></div>`;
  } else {
    const ref = ticketCtx.ref;
    body = `
      <div style="text-align:center;padding:20px 0;">
        <div style="font-size:48px;">🎟️</div>
        <h3 style="margin:10px 0;font-size:22px;">Booking confirmed</h3>
        <p style="color:var(--text-s);font-size:13px;">Your booking reference</p>
        <p style="font-family:monospace;font-size:24px;letter-spacing:.1em;margin-top:6px;color:var(--accent);">${ref}</p>
      </div>
      <div class="ticket-card">
        <h4>${esc(e.title)}</h4>
        <p style="font-size:12px;color:var(--text-s);">${esc(e.date)} · ${esc(e.location)}</p>
        <p style="font-size:13px;margin-top:6px;">${qty} × ${type==='vip'?'VIP':'General'} · <strong>R ${total.toFixed(2)}</strong></p>
        <p class="ref">REF · ${ref}</p>
      </div>`;
  }
  let foot = '';
  if (step === 0) foot = `<button class="btn-glass" data-close>Cancel</button><button class="btn-primary" data-tix-next>Continue</button>`;
  else if (step === 1) foot = `<button class="btn-glass" data-tix-back>Back</button><button class="btn-primary" data-tix-pay>Pay R ${total.toFixed(2)}</button>`;
  else foot = `<button class="btn-glass" data-tix-dl>Download ticket</button><button class="btn-primary" data-close>Done</button>`;

  $('#ticketModalContent').innerHTML = `
    <div class="modal-head"><h2>${step===2?'Confirmation':step===1?'Your details':'Select tickets'}</h2><button class="close" data-close>✕</button></div>
    <div class="modal-body">${steps}${body}</div>
    <div class="modal-foot">${foot}</div>`;

  $$('[data-type]').forEach(el => el.addEventListener('click', () => { ticketCtx.type = el.dataset.type; renderTicketStep(); }));
  $$('[data-qty]').forEach(b => b.addEventListener('click', () => { ticketCtx.qty = Math.max(1, Math.min(10, ticketCtx.qty + parseInt(b.dataset.qty,10))); renderTicketStep(); }));
  $('[data-tix-next]')?.addEventListener('click', () => { ticketCtx.step = 1; renderTicketStep(); });
  $('[data-tix-back]')?.addEventListener('click', () => { ticketCtx.step = 0; renderTicketStep(); });
  $('#tixGuest')?.addEventListener('change', (ev) => { ticketCtx.asGuest = ev.target.checked; if (ev.target.checked) { ticketCtx.name=''; ticketCtx.email=''; } else { ticketCtx.name = state.user.name; ticketCtx.email = state.user.email; } renderTicketStep(); });
  $('#tixName')?.addEventListener('input', (ev) => ticketCtx.name = ev.target.value);
  $('#tixEmail')?.addEventListener('input', (ev) => ticketCtx.email = ev.target.value);
  $('[data-tix-pay]')?.addEventListener('click', () => {
    const ref = bookingRef();
    ticketCtx.ref = ref;
    state.tickets.push({ id: uid(), eventId: eid, eventTitle: e.title, eventDate: e.date, eventLocation: e.location, userId: state.user.id, userName: ticketCtx.name || 'Guest', type: ticketCtx.type, quantity: ticketCtx.qty, totalPrice: total, bookingRef: ref, purchasedAt: Date.now() });
    saveAppState(); pushNotif('ticket', `Ticket confirmed for "${e.title}" — ${ref}`, eid);
    ticketCtx.step = 2; renderTicketStep(); updateNavAvatar();
  });
  $('[data-tix-dl]')?.addEventListener('click', () => {
    const txt = `EVENTHUB TICKET\n\n${e.title}\n${e.date}\n${e.location}\n\nName: ${ticketCtx.name || 'Guest'}\nType: ${ticketCtx.type.toUpperCase()}\nQuantity: ${ticketCtx.qty}\nTotal: R ${total.toFixed(2)}\nBooking Ref: ${ticketCtx.ref}\n\nPresent this at the entrance.`;
    const blob = new Blob([txt], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `ticket-${ticketCtx.ref}.txt`; a.click();
  });
}
function closeTicketModal() { $('#ticketModal').classList.remove('open'); document.body.style.overflow = ''; }

/* ---------- Drawers ---------- */
function openDrawer(key) {
  $(`#${key}Drawer`).classList.add('open');
  $(`#${key}Overlay`).classList.add('open');
  document.body.style.overflow = 'hidden';
  if (key === 'notif') renderNotifs();
  if (key === 'saved') renderSavedList();
}
function closeDrawer(key) {
  $(`#${key}Drawer`).classList.remove('open');
  $(`#${key}Overlay`).classList.remove('open');
  document.body.style.overflow = '';
}
function renderNotifs() {
  const list = $('#notifList');
  const ns = (state.user?.notifications) || [];
  if (!ns.length) { list.innerHTML = `<div class="empty"><div class="ico">🔔</div><h4>No notifications yet</h4><p>RSVPs, comments and tickets will appear here.</p></div>`; return; }
  const icons = { rsvp:'✓', save:'🔖', comment:'💬', connection:'👤', ticket:'🎟' };
  list.innerHTML = ns.map(n => `
    <div class="notif-item ${n.read?'':'unread'}" ${n.eventId?`data-event="${n.eventId}"`:''}>
      <div class="notif-icon">${icons[n.type]||'•'}</div>
      <div class="notif-body">${esc(n.message)}<div class="ts">${timeAgo(n.timestamp)}</div></div>
    </div>`).join('');
  list.querySelectorAll('[data-event]').forEach(el => el.addEventListener('click', () => { closeDrawer('notif'); openEventModal(el.dataset.event); }));
  // mark read
  ns.forEach(n => n.read = true);
  const u = state.users.find(x => x.id === state.user.id); if (u) u.notifications = ns;
  saveAppState(); updateNotifBadge();
}
function renderSavedList() {
  const list = $('#savedList');
  const items = state.app.saved.map(id => state.events.find(e => e.id === id)).filter(Boolean);
  if (!items.length) { list.innerHTML = `<div class="empty"><div class="ico">🔖</div><h4>Nothing saved yet</h4><p>Tap 🔖 on any event.</p></div>`; return; }
  list.innerHTML = items.map(e => `
    <div class="rp-card" data-event="${e.id}" style="position:relative;">
      <img src="${e.image}" alt="">
      <div class="info"><h5>${esc(e.title)}</h5><p>${esc(e.date)} · ${esc(e.price)}</p></div>
      <button class="icon-btn" data-unsave="${e.id}" title="Unsave" style="width:32px;height:32px;">✕</button>
    </div>`).join('');
  list.querySelectorAll('.rp-card').forEach(el => el.addEventListener('click', (ev) => { if (ev.target.closest('[data-unsave]')) return; closeDrawer('saved'); openEventModal(el.dataset.event); }));
  list.querySelectorAll('[data-unsave]').forEach(b => b.addEventListener('click', (ev) => { ev.stopPropagation(); toggleSave(b.dataset.unsave); renderSavedList(); }));
}

/* ---------- Auth ---------- */
function openAuth() { $('#authModal').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeAuth() { $('#authModal').classList.remove('open'); document.body.style.overflow = ''; }
function updateNavAvatar() {
  const a = $('#navAvatar');
  if (state.user) {
    if (state.user.avatar) a.innerHTML = `<img src="${state.user.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    else { a.textContent = initials(state.user.name); a.style.background = colorFor(state.user.id); }
    const tixCount = state.tickets.filter(t => t.userId === state.user.id).length;
    if (tixCount > 0 && !a.querySelector('.badge')) {
      const b = document.createElement('span'); b.className = 'badge'; b.textContent = tixCount; a.appendChild(b);
    }
  } else { a.textContent = '?'; a.style.background = ''; }
  updateNotifBadge(); updateSavedBadge();
}

/* ---------- Wire global ---------- */
function wireGlobal() {
  // Tabs
  $$('.feed-tab').forEach(t => t.addEventListener('click', () => {
    $$('.feed-tab').forEach(x => x.classList.remove('active')); t.classList.add('active');
    state.activeTab = t.dataset.tab; buildFeed();
  }));
  // Sort
  $('#sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; buildFeed(); });
  // Search
  $('#navSearch').addEventListener('input', (e) => { state.search = e.target.value; buildFeed(); });
  // Theme
  $('#btnTheme').addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem(LS.theme, 'dark'); $('#btnTheme').textContent = '🌙'; }
    else { document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem(LS.theme, 'light'); $('#btnTheme').textContent = '☀'; }
  });
  if (localStorage.getItem(LS.theme) === 'light') $('#btnTheme').textContent = '☀';
  // Notif / saved
  $('#btnNotif').addEventListener('click', () => state.user ? openDrawer('notif') : openAuth());
  $('#btnSaved').addEventListener('click', () => openDrawer('saved'));
  $('#clearNotif').addEventListener('click', () => { if (state.user) { state.user.notifications = []; const u = state.users.find(x=>x.id===state.user.id); if(u)u.notifications=[]; saveAppState(); renderNotifs(); updateNotifBadge(); } });
  $$('[data-close-drawer]').forEach(b => b.addEventListener('click', () => closeDrawer(b.dataset.closeDrawer)));
  $('#notifOverlay').addEventListener('click', () => closeDrawer('notif'));
  $('#savedOverlay').addEventListener('click', () => closeDrawer('saved'));

  // Avatar -> profile or auth
  $('#navAvatar').addEventListener('click', () => state.user ? location.href = '/profile.html' : openAuth());

  // Auth modal
  $$('[data-auth]').forEach(t => t.addEventListener('click', () => {
    const which = t.dataset.auth;
    $$('[data-auth]').forEach(x => x.classList.toggle('active', x === t));
    $('#loginForm').hidden = which !== 'login';
    $('#signupForm').hidden = which !== 'signup';
  }));
  $('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const u = state.users.find(x => x.email === fd.get('email') && x.password === fd.get('password'));
    if (!u) return toast('Wrong email or password');
    state.user = u; saveAppState(); updateNavAvatar(); closeAuth(); toast(`Welcome back, ${u.name.split(' ')[0]}`); buildFeed(); renderSidebar();
  });
  $('#signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    if (data.password !== data.confirm) return toast('Passwords don\'t match');
    if (state.users.some(x => x.email === data.email)) return toast('Email already registered');
    const user = { id: uid(), name: data.name, email: data.email, password: data.password, role: data.role, region: data.region, age: +data.age, gender: data.gender, bio: '', avatar: '', profilePicture: '', connections: [], notifications: [], createdEvents: [], createdAt: Date.now() };
    state.users.push(user); state.user = user; saveAppState(); updateNavAvatar(); closeAuth(); toast(`Welcome, ${user.name.split(' ')[0]}!`); buildFeed(); renderSidebar();
  });

  // Close on overlay
  $$('.modal-overlay').forEach(o => o.addEventListener('click', (e) => { if (e.target === o || e.target.matches('[data-close]')) { o.classList.remove('open'); document.body.style.overflow=''; } }));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { $$('.modal-overlay.open').forEach(o => o.classList.remove('open')); $$('.drawer.open').forEach(d => closeDrawer(d.id.replace('Drawer',''))); document.body.style.overflow=''; $$('.dropdown-menu.open').forEach(m => m.classList.remove('open')); }
  });
  document.addEventListener('click', () => $$('.dropdown-menu.open').forEach(m => m.classList.remove('open')));

  // Load more
  $('#loadMore').addEventListener('click', () => {
    if (state.app.extraLoaded) { toast('All events loaded'); return; }
    state.events = state.events.concat(EXTRA_EVENTS);
    state.app.extraLoaded = true; saveAppState(); buildFeed();
    $('#loadMore').textContent = 'All loaded'; $('#loadMore').disabled = true;
  });
}

/* ---------- Boot ---------- */
function boot() {
  load();
  wireGlobal();
  renderSidebar(); renderHero(); buildFeed(); renderRightPanel(); updateNavAvatar();
  // ?created
  const params = new URLSearchParams(location.search);
  if (params.get('created') === '1') { toast('Event published!'); history.replaceState({}, '', '/index.html'); }
  if (params.get('updated') === '1') { toast('Event updated!'); history.replaceState({}, '', '/index.html'); }
  // hash deep link
  if (location.hash) { const id = location.hash.slice(1); setTimeout(() => openEventModal(id), 200); }
}
document.addEventListener('DOMContentLoaded', boot);
