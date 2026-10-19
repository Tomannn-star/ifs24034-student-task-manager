/* Pengujian otomatis logika data. Jalankan: node tests/test.js */
'use strict';
const assert = require('assert');
const L = require('../js/script.js');

function fakeStorage(initial) {
  const data = Object.assign({}, initial);
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    _data: data
  };
}
const valid = { name: 'Tugas I PABWE', course: 'PABWE', deadline: '2026-10-26' };
const cases = [];
function tc(id, title, fn) { cases.push({ id, title, fn }); }

tc('TC-01', 'Tambah tugas dengan input valid', () => {
  const r = L.validateTask(valid);
  assert.strictEqual(r.valid, true);
  const tasks = L.addTask([], r.values);
  assert.strictEqual(tasks.length, 1);
  assert.strictEqual(tasks[0].done, false);
  assert.strictEqual(tasks[0].name, 'Tugas I PABWE');
});
tc('TC-02', 'Tolak nama kosong dan nama hanya spasi', () => {
  assert.strictEqual(L.validateTask({ ...valid, name: '' }).valid, false);
  const r = L.validateTask({ ...valid, name: '    ' });
  assert.strictEqual(r.valid, false);
  assert.ok(r.errors.name);
});
tc('TC-03', 'Edit tugas mempertahankan id dan status', () => {
  let tasks = L.toggleTask(L.addTask([], valid, 'a'), 'a');
  tasks = L.updateTask(tasks, 'a', { name: 'Baru', course: 'AI', deadline: '2026-11-01' });
  assert.deepStrictEqual(tasks[0], { id: 'a', name: 'Baru', course: 'AI', deadline: '2026-11-01', done: true });
});
tc('TC-04', 'Hapus tugas hanya menghapus tugas yang dipilih', () => {
  let tasks = L.addTask(L.addTask(L.addTask([], valid, 'a'), valid, 'b'), valid, 'c');
  tasks = L.deleteTask(tasks, 'b');
  assert.deepStrictEqual(tasks.map((t) => t.id), ['a', 'c']);
});
tc('TC-05', 'Toggle status selesai/belum selesai', () => {
  let tasks = L.addTask([], valid, 'a');
  tasks = L.toggleTask(tasks, 'a');
  assert.strictEqual(tasks[0].done, true);
  tasks = L.toggleTask(tasks, 'a');
  assert.strictEqual(tasks[0].done, false);
});
tc('TC-06', 'Filter berdasarkan status', () => {
  let tasks = L.addTask(L.addTask([], valid, 'a'), valid, 'b');
  tasks = L.toggleTask(tasks, 'b');
  assert.strictEqual(L.filterTasks(tasks, 'all').length, 2);
  assert.deepStrictEqual(L.filterTasks(tasks, 'active').map((t) => t.id), ['a']);
  assert.deepStrictEqual(L.filterTasks(tasks, 'done').map((t) => t.id), ['b']);
});
tc('TC-07', 'Data bertahan setelah simpan lalu muat ulang', () => {
  const st = fakeStorage();
  const tasks = L.toggleTask(L.addTask([], valid, 'a'), 'a');
  assert.strictEqual(L.saveTasks(st, tasks), true);
  assert.deepStrictEqual(L.loadTasks(st), tasks);
});
tc('TC-08', 'Tenggat tidak valid ditolak', () => {
  ['', '2026-02-30', '2026-13-01', '26-10-2026', 'besok', '0050-01-01'].forEach((d) => {
    assert.strictEqual(L.validateTask({ ...valid, deadline: d }).valid, false, 'seharusnya ditolak: ' + d);
  });
  assert.strictEqual(L.validateTask({ ...valid, deadline: '2028-02-29' }).valid, true);
});
tc('TC-09', 'Data rusak di localStorage tidak membuat aplikasi gagal', () => {
  assert.deepStrictEqual(L.loadTasks(fakeStorage({ [L.STORAGE_KEY]: '{bukan json' })), []);
  assert.deepStrictEqual(L.loadTasks(fakeStorage({ [L.STORAGE_KEY]: '{"a":1}' })), []);
  const mixed = JSON.stringify([{ id: 'a', name: 'ok', course: 'x', deadline: '2026-01-01', done: false }, { id: 5 }, null]);
  assert.strictEqual(L.loadTasks(fakeStorage({ [L.STORAGE_KEY]: mixed })).length, 1);
});
tc('TC-10', 'Kegagalan penyimpanan (kuota penuh) ditangani', () => {
  const full = { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); } };
  assert.strictEqual(L.saveTasks(full, []), false);
});
tc('TC-11', 'Batas panjang input dan pemangkasan spasi', () => {
  assert.strictEqual(L.validateTask({ ...valid, name: 'x'.repeat(101) }).valid, false);
  assert.strictEqual(L.validateTask({ ...valid, course: 'x'.repeat(61) }).valid, false);
  assert.strictEqual(L.validateTask({ ...valid, name: '  Rapi  ' }).values.name, 'Rapi');
});
tc('TC-12', 'Penanda terlambat hanya untuk tugas belum selesai', () => {
  const t = { id: 'a', name: 'n', course: 'c', deadline: '2026-01-01', done: false };
  assert.strictEqual(L.isOverdue(t, '2026-01-02'), true);
  assert.strictEqual(L.isOverdue(t, '2026-01-01'), false);
  assert.strictEqual(L.isOverdue({ ...t, done: true }, '2026-01-02'), false);
});

let failed = 0;
cases.forEach((c) => {
  try { c.fn(); console.log('LULUS  ' + c.id + '  ' + c.title); }
  catch (e) { failed++; console.log('GAGAL  ' + c.id + '  ' + c.title + '\n       ' + e.message); }
});
console.log('\n' + (cases.length - failed) + '/' + cases.length + ' pengujian lulus');
process.exit(failed ? 1 : 0);
