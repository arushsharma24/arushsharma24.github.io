(function () {
  const STORAGE_KEY = 'workout-log-state-v2';

  const DAYS = [
    {
      id: 'day-1',
      name: 'Day 1',
      title: 'Upper Body',
      focus: 'Chest & Back Width',
      exercises: [
        { name: 'Ring Pull-Ups', targetSets: 3, targetReps: '6-10', note: 'Strict reps. Leave 1-2 reps in reserve on the first sets if you want steadier progress.' },
        { name: 'Incline DB Chest Press', targetSets: 3, targetReps: '8-12', note: 'Pick one incline and own it for a few weeks before changing the angle.' },
        { name: 'Bent-Over DB Row or Ring Row', targetSets: 3, targetReps: '8-12', note: 'Use the version that lets you load the movement cleanly today.' },
        { name: 'Lateral Raises', targetSets: 3, targetReps: '10-15', note: 'Keep momentum low. Chasing control beats chasing load here.' },
        { name: 'Knee Raises or Crunches', targetSets: 3, targetReps: '10-15', note: 'Pick one. Slow down the lowering phase.' }
      ]
    },
    {
      id: 'day-2',
      name: 'Day 2',
      title: 'Lower Body',
      focus: 'Glutes & Quad Focus',
      exercises: [
        { name: 'Split Squats', targetSets: 3, targetReps: '8-12/leg', note: 'This is your main lower-body strength anchor. Track it closely.' },
        { name: 'DB RDL', targetSets: 3, targetReps: '8-12', note: 'Stay honest on hinge position and tempo.' },
        { name: 'Step-Ups or Hip Thrusts', targetSets: 3, targetReps: '10-15', note: 'Use the one that fits energy, knees, and setup friction that day.' },
        { name: 'Calf Raises', targetSets: 4, targetReps: '12-20', note: 'Pause at the stretched bottom. This helps more than bouncing reps.' },
        { name: 'Plank', targetSets: 3, targetReps: '30-60 sec', note: 'Brace hard. Stop before your lower back takes over.' }
      ]
    },
    {
      id: 'day-3',
      name: 'Day 3',
      title: 'Upper Body',
      focus: 'Shoulders & Arm Hypertrophy',
      exercises: [
        { name: 'DB Chest Press', targetSets: 3, targetReps: '8-12', note: 'Flat or another incline. Track angle in the comment if you vary it.' },
        { name: 'Pull-Ups or Ring Pull-Ups', targetSets: 3, targetReps: '6-10', note: 'Useful to alternate grips if elbows or shoulders feel beat up.' },
        { name: 'Bicep Curls', targetSets: 3, targetReps: '8-12', note: 'Run these close to failure with clean tempo.' },
        { name: 'Push-Ups or Dips', targetSets: 3, targetReps: '8-15', note: 'Use the version that gives you a hard set inside the target range.' },
        { name: 'Rear Delt Flyes', targetSets: 3, targetReps: '12-15', note: 'Good place to chase burn, not ego.' }
      ]
    },
    {
      id: 'day-4',
      name: 'Day 4',
      title: 'Flexible Day',
      focus: 'Extra Lift / Make-Up / Gym',
      exercises: [
        { name: 'Gym Compound or Extra Pull', targetSets: 3, targetReps: '5-8', note: 'Use this if you make it to a gym or want a heavier anchor.' },
        { name: 'Single-Leg Work', targetSets: 3, targetReps: '8-12/leg', note: 'Good slot for balance, control, and ankle-knee-hip integrity.' },
        { name: 'Horizontal Push', targetSets: 3, targetReps: '8-12', note: 'Pick the press variation you missed earlier in the week.' },
        { name: 'Row / Pulldown', targetSets: 3, targetReps: '8-12', note: 'Bias the back if your pressing volume is already high.' },
        { name: 'Carries / Core / Mobility', targetSets: 2, targetReps: 'Finisher', note: 'Farmer holds, planks, or a quick reset block fit well here.' }
      ]
    }
  ];

  const CONDITIONING = [
    { key: 'run', name: 'Runs', target: '2-3 / week', placeholder: 'Easy run, distance, pace, route.' },
    { key: 'sprint', name: 'Sprints', target: '0-1 / week', placeholder: 'Ex: 6 x 15s, 2:15 rest, felt sharp.' },
    { key: 'sport', name: 'Sport', target: '1+ / week', placeholder: 'Racquet sport, duration, how the body felt.' }
  ];

  function createEmptySet() {
    return { reps: '', weight: '', comment: '', done: false };
  }

  function createExerciseState(targetSets) {
    return {
      comment: '',
      sets: Array.from({ length: targetSets }, createEmptySet)
    };
  }

  function createDefaultState() {
    return {
      activeDay: 0,
      days: DAYS.map(day => ({
        sessionComment: '',
        exercises: day.exercises.map(exercise => createExerciseState(exercise.targetSets))
      })),
      conditioning: CONDITIONING.reduce((acc, item) => {
        acc[item.key] = { count: '', note: '' };
        return acc;
      }, {})
    };
  }

  function normalizeState(raw) {
    const fallback = createDefaultState();

    if (!raw || typeof raw !== 'object') {
      return fallback;
    }

    const activeDay =
      Number.isInteger(raw.activeDay) &&
      raw.activeDay >= 0 &&
      raw.activeDay < DAYS.length
        ? raw.activeDay
        : fallback.activeDay;

    const days = DAYS.map((day, dayIndex) => {
      const rawDay = raw.days && raw.days[dayIndex];

      return {
        sessionComment: typeof (rawDay && rawDay.sessionComment) === 'string' ? rawDay.sessionComment : '',
        exercises: day.exercises.map((exercise, exerciseIndex) => {
          const rawExercise = rawDay && rawDay.exercises && rawDay.exercises[exerciseIndex];
          const rawSets = Array.isArray(rawExercise && rawExercise.sets) ? rawExercise.sets : [];
          const normalizedSets = rawSets.slice(0, 20).map(set => ({
            reps: typeof (set && set.reps) === 'string' ? set.reps : '',
            weight: typeof (set && set.weight) === 'string' ? set.weight : '',
            comment: typeof (set && set.comment) === 'string' ? set.comment : '',
            done: Boolean(set && set.done)
          }));

          while (normalizedSets.length < exercise.targetSets) {
            normalizedSets.push(createEmptySet());
          }

          return {
            comment: typeof (rawExercise && rawExercise.comment) === 'string' ? rawExercise.comment : '',
            sets: normalizedSets
          };
        })
      };
    });

    const conditioning = CONDITIONING.reduce((acc, item) => {
      const rawCondition = raw.conditioning && raw.conditioning[item.key];
      acc[item.key] = {
        count: typeof (rawCondition && rawCondition.count) === 'string' ? rawCondition.count : '',
        note: typeof (rawCondition && rawCondition.note) === 'string' ? rawCondition.note : ''
      };
      return acc;
    }, {});

    return { activeDay, days, conditioning };
  }

  function loadState() {
    try {
      return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
    } catch (error) {
      return createDefaultState();
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // Ignore storage failures so the page remains usable in restricted contexts.
    }
  }

  function getDaySummary(state, dayIndex) {
    const exercises = state.days[dayIndex].exercises;
    let doneSets = 0;
    let plannedSets = 0;
    let completeExercises = 0;

    exercises.forEach(exercise => {
      plannedSets += exercise.sets.length;
      const exerciseDoneSets = exercise.sets.filter(set => set.done).length;
      doneSets += exerciseDoneSets;
      if (exercise.sets.length > 0 && exerciseDoneSets === exercise.sets.length) {
        completeExercises += 1;
      }
    });

    return {
      doneSets,
      plannedSets,
      completeExercises,
      exerciseCount: exercises.length
    };
  }

  function getOverallSummary(state) {
    return DAYS.reduce((summary, day, dayIndex) => {
      const daySummary = getDaySummary(state, dayIndex);
      summary.doneSets += daySummary.doneSets;
      summary.plannedSets += daySummary.plannedSets;
      summary.completeExercises += daySummary.completeExercises;
      summary.exerciseCount += daySummary.exerciseCount;
      return summary;
    }, { doneSets: 0, plannedSets: 0, completeExercises: 0, exerciseCount: 0 });
  }

  const EXPORT_HEADERS = [
    'Type',
    'Day',
    'Workout',
    'Exercise',
    'Set',
    'Reps',
    'Load',
    'Set Note',
    'Exercise Note',
    'Session Note',
    'Conditioning',
    'Sessions',
    'Conditioning Note'
  ];

  function sanitizeExportCell(value) {
    return String(value == null ? '' : value)
      .replace(/[\t\r\n]+/g, ' ')
      .trim();
  }

  function createExportTsv(state, options) {
    const settings = options || {};
    const dayIndexes = Array.isArray(settings.dayIndexes)
      ? settings.dayIndexes
      : DAYS.map(function (_, index) { return index; });
    const includeConditioning = Boolean(settings.includeConditioning);
    const rows = [];

    dayIndexes.forEach(function (dayIndex) {
      const day = DAYS[dayIndex];
      const dayLog = state.days[dayIndex];

      if (!day || !dayLog) {
        return;
      }

      day.exercises.forEach(function (exercise, exerciseIndex) {
        const exerciseLog = dayLog.exercises[exerciseIndex];

        exerciseLog.sets.forEach(function (set, setIndex) {
          if (!set.done) {
            return;
          }

          rows.push([
            'Lifting',
            day.name,
            day.title,
            exercise.name,
            setIndex + 1,
            set.reps,
            set.weight,
            set.comment,
            exerciseLog.comment,
            dayLog.sessionComment,
            '',
            '',
            ''
          ]);
        });
      });
    });

    if (includeConditioning) {
      CONDITIONING.forEach(function (item) {
        const values = state.conditioning[item.key];

        if (!values || (!values.count.trim() && !values.note.trim())) {
          return;
        }

        rows.push([
          'Conditioning', '', '', '', '', '', '', '', '', '', item.name, values.count, values.note
        ]);
      });
    }

    const tsvRows = [EXPORT_HEADERS].concat(rows).map(function (row) {
      return row.map(sanitizeExportCell).join('\t');
    });

    return { text: tsvRows.join('\n'), rowCount: rows.length };
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        // Fall back for browsers that expose the API but deny clipboard access.
      }
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!copied) {
      throw new Error('Clipboard copy failed');
    }
  }

  window.WorkoutLogData = {
    STORAGE_KEY,
    DAYS,
    CONDITIONING,
    createEmptySet,
    createExerciseState,
    createDefaultState,
    normalizeState,
    loadState,
    saveState,
    getDaySummary,
    getOverallSummary,
    createExportTsv,
    copyTextToClipboard
  };
})();
