/* ============================================================
   TOGETHER STRONG — PROGRAM GENERATOR (v2)
   Balanced full-body design + anti-repetition.
   ============================================================ */

const DOMINANT_EQUIPMENT = ['kettlebell','smith_machine','dumbbell','landmine','barbell','cable'];
const ACCESSORY_EQUIPMENT = ['band','cable','medicine_ball','curl_bar','leverage_machine','plyo_box','pull_up_bar'];

const WARMUP = ['Treadmill walk — 5 min','Bodyweight box squat — 8 reps','Bodyweight Glute Bridge — 10 reps','Standing March — 30 sec','Band Pull-Apart — 10 reps','Bird Dog — 6 reps / side'];

function norm(s){return (s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}

function isFoundationWeek(weekNumber){ return weekNumber <= 2; }

// Every 6th week is a planned lighter week -- advisory only, since progression
// stays readiness-gated per exercise regardless.
function isDeloadWeek(weekNumber){ return weekNumber > 2 && weekNumber % 6 === 0; }

function eligiblePool(weekNumber, blacklist){
  blacklist = blacklist || new Set();
  const foundation = isFoundationWeek(weekNumber);
  return EXERCISE_LIBRARY.filter(ex => {
    if(blacklist.has(ex.id)) return false;
    if(ex.kneeRisk==='high' || ex.backRisk==='high') return false;
    if(foundation && ex.level > 1) return false;
    return true;
  });
}

function riskScore(ex){
  const map = {low:0, med:1, high:2};
  return (map[ex.kneeRisk]||0) + (map[ex.backRisk]||0);
}

function weeklySlotTargets(weekNumber){
  const offset = (weekNumber-1) % MUSCLE_GROUPS.length;
  const rotated = MUSCLE_GROUPS.slice(offset).concat(MUSCLE_GROUPS.slice(0,offset));
  const targets = [];
  while(targets.length < 20) targets.push(...rotated);
  return targets.slice(0,20);
}

function pickForRole(pool, role, dominantEq, usedIds, usedNames, avoidIds, dayMuscleCounts){
  const tryFilters = [
    ex => ex.primary===role && ex.equipment===dominantEq && !avoidIds.has(ex.id),
    ex => ex.primary===role && !avoidIds.has(ex.id),
    ex => ex.primary===role && ex.equipment===dominantEq,
    ex => ex.primary===role,
  ];
  for(const filt of tryFilters){
    const candidates = pool.filter(ex => filt(ex) && !usedIds.has(ex.id) && !usedNames.has(norm(ex.name)));
    if(candidates.length){
      candidates.sort((a,b)=>{
        const r = riskScore(a)-riskScore(b);
        if(r!==0) return r;
        return (dayMuscleCounts[a.primary]||0) - (dayMuscleCounts[b.primary]||0);
      });
      return candidates[0];
    }
  }
  return null;
}

function pickForAccessory(pool, accessoryEq, usedIds, usedNames, avoidIds){
  const tryFilters = [
    ex => ex.equipment===accessoryEq && !avoidIds.has(ex.id),
    ex => ex.equipment===accessoryEq,
    ex => true,
  ];
  for(const filt of tryFilters){
    const candidates = pool.filter(ex => filt(ex) && !usedIds.has(ex.id) && !usedNames.has(norm(ex.name)));
    if(candidates.length){
      candidates.sort((a,b)=>riskScore(a)-riskScore(b));
      return candidates[0];
    }
  }
  return null;
}

function ensureWeeklyCoverage(days, pool, usedNamesThisWeek){
  function coverageCounts(){
    const counts={};
    days.forEach(d=>d.ex.forEach(e=>{counts[e.primary]=(counts[e.primary]||0)+1}));
    return counts;
  }
  const missing = MUSCLE_GROUPS.filter(g => !coverageCounts()[g]);

  missing.forEach((group, idx) => {
    const candidates = pool.filter(e => e.primary===group && !usedNamesThisWeek.has(norm(e.name)));
    candidates.sort((a,b)=>riskScore(a)-riskScore(b));
    const pick = candidates[0];
    if(!pick) return;

    const targetDay = days[idx % days.length];
    const counts = coverageCounts();
    let bumpIndex = -1;
    for(let i=targetDay.ex.length-1; i>=0; i--){
      if(counts[targetDay.ex[i].primary] > 1){ bumpIndex = i; break; }
    }
    if(bumpIndex>=0){
      const removed = targetDay.ex.splice(bumpIndex,1,pick)[0];
      usedNamesThisWeek.delete(norm(removed.name));
    } else {
      targetDay.ex.push(pick);
    }
    usedNamesThisWeek.add(norm(pick.name));
  });
}

function buildWeek(weekNumber, avoidIds, blacklist){
  avoidIds = avoidIds || new Set();
  const pool = eligiblePool(weekNumber, blacklist);
  const weekInMonth = (weekNumber-1)%4;
  const slotTargets = weeklySlotTargets(weekNumber);

  const usedNamesThisWeek = new Set();
  const days = [];

  for(let d=0; d<4; d++){
    const dominantEq = DOMINANT_EQUIPMENT[(d + weekInMonth) % DOMINANT_EQUIPMENT.length];
    const accessorySlotIndex = (weekInMonth*4 + d) % ACCESSORY_EQUIPMENT.length;
    const accessoryEq = ACCESSORY_EQUIPMENT[accessorySlotIndex];
    const dayTargets = slotTargets.slice(d*5, d*5+5);

    const usedIds = new Set();
    const dayMuscleCounts = {};
    const exercises = [];

    dayTargets.forEach(role => {
      let pick = pickForRole(pool, role, dominantEq, usedIds, usedNamesThisWeek, avoidIds, dayMuscleCounts);
      if(!pick) pick = pickForRole(pool, role, dominantEq, usedIds, new Set(), new Set(), dayMuscleCounts);
      if(pick){
        usedIds.add(pick.id); usedNamesThisWeek.add(norm(pick.name));
        dayMuscleCounts[pick.primary] = (dayMuscleCounts[pick.primary]||0)+1;
        exercises.push(pick);
      }
    });

    let accessoryPick = pickForAccessory(pool, accessoryEq, usedIds, usedNamesThisWeek, avoidIds);
    if(!accessoryPick) accessoryPick = pickForAccessory(pool, accessoryEq, usedIds, new Set(), new Set());
    if(accessoryPick){
      usedIds.add(accessoryPick.id); usedNamesThisWeek.add(norm(accessoryPick.name));
      exercises.push(accessoryPick);
    }

    const dominantLabel = dominantEq.replace('_',' ');
    days.push({
      title: `Day ${d+1} — ${titleCase(dominantLabel)} Focus`,
      dominantEquipment: dominantEq,
      accessoryEquipment: accessoryEq,
      desc: `Full-body day built around ${dominantLabel}, with ${accessoryEq.replace('_',' ')} mixed in.`,
      warm: WARMUP,
      ex: exercises
    });
  }

  ensureWeeklyCoverage(days, pool, usedNamesThisWeek);

  return {weekNumber, foundation: isFoundationWeek(weekNumber), days};
}

function titleCase(s){ return s.replace(/\w\S*/g, t => t[0].toUpperCase()+t.slice(1)); }

function substitutesFor(exerciseId){
  const base = EXERCISE_LIBRARY.find(e=>e.id===exerciseId);
  if(!base) return [];
  return EXERCISE_LIBRARY
    .filter(e => e.id!==base.id && (e.primary===base.primary || e.secondary.includes(base.primary)))
    .sort((a,b)=> riskScore(a)-riskScore(b));
}

const MOBILITY_ROUTINE = [
  {id:'mob_cat_cow', name:'Cat-Cow Stretch', equipment:'mobility', primary:'mobility', duration:'8-10 slow reps', cue:'Gentle spinal mobility — go only as far as feels easy.'},
  {id:'mob_childs_pose', name:"Child's Pose", equipment:'mobility', primary:'mobility', duration:'45-60 sec', cue:'Sink hips toward heels, let the lower back release.'},
  {id:'mob_hip_flexor_stretch', name:'Kneeling Hip Flexor Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec / side', cue:'Tuck the pelvis slightly to feel it in the front of the hip, not the low back.'},
  {id:'mob_hamstring_stretch', name:'Seated Hamstring Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec / side', cue:'Hinge from the hips with a long spine, not a rounded back.'},
  {id:'mob_figure4', name:'Figure-4 Glute Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec / side', cue:'Lying or seated version, whichever is comfortable on the knees.'},
  {id:'mob_thread_needle', name:'Thread the Needle', equipment:'mobility', primary:'mobility', duration:'6-8 reps / side', cue:'Gentle thoracic rotation — good for upper back mobility.'},
  {id:'mob_cobra', name:'Gentle Cobra / Sphinx Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Low, easy extension — stop well short of any pinching feeling.'},
  {id:'mob_breathing', name:'Diaphragmatic Breathing / Wind-Down', equipment:'mobility', primary:'mobility', duration:'2-3 min', cue:'Slow nasal breathing, relaxed belly — closes out the session.'},
  {id:'mob_cat_stretch', name:'Cat Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Position yourself on the floor on your hands and knees.'},
  {id:'mob_hamstring_stretch', name:'Hamstring Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Lie on your back with one leg extended above you, with the hip at ninety degrees. Keep the other leg flat on the floor.'},
  {id:'mob_seated_floor_hamstring_stretch', name:'Seated Floor Hamstring Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Sit on a mat with your right leg extended in front of you and your left leg bent with your foot against your right inner thigh.'},
  {id:'mob_kneeling_hip_flexor', name:'Kneeling Hip Flexor', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Kneel on a mat and bring your right knee up so the bottom of your foot is on the floor and extend your left leg out behind you so the...'},
  {id:'mob_standing_hip_flexors', name:'Standing Hip Flexors', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Stand up straight with the spine vertical, the left foot slightly in front of the right.'},
  {id:'mob_knee_across_the_body', name:'Knee Across The Body', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Lie down on the floor with your right leg straight. Bend your left leg and lower it across your body, holding the knee down toward the...'},
  {id:'mob_it_band_and_glute_stretch', name:'IT Band and Glute Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Loop a belt, rope, or band around one of your feet, and swing that leg across your body to the opposite side, keeping the leg extended...'},
  {id:'mob_groin_and_back_stretch', name:'Groin and Back Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Sit on the floor with your knees bent and feet together.'},
  {id:'mob_calf_stretch_hands_against_wall', name:'Calf Stretch Hands Against Wall', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Stand facing a wall from several feet away. Stagger your stance, placing one foot forward.'},
  {id:'mob_standing_soleus_and_achilles_stretch', name:'Standing Soleus And Achilles Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Stand with your feet hip-distance apart, one foot slightly in front of the other.'},
  {id:'mob_chest_and_front_of_shoulder_stretch', name:'Chest And Front Of Shoulder Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Start off by standing with your legs together, holding a bodybar or a broomstick.'},
  {id:'mob_round_the_world_shoulder_stretch', name:'Round The World Shoulder Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Stand up straight with your legs together, holding a bodybar or broomstick.'},
  {id:'mob_shoulder_circles', name:'Shoulder Circles', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'With shoulders relaxed and arms resting loosely at your sides (or in your lap if you\'re seated), gently roll your shoulders forward, up,...'},
  {id:'mob_middle_back_stretch', name:'Middle Back Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Stand so your feet are shoulder width apart and your hands are on your hips.'},
  {id:'mob_spinal_stretch', name:'Spinal Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Sit in a chair so your back is straight and your feet planted on the floor.'},
  {id:'mob_standing_lateral_stretch', name:'Standing Lateral Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Take a slightly wider than hip distance stance with your knees slightly bent.'},
  {id:'mob_chair_lower_back_stretch', name:'Chair Lower Back Stretch', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Sit upright on a chair.'},
  {id:'mob_hug_knees_to_chest', name:'Hug Knees To Chest', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Lie down on your back and pull both knees up to your chest.'},
  {id:'mob_pelvic_tilt_into_bridge', name:'Pelvic Tilt Into Bridge', equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Lie down with your feet on the floor, heels directly under your knees.'},
  {id:'mob_world_s_greatest_stretch', name:"World's Greatest Stretch", equipment:'mobility', primary:'mobility', duration:'30-45 sec', cue:'Three-part stretch: lunge forward, drop the back knee, then work through the hip and hamstring on each side.'},
];
function buildRecoveryDay(seedKey){
  const seed = hashSeed((seedKey||'default') + '-recovery');
  const offset = seed % MOBILITY_ROUTINE.length;
  const rotated = MOBILITY_ROUTINE.slice(offset).concat(MOBILITY_ROUTINE.slice(0,offset));
  return {
    title: 'Day 5 — Recovery & Stretch',
    dominantEquipment: 'mobility',
    accessoryEquipment: 'mobility',
    desc: 'A gentle mat-based stretch and mobility flow — yoga/Pilates style, nothing loaded. Refreshes daily.',
    warm: ['A few slow breaths to settle in — no equipment needed.'],
    mobility: true,
    ex: rotated.slice(0,8)
  };
}

function hashSeed(str){
  let h = 0;
  for(let i=0;i<str.length;i++){ h = ((h<<5)-h + str.charCodeAt(i))|0; }
  return Math.abs(h);
}
function buildBonusDay(seedKey, weekNumber, avoidIds, blacklist){
  avoidIds = avoidIds || new Set();
  const TARGET_GROUPS = ['glutes','back','legs','posterior_chain','core'];
  const basePool = eligiblePool(weekNumber || 1, blacklist);
  const primaryPool = basePool.filter(e => TARGET_GROUPS.includes(e.primary));
  const secondaryPool = basePool.filter(e => !TARGET_GROUPS.includes(e.primary) && e.secondary.some(s=>TARGET_GROUPS.includes(s)));

  const seed = hashSeed(seedKey || 'default');
  function rotate(pool){
    if(!pool.length) return pool;
    const offset = seed % pool.length;
    return pool.slice(offset).concat(pool.slice(0,offset));
  }
  const fresh = rotate(primaryPool).filter(e=>!avoidIds.has(e.id)).concat(rotate(secondaryPool).filter(e=>!avoidIds.has(e.id)));
  const rest = rotate(primaryPool).filter(e=>avoidIds.has(e.id)).concat(rotate(secondaryPool).filter(e=>avoidIds.has(e.id)));
  const ordered = fresh.concat(rest);

  const usedNames = new Set();
  const picks = [];
  for(const ex of ordered){
    if(picks.length>=8) break;
    if(usedNames.has(norm(ex.name))) continue;
    usedNames.add(norm(ex.name));
    picks.push(ex);
  }
  return {
    title: 'Day 6 — Glutes, Back, Legs & Core',
    dominantEquipment: 'bonus',
    accessoryEquipment: 'bonus',
    desc: 'A fresh 8-exercise set targeting glutes, lower back, legs, and core — new picks every day, usable any time.',
    warm: WARMUP,
    ex: picks
  };
}

if (typeof module !== 'undefined') module.exports = { buildWeek, substitutesFor, DOMINANT_EQUIPMENT, ACCESSORY_EQUIPMENT, isFoundationWeek, isDeloadWeek, buildRecoveryDay, buildBonusDay, MOBILITY_ROUTINE, eligiblePool, weeklySlotTargets };
