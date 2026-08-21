/* ============================================================
   TOGETHER STRONG — PROGRESSION TRACKER
   Model: Foundation phase, then readiness-gated double progression.

   - Foundation phase: first FOUNDATION_SESSIONS logged sessions per
     exercise, per person. No progression prompts — just building
     tolerance and clean form at whatever weight they started with.

   - After foundation: double progression.
       1) If the last CONSISTENCY_STREAK sessions at the current
          weight all hit the TOP of the rep range with feel
          'Easy' or 'Good' (never 'Hard' or 'Pain') -> prompt to
          increase weight, and drop reps back to the bottom of range.
       2) If they hit the current low-end reps cleanly but not yet
          the top -> encourage adding a rep or two next session
          (no weight change).
       3) Any 'Pain' logged -> immediately reset the streak, flag
          for caution, never auto-suggest progressing that exercise
          until it's logged pain-free again.
       4) 'Hard' logged -> hold steady, does not build the streak.
   ============================================================ */

const FOUNDATION_SESSIONS = 4;   // roughly 2 weeks at 2x/week per exercise
const CONSISTENCY_STREAK = 2;    // clean sessions needed before nudging progression

const PROG_STORE = 'togetherStrongProgressV1';

function readProgress(){
  try{ return JSON.parse(localStorage.getItem(PROG_STORE)||'{"eli":{},"rochelle":{}}'); }
  catch(e){ return {"eli":{},"rochelle":{}}; }
}
function saveProgress(p){
  try{ localStorage.setItem(PROG_STORE, JSON.stringify(p)); }catch(e){}
}

// Called the first time a person logs a weight for an exercise they've never done before.
function initExerciseState(person, exId, startWeight, repsLow, repsHigh){
  const p = readProgress();
  if(!p[person][exId]){
    p[person][exId] = {
      startWeight: startWeight,
      currentWeight: startWeight,
      repsLow: repsLow,
      repsHigh: repsHigh,
      currentRepsTarget: repsLow,
      sessions: [],       // {date, weight, s1, s2, feel}
      cleanStreak: 0,      // consecutive clean sessions at current weight/top reps
      flaggedForPain: false
    };
    saveProgress(p);
  }
  return p[person][exId];
}

function getExerciseState(person, exId){
  const p = readProgress();
  return p[person][exId] || null;
}

// Call this whenever a set/feel is logged for an exercise.
function logProgressSession(person, exId, weight, s1, s2, feel, dateStr){
  const p = readProgress();
  let st = p[person][exId];
  if(!st) return null; // must call initExerciseState first with a starting weight

  const date = dateStr || new Date().toISOString().slice(0,10);
  st.sessions.push({date, weight, s1, s2, feel});
  if(st.sessions.length > 20) st.sessions = st.sessions.slice(-20); // cap history

  if(feel === 'Pain'){
    st.flaggedForPain = true;
    st.cleanStreak = 0;
  } else {
    st.flaggedForPain = false;
    const hitTopReps = (Number(s1)||0) >= st.repsHigh && (Number(s2)||0) >= st.repsHigh;
    const clean = (feel === 'Easy' || feel === 'Good') && Number(weight) === Number(st.currentWeight);
    if(clean && hitTopReps){
      st.cleanStreak++;
    } else if(feel === 'Hard'){
      st.cleanStreak = 0; // hold, don't punish, just no progress credit
    } else if(clean){
      // clean but not yet top reps — small credit, not a full streak point
      st.cleanStreak = Math.max(st.cleanStreak, 0);
    }
  }
  saveProgress(p);
  return st;
}

// Returns whichever the next coaching prompt should be for this exercise.
function evaluateReadiness(person, exId){
  const st = getExerciseState(person, exId);
  if(!st) return {action:'none', message:''};

  if(st.flaggedForPain){
    return {action:'caution', message:'Last session flagged Pain on this one. Hold at the current weight, check form, or use Substitute for something easier on the joint.'};
  }
  if(st.sessions.length < FOUNDATION_SESSIONS){
    const remaining = FOUNDATION_SESSIONS - st.sessions.length;
    return {action:'foundation', message:`Foundation phase — ${remaining} more session${remaining===1?'':'s'} before we start progressing this one.`};
  }
  if(st.cleanStreak >= CONSISTENCY_STREAK){
    if(st.currentRepsTarget < st.repsHigh){
      return {action:'increase_reps', message:`Ready to add a rep or two — aim for ${st.repsHigh} clean reps next time before we add weight.`};
    } else {
      return {action:'increase_weight', message:`Two clean sessions at ${st.currentWeight} lb for ${st.repsHigh} reps. Ready to add weight next time.`};
    }
  }
  return {action:'hold', message:'On track — keep logging at the current weight.'};
}

// Call when the person taps "increase weight" after being prompted.
function applyWeightIncrease(person, exId, newWeight){
  const p = readProgress();
  const st = p[person][exId];
  if(!st) return null;
  st.currentWeight = newWeight;
  st.currentRepsTarget = st.repsLow; // drop back to bottom of rep range at the new weight
  st.cleanStreak = 0;
  saveProgress(p);
  return st;
}

if (typeof module !== 'undefined') module.exports = {
  initExerciseState, getExerciseState, logProgressSession, evaluateReadiness, applyWeightIncrease,
  FOUNDATION_SESSIONS, CONSISTENCY_STREAK
};
