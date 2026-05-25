'use strict';

const LS = { user:'eventhub_user', users:'eventhub_users', events:'eventhub_events' };
const PALETTE = ['#FF3A5C','#FF6A35','#7B3FFF','#00CDA8','#F59E0B','#3B82F6','#EC4899','#10B981'];
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const uid = () => Math.random().toString(36).slice(2,10);
const colorFor = s => { let h=0; for (const c of String(s||'')) h=(h*31+c.charCodeAt(0))>>>0; return PALETTE[h%PALETTE.length]; };
const initials = n => String(n||'?').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2600);}

let user = JSON.parse(localStorage.getItem(LS.user) || 'null');
let users = JSON.parse(localStorage.getItem(LS.users) || '[]');
let events = JSON.parse(localStorage.getItem(LS.events) || '[]');
let mainImage = '';
const extraImages = ['', '', ''];
let editingId = null;
let currentExtraSlot = -1;

const theme = localStorage.getItem('eventhub_theme'); if (theme === 'light') document.documentElement.setAttribute('data-theme','light');

function fmtDate(s, e) {
  if (!s) return '';
  const d1 = new Date(s); const opts = { year:'numeric', month:'short', day:'numeric' };
  if (!e || e === s) return d1.toLocaleDateString('en-US', opts);
  const d2 = new Date(e);
  if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear())
    return `${d1.toLocaleDateString('en-US',{month:'short',day:'numeric'})}–${d2.getDate()}, ${d1.getFullYear()}`;
  return `${d1.toLocaleDateString('en-US',opts)} – ${d2.toLocaleDateString('en-US',opts)}`;
}

function readFile(file, cb) {
  if (file.size > 5*1024*1024) { toast('Image must be under 5MB'); return; }
  const r = new FileReader(); r.onload = () => cb(r.result); r.readAsDataURL(file);
}

function showAuth() { $('#authGate').hidden = false; $('#createWrap').hidden = true; }
function showCreate() {
  $('#authGate').hidden = true; $('#createWrap').hidden = false;
  const f = $('#createForm');
  f.organizer.value = user.name;
  // Edit mode
  const params = new URLSearchParams(location.search);
  const eid = params.get('edit');
  if (eid) {
    const ev = events.find(e => e.id === eid);
    if (ev) {
      editingId = eid;
      $('#pageTitle').textContent = 'Edit event';
      $('#pageSub').textContent = 'Update the details below.';
      $('#submitBtn').textContent = 'Update event';
      f.title.value = ev.title; f.organizer.value = ev.organizer; f.cat.value = ev.cat;
      f.price.value = ev.price; f.location.value = ev.location;
      f.caption.value = ev.caption || ''; f.desc.value = ev.desc || '';
      // try to parse start date back to yyyy-mm-dd
      const d = new Date(ev.date); if (!isNaN(d)) f.startDate.value = d.toISOString().slice(0,10);
      mainImage = ev.image || '';
      (ev.images || []).slice(1, 4).forEach((u, i) => extraImages[i] = u);
      paintMain(); paintExtras();
    }
  }
}

function paintMain() {
  const d = $('#mainDrop');
  if (mainImage) { d.classList.add('has-image'); d.innerHTML = `<img src="${mainImage}" alt=""><button type="button" class="btn-danger" style="position:absolute;top:10px;right:10px;" id="clearMain">Remove</button>`; d.style.position='relative'; $('#clearMain').addEventListener('click', (e) => { e.stopPropagation(); mainImage=''; paintMain(); }); }
  else { d.classList.remove('has-image'); d.innerHTML = `<p style="font-size:14px;color:var(--text-s);">Drop an image here or click to choose</p><p style="font-size:11px;color:var(--text-d);margin-top:4px;">Max 5MB · JPG/PNG</p>`; }
}
function paintExtras() {
  $$('#extraGrid .file-drop').forEach((d, i) => {
    if (extraImages[i]) { d.classList.add('has-image'); d.innerHTML = `<img src="${extraImages[i]}"><button type="button" data-clear-extra="${i}" class="btn-danger" style="position:absolute;top:6px;right:6px;font-size:10px;padding:4px 8px;">×</button>`; d.style.position='relative'; }
    else { d.classList.remove('has-image'); d.innerHTML = `<p style="font-size:12px;color:var(--text-d);">+ image</p>`; }
  });
  $$('[data-clear-extra]').forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); extraImages[+b.dataset.clearExtra]=''; paintExtras(); }));
}

