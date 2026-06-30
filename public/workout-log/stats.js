(function () {
  const { DAYS, CONDITIONING, loadState, getDaySummary, getOverallSummary } = window.WorkoutLogData;
  const state = loadState();

  const metricsEl = document.getElementById('metrics');
  const dayStatsEl = document.getElementById('dayStats');
  const conditioningStatsEl = document.getElementById('conditioningStats');

  function renderMetrics() {
    const overall = getOverallSummary(state);

    const metrics = [
      { label: 'Logged Sets', value: overall.doneSets },
      { label: 'Planned Sets', value: overall.plannedSets },
      { label: 'Finished Exercises', value: overall.completeExercises },
      { label: 'Conditioning Sessions', value: getConditioningCount() }
    ];

    metricsEl.innerHTML = metrics.map(function (metric) {
      return [
        '<div class="metric">',
        '  <div class="metric-label">' + metric.label + '</div>',
        '  <div class="metric-value">' + metric.value + '</div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderDayStats() {
    dayStatsEl.innerHTML = DAYS.map(function (day, index) {
      const summary = getDaySummary(state, index);
      const dayLog = state.days[index];
      const percentage = summary.plannedSets ? Math.round((summary.doneSets / summary.plannedSets) * 100) : 0;
      const note = dayLog.sessionComment ? escapeHtml(dayLog.sessionComment) : 'No day note saved.';

      return [
        '<article class="card">',
        '  <div class="day-top">',
        '    <div>',
        '      <div class="day-name">' + day.name + ' · ' + day.title + '</div>',
        '      <div class="day-focus">' + day.focus + '</div>',
        '    </div>',
        '    <div class="pill"><strong>' + percentage + '%</strong> complete</div>',
        '  </div>',
        '  <div class="pill-row">',
        '    <div class="pill"><strong>' + summary.doneSets + '</strong> logged sets</div>',
        '    <div class="pill"><strong>' + summary.plannedSets + '</strong> planned sets</div>',
        '    <div class="pill"><strong>' + summary.completeExercises + '</strong> finished exercises</div>',
        '  </div>',
        '  <div class="bar"><div class="bar-fill" style="width:' + percentage + '%;"></div></div>',
        '  <div class="card-copy">' + note + '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderConditioning() {
    conditioningStatsEl.innerHTML = CONDITIONING.map(function (item) {
      const values = state.conditioning[item.key];
      const count = values.count || '0';
      const note = values.note ? escapeHtml(values.note) : 'No note saved.';

      return [
        '<article class="card">',
        '  <div class="day-top">',
        '    <div>',
        '      <div class="day-name">' + item.name + '</div>',
        '      <div class="day-focus">' + item.target + '</div>',
        '    </div>',
        '    <div class="pill"><strong>' + escapeHtml(count) + '</strong> sessions</div>',
        '  </div>',
        '  <div class="card-copy">' + note + '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function getConditioningCount() {
    return CONDITIONING.reduce(function (sum, item) {
      const raw = state.conditioning[item.key].count.trim();
      const value = Number(raw);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  renderMetrics();
  renderDayStats();
  renderConditioning();
})();
