/* Mereproduksi kesalahan pada draf awal (V0) dan membandingkannya dengan versi akhir. */
'use strict';
const L = require('../js/script.js');

// ---- V0: draf awal ----
function addTaskV0(tasks, name, course, deadline) {
  if (name == '') { return false; }                       // hanya cek string kosong
  tasks.push({ id: tasks.length + 1, name, course, deadline, done: false }); // id = jumlah + 1
  return true;
}
function deleteTaskV0(tasks, id) { return tasks.filter((t) => t.id !== id); }

console.log('--- Kesalahan 1: nama hanya spasi ---');
const v0 = [];
console.log('V0 menerima "   "     :', addTaskV0(v0, '   ', 'PABWE', '2026-10-26'));
console.log('Akhir menerima "   "   :', L.validateTask({ name: '   ', course: 'PABWE', deadline: '2026-10-26' }).valid);

console.log('\n--- Kesalahan 2: id duplikat setelah penghapusan ---');
let a = [];
['A', 'B', 'C'].forEach((n) => addTaskV0(a, n, 'X', '2026-10-26'));
a = deleteTaskV0(a, 2);                       // hapus B
addTaskV0(a, 'D', 'X', '2026-10-26');         // id baru = 2 + 1 = 3
console.log('V0 id           :', a.map((t) => t.name + '#' + t.id).join(', '));
a = deleteTaskV0(a, 3);                       // pengguna hanya ingin menghapus D
console.log('V0 sisa setelah hapus D:', a.map((t) => t.name).join(', ') || '(kosong)', ' <- C ikut terhapus');

let b = [];
['A', 'B', 'C'].forEach((n) => { b = L.addTask(b, { name: n, course: 'X', deadline: '2026-10-26' }); });
b = L.deleteTask(b, b[1].id);
b = L.addTask(b, { name: 'D', course: 'X', deadline: '2026-10-26' });
const dId = b[b.length - 1].id;
b = L.deleteTask(b, dId);
console.log('Akhir sisa setelah hapus D:', b.map((t) => t.name).join(', '));
