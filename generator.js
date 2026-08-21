/* ============================================================
   TOGETHER STRONG — PROGRAM GENERATOR
   Builds a week at a time from EXERCISE_LIBRARY instead of a
   fixed, hardcoded 4-day split. Rules:

   1. Each of the 4 days keeps a "dominant" equipment identity
      (helps build movement familiarity within a session), but
      that dominant equipment ROTATES month to month so the same
      day isn't always kettlebell day forever.

   2. Every day covers: legs, glutes/posterior-chain, back,
      chest/shoulders, core, plus one accessory slot pulled from
      whichever equipment (bands, medicine ball, curl bar, leg
      machine, plyo box, pull-up bar) hasn't been used yet this
      month — so nothing in the gym sits idle for a month straight.

   3. Weeks 1-2 (foundation) only pull level-1 (foundation-safe)
      exercises and avoid high knee/back risk items. From week 3
      on, level-2 exercises become eligible.

   4. Priority muscle groups (legs, posterior_chain, glutes, core,
      back) get first pick of slots; every other group still shows
      up somewhere across the week.
   ============================================================ */

const DOMINANT_EQUIPMENT = ['kettlebell','smith_machine','dumbbell','landmine'];
const ACCESSORY_EQUIPMENT = ['band','cable','medicine_ball','curl_bar','leverage_machine','plyo_box','pull_up_bar'];

const WARMUP = ['Treadmill walk — 5 min','Bodyweight box squat — 8 reps','Bodyweight Glute Bridge — 10 reps','Standing March — 30 sec','Band Pull-Apart — 10 reps','Bird Dog — 6 reps / side'];

// Each day has 6 slots. 'priority' slots (legs/posterior_chain/glutes/core/back)
// pull from the dominant equipment first; 'accessory' pulls from whatever
// equipment needs rotating in this month.
const DAY_SLOTS = [
  {role:'legs', equipmentPref:'dominant'},
  {role:'glutes', equipmentPref:'dominant', fallback:'posterior_chain'},
  {role:'back', equipmentPref:'any_low_risk'},
  {role:'chest', equipmentPref:'dominant', fallback:'shoulders'},
  {role:'core', equipmentPref:'any_low_risk'},
  {role:null, equipmentPref:'accessory'}, // whatever muscle the rotating accessory equipment happens to train
];

