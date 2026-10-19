/* Student Task Manager - logika data (dapat diuji di Node) + antarmuka (browser). */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'studentTaskManager.tasks';
  var LIMITS = { name: 100, course: 60 };

  /* ---------- Logika murni ---------- */

  function isValidDateString(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) { return false; }
    var p = value.split('-').map(Number);
    var d = new Date(p[0], p[1] - 1, p[2]);
    return d.getFullYear() === p[0] && d.getMonth() === p[1] - 1 && d.getDate() === p[2];
  }

  function text(value) {
    return value === undefined || value === null ? '' : String(value).trim();
  }

  function validateTask(input) {
    input = input || {};
    var values = { name: text(input.name), course: text(input.course), deadline: text(input.deadline) };
    var errors = {};

    if (!values.name) { errors.name = 'Nama tugas wajib diisi.'; }
    else if (values.name.length > LIMITS.name) { errors.name = 'Nama tugas maksimal ' + LIMITS.name + ' karakter.'; }

    if (!values.course) { errors.course = 'Mata kuliah wajib diisi.'; }
    else if (values.course.length > LIMITS.course) { errors.course = 'Mata kuliah maksimal ' + LIMITS.course + ' karakter.'; }

    if (!values.deadline) { errors.deadline = 'Tenggat waktu wajib diisi.'; }
    else if (!isValidDateString(values.deadline)) { errors.deadline = 'Tenggat waktu tidak valid.'; }

    return { valid: Object.keys(errors).length === 0, errors: errors, values: values };
  }

  function generateId() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function addTask(tasks, values, id) {
    var task = { id: id || generateId(), name: values.name, course: values.course, deadline: values.deadline, done: false };
    return tasks.concat([task]);
  }

  function updateTask(tasks, id, values) {
    return tasks.map(function (t) {
      return t.id === id ? { id: t.id, name: values.name, course: values.course, deadline: values.deadline, done: t.done } : t;
    });
  }

  function deleteTask(tasks, id) {
    return tasks.filter(function (t) { return t.id !== id; });
  }

  function toggleTask(tasks, id) {
    return tasks.map(function (t) {
      return t.id === id ? { id: t.id, name: t.name, course: t.course, deadline: t.deadline, done: !t.done } : t;
    });
  }

  function filterTasks(tasks, filter) {
    if (filter === 'active') { return tasks.filter(function (t) { return !t.done; }); }
    if (filter === 'done') { return tasks.filter(function (t) { return t.done; }); }
    return tasks.slice();
  }

  function sortTasks(tasks) {
    return tasks.slice().sort(function (a, b) {
      if (a.deadline !== b.deadline) { return a.deadline < b.deadline ? -1 : 1; }
      return a.name.localeCompare(b.name);
    });
  }

  function todayString() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function isOverdue(task, today) {
    return !task.done && task.deadline < (today || todayString());
  }

  function isTaskShape(t) {
    return t !== null && typeof t === 'object' &&
      typeof t.id === 'string' && t.id !== '' &&
      typeof t.name === 'string' && t.name.trim() !== '' &&
      typeof t.course === 'string' && t.course.trim() !== '' &&
      isValidDateString(t.deadline) && typeof t.done === 'boolean';
  }

  function loadTasks(storage) {
    try {
      var raw = storage.getItem(STORAGE_KEY);
      if (!raw) { return []; }
      var data = JSON.parse(raw);
      return Array.isArray(data) ? data.filter(isTaskShape) : [];
    } catch (e) {
      return [];
    }
  }

  function saveTasks(storage, tasks) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (e) {
      return false;
    }
  }

  var api = {
    STORAGE_KEY: STORAGE_KEY, validateTask: validateTask, isValidDateString: isValidDateString,
    addTask: addTask, updateTask: updateTask, deleteTask: deleteTask, toggleTask: toggleTask,
    filterTasks: filterTasks, sortTasks: sortTasks, isOverdue: isOverdue,
    loadTasks: loadTasks, saveTasks: saveTasks
  };

  /* ---------- Antarmuka (hanya di browser) ---------- */

  function initUI(L) {
    var $ = function (id) { return document.getElementById(id); };
    var form = $('task-form');
    var fields = { name: $('task-name'), course: $('task-course'), deadline: $('task-deadline') };
    var errorEls = { name: $('error-name'), course: $('error-course'), deadline: $('error-deadline') };
    var submitBtn = $('submit-btn');
    var cancelBtn = $('cancel-btn');
    var statusEl = $('status');
    var listEl = $('task-list');
    var emptyEl = $('empty-message');
    var summaryEl = $('summary');
    var filterBtns = document.querySelectorAll('.filter');

    var storage = null;
    try { storage = global.localStorage; } catch (e) { storage = null; }

    var state = { tasks: storage ? L.loadTasks(storage) : [], filter: 'all', editingId: null };

    function setStatus(message, isError) {
      statusEl.textContent = message || '';
      statusEl.classList.toggle('error-text', Boolean(isError));
    }

    function persist() {
      if (!storage || !L.saveTasks(storage, state.tasks)) {
        setStatus('Data tidak dapat disimpan di browser ini.', true);
        return false;
      }
      return true;
    }

    function showErrors(errors) {
      Object.keys(fields).forEach(function (key) {
        errorEls[key].textContent = errors[key] || '';
        fields[key].classList.toggle('invalid', Boolean(errors[key]));
        fields[key].setAttribute('aria-invalid', errors[key] ? 'true' : 'false');
      });
    }

    function resetForm() {
      form.reset();
      state.editingId = null;
      submitBtn.textContent = 'Tambah Tugas';
      $('form-title').textContent = 'Tambah Tugas';
      cancelBtn.hidden = true;
      showErrors({});
    }

    function makeButton(label, className, onClick) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn ' + className;
      b.textContent = label;
      b.addEventListener('click', onClick);
      return b;
    }

    function render() {
      var visible = L.sortTasks(L.filterTasks(state.tasks, state.filter));
      listEl.textContent = '';

      visible.forEach(function (task) {
        var li = document.createElement('li');
        li.className = 'task' + (task.done ? ' done' : '');

        var check = document.createElement('input');
        check.type = 'checkbox';
        check.checked = task.done;
        check.setAttribute('aria-label', 'Tandai selesai: ' + task.name);
        check.addEventListener('change', function () { onToggle(task.id); });

        var info = document.createElement('div');
        var name = document.createElement('div');
        name.className = 'task-name';
        name.textContent = task.name;
        var badge = document.createElement('span');
        badge.className = 'badge ' + (task.done ? 'done' : 'active');
        badge.textContent = task.done ? 'Selesai' : 'Belum selesai';
        name.appendChild(badge);
        if (L.isOverdue(task)) {
          var late = document.createElement('span');
          late.className = 'badge overdue';
          late.textContent = 'Terlambat';
          name.appendChild(late);
        }
        var meta = document.createElement('div');
        meta.className = 'task-meta';
        meta.textContent = task.course + ' \u2022 Tenggat: ' + task.deadline;
        info.appendChild(name);
        info.appendChild(meta);

        var actions = document.createElement('div');
        actions.className = 'task-actions';
        actions.appendChild(makeButton('Edit', '', function () { onEdit(task.id); }));
        actions.appendChild(makeButton('Hapus', 'danger', function () { onDelete(task.id); }));

        li.appendChild(check);
        li.appendChild(info);
        li.appendChild(actions);
        listEl.appendChild(li);
      });

      var total = state.tasks.length;
      var doneCount = state.tasks.filter(function (t) { return t.done; }).length;
      summaryEl.textContent = total + ' tugas \u2022 ' + doneCount + ' selesai';

      emptyEl.hidden = visible.length > 0;
      if (visible.length === 0) {
        emptyEl.textContent = total === 0
          ? 'Belum ada tugas. Tambahkan tugas pertama Anda.'
          : 'Tidak ada tugas pada filter ini.';
      }

      filterBtns.forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === state.filter);
      });
    }

    function onToggle(id) {
      state.tasks = L.toggleTask(state.tasks, id);
      persist();
      render();
    }

    function onEdit(id) {
      var task = state.tasks.filter(function (t) { return t.id === id; })[0];
      if (!task) { return; }
      state.editingId = id;
      fields.name.value = task.name;
      fields.course.value = task.course;
      fields.deadline.value = task.deadline;
      submitBtn.textContent = 'Simpan Perubahan';
      $('form-title').textContent = 'Edit Tugas';
      cancelBtn.hidden = false;
      showErrors({});
      setStatus('');
      fields.name.focus();
    }

    function onDelete(id) {
      var task = state.tasks.filter(function (t) { return t.id === id; })[0];
      if (!task || !global.confirm('Hapus tugas "' + task.name + '"?')) { return; }
      state.tasks = L.deleteTask(state.tasks, id);
      if (state.editingId === id) { resetForm(); }
      persist();
      render();
      setStatus('Tugas dihapus.');
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var result = L.validateTask({
        name: fields.name.value, course: fields.course.value, deadline: fields.deadline.value
      });
      showErrors(result.errors);
      if (!result.valid) {
        setStatus('Periksa kembali isian formulir.', true);
        return;
      }
      var wasEditing = state.editingId !== null;
      state.tasks = wasEditing
        ? L.updateTask(state.tasks, state.editingId, result.values)
        : L.addTask(state.tasks, result.values);
      resetForm();
      if (persist()) { setStatus(wasEditing ? 'Perubahan disimpan.' : 'Tugas ditambahkan.'); }
      render();
    });

    cancelBtn.addEventListener('click', function () { resetForm(); setStatus(''); });

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.filter = btn.getAttribute('data-filter');
        render();
      });
    });

    if (!storage) { setStatus('localStorage tidak tersedia; data tidak akan tersimpan.', true); }
    render();
  }

  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (typeof document !== 'undefined') {
    global.TaskLogic = api;
    document.addEventListener('DOMContentLoaded', function () { initUI(api); });
  }
})(typeof window !== 'undefined' ? window : globalThis);
