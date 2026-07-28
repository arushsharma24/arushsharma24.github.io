(function () {
  const {
    DAYS,
    CONDITIONING,
    createEmptySet,
    createExerciseState,
    loadState,
    saveState,
    getDaySummary,
    createExportTsv,
    copyTextToClipboard
  } = window.WorkoutLogData;

  const state = loadState();
  let activeView = 'day';
  let activeDay = state.activeDay;
  let quoteIndex = Math.floor(Math.random() * window.WORKOUT_QUOTES.length);

  const tabsEl = document.getElementById('tabs');
  const dayPanelEl = document.getElementById('dayPanel');
  const dayViewEl = document.getElementById('dayView');
  const conditioningViewEl = document.getElementById('conditioningView');
  const exListEl = document.getElementById('exList');
  const conditioningEl = document.getElementById('conditioning');
  const metaTitleEl = document.getElementById('metaTitle');
  const metaFocusEl = document.getElementById('metaFocus');
  const metaCountEl = document.getElementById('metaCount');
  const metaSetsEl = document.getElementById('metaSets');
  const metaDoneEl = document.getElementById('metaDone');
  const barFillEl = document.getElementById('barFill');
  const progressTextEl = document.getElementById('progressText');
  const sessionCommentEl = document.getElementById('sessionComment');
  const quoteTextEl = document.getElementById('quoteText');
  const quoteAuthorEl = document.getElementById('quoteAuthor');
  const nextQuoteBtn = document.getElementById('nextQuoteBtn');
  const randomQuoteBtn = document.getElementById('randomQuoteBtn');
  const exportDayBtn = document.getElementById('exportDayBtn');
  const resetBtn = document.getElementById('resetBtn');

  function persist() {
    state.activeDay = activeDay;
    saveState(state);
  }

  function getExerciseLog(dayIndex, exerciseIndex) {
    return state.days[dayIndex].exercises[exerciseIndex];
  }

  function renderQuote() {
    const quote = window.WORKOUT_QUOTES[quoteIndex];
    quoteTextEl.textContent = quote.text;
    quoteAuthorEl.textContent = quote.author;
  }

  function switchToDay(dayIndex) {
    activeView = 'day';
    activeDay = dayIndex;
    persist();
    renderAll();
  }

  function switchToConditioning() {
    activeView = 'conditioning';
    renderAll();
  }

  function renderTabs() {
    tabsEl.innerHTML = '';

    DAYS.forEach((day, index) => {
      const tab = document.createElement('button');
      tab.className = 'tab' + (activeView === 'day' && activeDay === index ? ' active' : '');
      tab.type = 'button';
      tab.innerHTML = [
        '<div class="num">' + day.name + '</div>',
        '<div class="name">' + day.title + '</div>',
        '<div class="focus">' + day.focus + '</div>'
      ].join('');
      tab.addEventListener('click', function () {
        switchToDay(index);
      });
      tabsEl.appendChild(tab);
    });

    const conditioningTab = document.createElement('button');
    conditioningTab.className = 'tab' + (activeView === 'conditioning' ? ' active' : '');
    conditioningTab.type = 'button';
    conditioningTab.innerHTML = [
      '<div class="num">Extra</div>',
      '<div class="name">Conditioning</div>',
      '<div class="focus">Runs, sprints, sport</div>'
    ].join('');
    conditioningTab.addEventListener('click', switchToConditioning);
    tabsEl.appendChild(conditioningTab);
  }

  function renderDayMeta() {
    const day = DAYS[activeDay];
    const summary = getDaySummary(state, activeDay);

    metaTitleEl.textContent = day.title;
    metaFocusEl.textContent = day.focus;
    metaCountEl.textContent = day.exercises.length;
    metaSetsEl.textContent = summary.plannedSets;
    metaDoneEl.textContent = summary.doneSets;
    sessionCommentEl.value = state.days[activeDay].sessionComment;
  }

  function renderExerciseCards() {
    const day = DAYS[activeDay];
    exListEl.innerHTML = '';

    day.exercises.forEach(function (exercise, exerciseIndex) {
      const exerciseLog = getExerciseLog(activeDay, exerciseIndex);
      const completedSets = exerciseLog.sets.filter(set => set.done).length;
      const totalSets = exerciseLog.sets.length;
      const isDone = totalSets > 0 && completedSets === totalSets;
      const card = document.createElement('article');
      card.className = 'exercise-card' + (isDone ? ' done' : '');

      const setMarkup = exerciseLog.sets.map(function (set, setIndex) {
        return [
          '<div class="set-row' + (set.done ? ' done' : '') + '">',
          '  <div class="set-head">',
          '    <div class="set-label">Set ' + (setIndex + 1) + '</div>',
          '    <label class="check-wrap" for="ex-' + exerciseIndex + '-set-' + setIndex + '-done">',
          '      <input class="check-input set-check" id="ex-' + exerciseIndex + '-set-' + setIndex + '-done" data-exercise-index="' + exerciseIndex + '" data-set-index="' + setIndex + '" type="checkbox"' + (set.done ? ' checked' : '') + '>',
          '      <span class="check-copy">Logged</span>',
          '    </label>',
          '  </div>',
          '  <div class="set-grid">',
          '    <div>',
          '      <label class="field-label" for="ex-' + exerciseIndex + '-set-' + setIndex + '-reps">Reps</label>',
          '      <input class="field set-input" id="ex-' + exerciseIndex + '-set-' + setIndex + '-reps" data-exercise-index="' + exerciseIndex + '" data-set-index="' + setIndex + '" data-field="reps" type="text" inputmode="decimal" placeholder="' + exercise.targetReps + '" value="' + escapeHtml(set.reps) + '">',
          '    </div>',
          '    <div>',
          '      <label class="field-label" for="ex-' + exerciseIndex + '-set-' + setIndex + '-weight">Load</label>',
          '      <input class="field set-input" id="ex-' + exerciseIndex + '-set-' + setIndex + '-weight" data-exercise-index="' + exerciseIndex + '" data-set-index="' + setIndex + '" data-field="weight" type="text" inputmode="decimal" placeholder="kg / bw" value="' + escapeHtml(set.weight) + '">',
          '    </div>',
          '  </div>',
          '  <div class="set-note">',
          '    <label class="field-label" for="ex-' + exerciseIndex + '-set-' + setIndex + '-comment">Set note</label>',
          '    <input class="field set-input" id="ex-' + exerciseIndex + '-set-' + setIndex + '-comment" data-exercise-index="' + exerciseIndex + '" data-set-index="' + setIndex + '" data-field="comment" type="text" placeholder="Hard, easy, pain, form, grip." value="' + escapeHtml(set.comment) + '">',
          '  </div>',
          '</div>'
        ].join('');
      }).join('');

      card.innerHTML = [
        '<div class="exercise-top">',
        '  <div>',
        '    <div class="exercise-name">' + exercise.name + '</div>',
        '    <div class="exercise-note">' + exercise.note + '</div>',
        '  </div>',
        '  <div class="exercise-target">' + exercise.targetSets + ' x ' + exercise.targetReps + '</div>',
        '</div>',
        '<div class="exercise-stats">',
        '  <div class="status-pill' + (isDone ? ' complete' : '') + '">' + completedSets + ' / ' + totalSets + ' sets logged</div>',
        '  <div class="exercise-actions">',
        '    <button class="mini-btn add-set-btn" data-exercise-index="' + exerciseIndex + '" type="button">Add Set</button>',
        '    <button class="mini-btn clear-ex-btn" data-exercise-index="' + exerciseIndex + '" type="button">Clear</button>',
        '  </div>',
        '</div>',
        '<div class="set-list">' + setMarkup + '</div>',
        '<div class="exercise-comment">',
        '  <label class="field-label" for="exercise-comment-' + exerciseIndex + '">Exercise note</label>',
        '  <textarea class="field-textarea exercise-note-input" id="exercise-comment-' + exerciseIndex + '" data-exercise-index="' + exerciseIndex + '" placeholder="Technique, variation, pain, adjustment.">' + escapeHtml(exerciseLog.comment) + '</textarea>',
        '</div>'
      ].join('');

      exListEl.appendChild(card);
    });

    bindDayInteractions();
  }

  function renderConditioning() {
    conditioningEl.innerHTML = '';

    CONDITIONING.forEach(function (item) {
      const values = state.conditioning[item.key];
      const card = document.createElement('section');
      card.className = 'conditioning-card';
      card.innerHTML = [
        '<div class="conditioning-top">',
        '  <div>',
        '    <div class="conditioning-name">' + item.name + '</div>',
        '    <div class="conditioning-target">' + item.target + '</div>',
        '  </div>',
        '</div>',
        '<div>',
        '  <label class="field-label" for="cond-' + item.key + '-count">Sessions this week</label>',
        '  <input class="field conditioning-input" id="cond-' + item.key + '-count" data-key="' + item.key + '" data-field="count" type="text" inputmode="numeric" placeholder="0" value="' + escapeHtml(values.count) + '">',
        '</div>',
        '<div style="margin-top:10px;">',
        '  <label class="field-label" for="cond-' + item.key + '-note">Notes</label>',
        '  <textarea class="field-textarea conditioning-input" id="cond-' + item.key + '-note" data-key="' + item.key + '" data-field="note" placeholder="' + item.placeholder + '">' + escapeHtml(values.note) + '</textarea>',
        '</div>'
      ].join('');

      conditioningEl.appendChild(card);
    });

    conditioningEl.querySelectorAll('.conditioning-input').forEach(function (input) {
      input.addEventListener('input', function (event) {
        const key = event.target.dataset.key;
        const field = event.target.dataset.field;
        state.conditioning[key][field] = event.target.value;
        persist();
      });
    });
  }

  function bindDayInteractions() {
    exListEl.querySelectorAll('.set-input').forEach(function (input) {
      input.addEventListener('input', function (event) {
        const exerciseIndex = Number(event.target.dataset.exerciseIndex);
        const setIndex = Number(event.target.dataset.setIndex);
        const field = event.target.dataset.field;
        getExerciseLog(activeDay, exerciseIndex).sets[setIndex][field] = event.target.value;
        persist();
      });
    });

    exListEl.querySelectorAll('.set-check').forEach(function (input) {
      input.addEventListener('change', function (event) {
        const exerciseIndex = Number(event.target.dataset.exerciseIndex);
        const setIndex = Number(event.target.dataset.setIndex);
        getExerciseLog(activeDay, exerciseIndex).sets[setIndex].done = event.target.checked;
        persist();
        renderDay();
      });
    });

    exListEl.querySelectorAll('.exercise-note-input').forEach(function (textarea) {
      textarea.addEventListener('input', function (event) {
        const exerciseIndex = Number(event.target.dataset.exerciseIndex);
        getExerciseLog(activeDay, exerciseIndex).comment = event.target.value;
        persist();
      });
    });

    exListEl.querySelectorAll('.add-set-btn').forEach(function (button) {
      button.addEventListener('click', function (event) {
        const exerciseIndex = Number(event.target.dataset.exerciseIndex);
        getExerciseLog(activeDay, exerciseIndex).sets.push(createEmptySet());
        persist();
        renderDay();
      });
    });

    exListEl.querySelectorAll('.clear-ex-btn').forEach(function (button) {
      button.addEventListener('click', function (event) {
        const exerciseIndex = Number(event.target.dataset.exerciseIndex);
        const targetSets = DAYS[activeDay].exercises[exerciseIndex].targetSets;
        state.days[activeDay].exercises[exerciseIndex] = createExerciseState(targetSets);
        persist();
        renderDay();
      });
    });
  }

  function renderProgress() {
    const summary = getDaySummary(state, activeDay);
    const percentage = summary.plannedSets ? (summary.doneSets / summary.plannedSets) * 100 : 0;
    barFillEl.style.width = percentage + '%';
    progressTextEl.textContent = summary.doneSets + ' / ' + summary.plannedSets + ' sets logged';
  }

  function renderDay() {
    renderDayMeta();
    renderExerciseCards();
    renderProgress();
  }

  function renderViewState() {
    const dayMode = activeView === 'day';
    dayPanelEl.classList.toggle('hidden', !dayMode);
    dayViewEl.classList.toggle('hidden', !dayMode);
    conditioningViewEl.classList.toggle('hidden', dayMode);
  }

  function renderAll() {
    renderTabs();
    renderViewState();
    renderQuote();
    if (activeView === 'day') {
      renderDay();
    } else {
      renderConditioning();
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  nextQuoteBtn.addEventListener('click', function () {
    quoteIndex = (quoteIndex + 1) % window.WORKOUT_QUOTES.length;
    renderQuote();
  });

  randomQuoteBtn.addEventListener('click', function () {
    let nextIndex = quoteIndex;
    while (window.WORKOUT_QUOTES.length > 1 && nextIndex === quoteIndex) {
      nextIndex = Math.floor(Math.random() * window.WORKOUT_QUOTES.length);
    }
    quoteIndex = nextIndex;
    renderQuote();
  });

  exportDayBtn.addEventListener('click', async function () {
    const exportData = createExportTsv(state, { dayIndexes: [activeDay] });
    const originalLabel = 'Export Day';

    try {
      await copyTextToClipboard(exportData.text);
      exportDayBtn.textContent = 'Copied ' + exportData.rowCount + ' Rows';
    } catch (error) {
      exportDayBtn.textContent = 'Copy Failed';
    }

    window.setTimeout(function () {
      exportDayBtn.textContent = originalLabel;
    }, 1800);
  });

  sessionCommentEl.addEventListener('input', function (event) {
    state.days[activeDay].sessionComment = event.target.value;
    persist();
  });

  resetBtn.addEventListener('click', function () {
    state.days[activeDay] = {
      sessionComment: '',
      exercises: DAYS[activeDay].exercises.map(exercise => createExerciseState(exercise.targetSets))
    };
    persist();
    renderDay();
  });

  renderAll();
})();