function wireDropzones() {
  $('#mainDrop').addEventListener('click', () => $('#mainFile').click());
  $('#mainDrop').addEventListener('dragover', (e) => { e.preventDefault(); $('#mainDrop').style.borderColor = 'var(--accent)'; });
  $('#mainDrop').addEventListener('dragleave', () => $('#mainDrop').style.borderColor = '');
  $('#mainDrop').addEventListener('drop', (e) => { e.preventDefault(); $('#mainDrop').style.borderColor=''; const f = e.dataTransfer.files[0]; if (f) readFile(f, (data) => { mainImage = data; paintMain(); }); });
  $('#mainFile').addEventListener('change', (e) => { const f = e.target.files[0]; if (f) readFile(f, (data) => { mainImage = data; paintMain(); }); });
  $$('#extraGrid .file-drop').forEach((d, i) => {
    d.addEventListener('click', () => { currentExtraSlot = i; $('#extraFile').click(); });
    d.addEventListener('dragover', (e) => { e.preventDefault(); d.style.borderColor = 'var(--accent)'; });
    d.addEventListener('dragleave', () => d.style.borderColor = '');
    d.addEventListener('drop', (e) => { e.preventDefault(); d.style.borderColor=''; const f = e.dataTransfer.files[0]; if (f) readFile(f, (data) => { extraImages[i] = data; paintExtras(); }); });
  });
  $('#extraFile').addEventListener('change', (e) => { const f = e.target.files[0]; if (f && currentExtraSlot >= 0) readFile(f, (data) => { extraImages[currentExtraSlot] = data; paintExtras(); }); });
}

function wireSubmit() {
  $('#createForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!mainImage) return toast('Please add a main image');
    const fd = new FormData(e.target); const d = Object.fromEntries(fd);
    const start = new Date(d.startDate); const today = new Date(); today.setHours(0,0,0,0);
    if (start < today) return toast('Date can\'t be in the past');
    const dateStr = fmtDate(d.startDate, d.endDate || null);
    const images = [mainImage, ...extraImages.filter(Boolean)];
    if (editingId) {
      const ev = events.find(x => x.id === editingId); if (!ev) return;
      Object.assign(ev, { title: d.title, organizer: d.organizer, cat: d.cat, price: d.price, location: d.location, caption: d.caption, desc: d.desc, date: dateStr, image: mainImage, images });
      localStorage.setItem(LS.events, JSON.stringify(events));
      location.href = '/app.html?updated=1';
    } else {
      const ev = { id: uid(), title: d.title, organizer: d.organizer, orgInitials: initials(d.organizer), orgColor: colorFor(user.id), cat: d.cat, date: dateStr, location: d.location, going: 0, interested: 0, comments: 0, price: d.price, image: mainImage, images, caption: d.caption, desc: d.desc, posted: Date.now(), attendees: [], createdBy: user.id, createdAt: Date.now() };
      events.unshift(ev);
      user.createdEvents = user.createdEvents || []; user.createdEvents.push(ev.id);
      const ui = users.findIndex(x => x.id === user.id); if (ui >= 0) users[ui] = user;
      localStorage.setItem(LS.events, JSON.stringify(events));
      localStorage.setItem(LS.user, JSON.stringify(user));
      localStorage.setItem(LS.users, JSON.stringify(users));
      location.href = '/app.html?created=1';
    }
  });
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

if (!user) { showAuth(); wireAuth(); }
else { showCreate(); wireDropzones(); wireSubmit(); }