function norm(s){return (s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}

function isFoundationWeek(weekNumber){ return weekNumber <= 2; }

function eligiblePool(weekNumber){
  const foundation = isFoundationWeek(weekNumber);
  return EXERCISE_LIBRARY.filter(ex => {
    // High knee/back risk exercises are NEVER auto-assigned, foundation or not —
    // they stay available only as a manual Substitute pick, with a caution label.
    if(ex.kneeRisk==='high' || ex.backRisk==='high') return false;
    if(foundation && ex.level > 1) return false;
    return true;
  });
}

function pickForSlot(pool, slot, dominantEq, accessoryEq, usedIds, usedNames, dayMuscleCounts){
  const wantsRole = slot.role;
  const tryFilters = [];

  if(slot.equipmentPref === 'dominant'){
    tryFilters.push(ex => ex.primary===wantsRole && ex.equipment===dominantEq);
    if(slot.fallback) tryFilters.push(ex => ex.primary===slot.fallback && ex.equipment===dominantEq);
    tryFilters.push(ex => ex.primary===wantsRole); // any equipment
    if(slot.fallback) tryFilters.push(ex => ex.primary===slot.fallback);
  } else if(slot.equipmentPref === 'accessory'){
    // Role-agnostic: this slot's job is to guarantee the rotating equipment gets
    // used, whatever muscle group it happens to train. Prefer priority muscle
    // groups (legs/glutes/posterior_chain/core/back) and whatever this day hasn't
    // hit yet, but equipment match comes first.
    tryFilters.push(ex => ex.equipment===accessoryEq);
    tryFilters.push(ex => true); // last resort: any equipment, so the slot is never empty
  } else { // any_low_risk — prefer cable/band (joint-friendly, always available), else anything
    tryFilters.push(ex => ex.primary===wantsRole && (ex.equipment==='cable'||ex.equipment==='band') && ex.kneeRisk==='low' && ex.backRisk==='low');
    tryFilters.push(ex => ex.primary===wantsRole && ex.kneeRisk==='low' && ex.backRisk==='low');
    tryFilters.push(ex => ex.primary===wantsRole);
  }

  for(const filt of tryFilters){
    const candidates = pool.filter(ex => filt(ex) && !usedIds.has(ex.id) && !usedNames.has(norm(ex.name)));
    if(candidates.length){
      // Prefer lowest combined risk, then whichever muscle group is least
      // represented so far today (keeps a day from becoming 3 core exercises).
      candidates.sort((a,b)=> {
        const r = riskScore(a)-riskScore(b);
        if(r!==0) return r;
        return (dayMuscleCounts[a.primary]||0) - (dayMuscleCounts[b.primary]||0);
      });
      return candidates[0];
    }
  }
  return null;
}

function riskScore(ex){
  const map = {low:0, med:1, high:2};
  return (map[ex.kneeRisk]||0) + (map[ex.backRisk]||0);
}

// weekNumber: 1-based, increments forever. Equipment rotation and foundation
// gating are both derived from it, so week 5 continues the month-2 pattern, etc.
function buildWeek(weekNumber){
  const pool = eligiblePool(weekNumber);
  const monthIndex = Math.floor((weekNumber-1)/4); // which 4-week block
  const weekInMonth = (weekNumber-1)%4;             // 0..3

  const usedNamesThisWeek = new Set();
  const days = [];

  for(let d=0; d<4; d++){
    // Dominant equipment for this day slot rotates by weekInMonth, offset per day
    // so no two days share a dominant equipment in the same week.
    const dominantEq = DOMINANT_EQUIPMENT[(d + weekInMonth) % DOMINANT_EQUIPMENT.length];
    // Accessory equipment also rotates, walking through the full accessory list
    // across the 4 days x 4 weeks so everything gets used within the month.
    const accessorySlotIndex = (weekInMonth*4 + d) % ACCESSORY_EQUIPMENT.length;
    const accessoryEq = ACCESSORY_EQUIPMENT[accessorySlotIndex];

    const usedIds = new Set();
    const dayMuscleCounts = {};
    const exercises = [];
    DAY_SLOTS.forEach(slot => {
      let pick = pickForSlot(pool, slot, dominantEq, accessoryEq, usedIds, usedNamesThisWeek, dayMuscleCounts);
      if(!pick){
        // last-resort: ignore the "used this week" restriction rather than leave a slot empty
        pick = pickForSlot(pool, slot, dominantEq, accessoryEq, usedIds, new Set(), dayMuscleCounts);
      }
      if(pick){
        usedIds.add(pick.id);
        usedNamesThisWeek.add(norm(pick.name));
        dayMuscleCounts[pick.primary] = (dayMuscleCounts[pick.primary]||0) + 1;
        exercises.push(pick);
      }
    });

    const dominantLabel = dominantEq.replace('_',' ');
    days.push({
      title: `Day ${d+1} — ${titleCase(dominantLabel)} Focus`,
      dominantEquipment: dominantEq,
      accessoryEquipment: accessoryEq,
      desc: `Built around ${dominantLabel}, with ${accessoryEq.replace('_',' ')} mixed in.`,
      warm: WARMUP,
      ex: exercises
    });
  }

  return {weekNumber, monthIndex, foundation: isFoundationWeek(weekNumber), days};
}

function titleCase(s){ return s.replace(/\w\S*/g, t => t[0].toUpperCase()+t.slice(1)); }

// ---- Substitute engine: same primary muscle group, any equipment ----
function substitutesFor(exerciseId){
  const base = EXERCISE_LIBRARY.find(e=>e.id===exerciseId);
  if(!base) return [];
  return EXERCISE_LIBRARY
    .filter(e => e.id!==base.id && (e.primary===base.primary || e.secondary.includes(base.primary)))
    .sort((a,b)=> riskScore(a)-riskScore(b));
}

// ---- Day 5: Recovery / Stretch (not weight-tracked — duration-based) ----
const MOBILITY_ROUTINE = [
  {id:'mob_cat_cow', name:'Cat-Cow Stretch', equipment:'mobility', primary:'mobility', duration:'8-10 slow reps', cue:'Gentle spinal mobility — go only as far as feels easy.'},
  {id:'mob_childs_pose', name:"Child's Pose", equipment:'mobility', primary:'mobility', duration:'45-60 sec', cue:'Sink hips toward heels, let the lower back release.'},
  {id:'mob_hip_flexor_stretch', name:'Kneeling Hip Flexor Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec / side', cue:'Tuck the pelvis slightly to feel it in the front of the hip, not the low back.'},
  {id:'mob_hamstring_stretch', name:'Seated Hamstring Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec / side', cue:'Hinge from the hips with a long spine, not a rounded back.'},
  {id:'mob_figure4', name:'Figure-4 Glute Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec / side', cue:'Lying or seated version, whichever is comfortable on the knees.'},
  {id:'mob_thread_needle', name:'Thread the Needle', equipment:'mobility', primary:'mobility', duration:'6-8 reps / side', cue:'Gentle thoracic rotation — good for upper back mobility.'},
  {id:'mob_cobra', name:'Gentle Cobra / Sphinx Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Low, easy extension — stop well short of any pinching feeling.'},
  {id:'mob_breathing', name:'Diaphragmatic Breathing / Wind-Down', equipment:'mobility', primary:'mobility', duration:'2-3 min', cue:'Slow nasal breathing, relaxed belly — closes out the session.'},
];
function buildRecoveryDay(){
  return {
    title: 'Day 5 — Recovery & Stretch',
    dominantEquipment: 'mobility',
    accessoryEquipment: 'mobility',
    desc: 'A gentle mat-based stretch and mobility flow — yoga/Pilates style, nothing loaded.',
    warm: ['A few slow breaths to settle in — no equipment needed.'],
    mobility: true,
    ex: MOBILITY_ROUTINE
  };
}

// ---- Day 6: Bonus Core / Glute day ----
function buildBonusCoreGluteDay(weekNumber){
  const basePool = eligiblePool(weekNumber);
  const primaryPool = basePool.filter(e => e.primary==='core' || e.primary==='glutes');
  const secondaryPool = basePool.filter(e => e.primary!=='core' && e.primary!=='glutes' && (e.secondary.includes('core') || e.secondary.includes('glutes')));
  // Rotate the starting point through the pool by week so it's not the same 6 every time.
  function rotate(pool){ if(!pool.length) return pool; const offset=(weekNumber-1)%pool.length; return pool.slice(offset).concat(pool.slice(0,offset)); }
  const ordered = rotate(primaryPool).concat(rotate(secondaryPool));
  const usedNames = new Set();
  const picks = [];
  for(const ex of ordered){
    if(picks.length>=6) break;
    if(usedNames.has(norm(ex.name))) continue;
    usedNames.add(norm(ex.name));
    picks.push(ex);
  }
  return {
    title: 'Day 6 — Bonus Core & Glutes',
    dominantEquipment: 'bonus',
    accessoryEquipment: 'bonus',
    desc: 'Extra core and glute work on top of the main 4 days — skip this one if you\'re short on time.',
    warm: WARMUP,
    ex: picks
  };
}

if (typeof module !== 'undefined') module.exports = { buildWeek, substitutesFor, DOMINANT_EQUIPMENT, ACCESSORY_EQUIPMENT, isFoundationWeek, buildRecoveryDay, buildBonusCoreGluteDay, MOBILITY_ROUTINE };
