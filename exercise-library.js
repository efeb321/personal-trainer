/* ============================================================
   TOGETHER STRONG — INTERNAL EXERCISE LIBRARY
   Hand-curated (not pulled from the external animation dataset).
   Every exercise is tagged with:
     - equipment: what it's done with
     - primary: main muscle group trained
     - secondary: other muscles worked
     - kneeRisk / backRisk: 'low' | 'med' | 'high' — used to filter
       what's shown/prioritized given Eli's knee + lower back history
     - level: 1 (foundation) | 2 (standard) — which phase it's eligible for
     - cue: one short coaching note
   ============================================================ */

const MUSCLE_GROUPS = ['legs','glutes','posterior_chain','core','back','chest','shoulders','arms','calves'];

const EXERCISE_LIBRARY = [

 // ---------------- KETTLEBELL ----------------
 {id:'kb_goblet_squat', name:'Kettlebell Goblet Squat', equipment:'kettlebell', primary:'legs', secondary:['glutes','core'], kneeRisk:'med', backRisk:'low', level:1, cue:'Box behind you as a depth target. Stop above pain-free depth.'},
 {id:'kb_glute_bridge', name:'Kettlebell Glute Bridge', equipment:'kettlebell', primary:'glutes', secondary:['posterior_chain','core'], kneeRisk:'low', backRisk:'low', level:1, cue:'Kettlebell across hips. Squeeze glutes at top, don\'t overarch the back.'},
 {id:'kb_one_arm_row', name:'Supported One-Arm Kettlebell Row', equipment:'kettlebell', primary:'back', secondary:['arms'], kneeRisk:'low', backRisk:'low', level:1, cue:'Bench-supported — protects the lower back from rounding.'},
 {id:'kb_floor_press', name:'Kettlebell Floor Press', equipment:'kettlebell', primary:'chest', secondary:['arms','shoulders'], kneeRisk:'low', backRisk:'low', level:1, cue:'Floor limits shoulder range automatically — safer than a bench press.'},
 {id:'kb_pullover', name:'Kettlebell Pullover from Bench', equipment:'kettlebell', primary:'back', secondary:['chest','core'], kneeRisk:'low', backRisk:'low', level:2, cue:'Light weight. Stop if shoulders pinch.'},
 {id:'kb_suitcase_carry', name:'Kettlebell Suitcase Carry', equipment:'kettlebell', primary:'core', secondary:['back','legs'], kneeRisk:'low', backRisk:'low', level:1, cue:'Walk tall — resist leaning toward the loaded side.'},
 {id:'kb_deadlift', name:'Kettlebell Deadlift (moderate range)', equipment:'kettlebell', primary:'posterior_chain', secondary:['glutes','back'], kneeRisk:'low', backRisk:'med', level:2, cue:'Hinge from hips, flat back, moderate range only.'},
 {id:'kb_halo', name:'Kettlebell Halo', equipment:'kettlebell', primary:'shoulders', secondary:['core'], kneeRisk:'low', backRisk:'low', level:1, cue:'Slow circles around the head, light weight.'},

 // ---------------- SMITH MACHINE / B52 ----------------
 {id:'sm_box_squat', name:'Smith Machine Box Squat', equipment:'smith_machine', primary:'legs', secondary:['glutes'], kneeRisk:'med', backRisk:'low', level:1, cue:'Box is a depth stop — sit back, don\'t collapse forward on the knees.'},
 {id:'sm_hip_thrust', name:'Smith Machine Hip Thrust', equipment:'smith_machine', primary:'glutes', secondary:['posterior_chain'], kneeRisk:'low', backRisk:'low', level:1, cue:'Chin tucked, drive through heels, avoid overextending the lower back at the top.'},
 {id:'sm_incline_press', name:'Smith Machine Incline Bench Press', equipment:'smith_machine', primary:'chest', secondary:['shoulders','arms'], kneeRisk:'low', backRisk:'low', level:1, cue:'Comfortable range only — stop if shoulders complain.'},
 {id:'sm_rdl', name:'Smith Machine Romanian Deadlift', equipment:'smith_machine', primary:'posterior_chain', secondary:['glutes','back'], kneeRisk:'low', backRisk:'high', level:2, cue:'Small range, flat back — skip in foundation phase if back is sensitive.'},
 {id:'sm_calf_raise', name:'Smith Machine Calf Raise', equipment:'smith_machine', primary:'calves', secondary:[], kneeRisk:'low', backRisk:'low', level:1, cue:'Full stretch at bottom, pause at top.'},

 // ---------------- CABLE ----------------
 {id:'cb_seated_row', name:'B52 Seated Cable Row', equipment:'cable', primary:'back', secondary:['arms'], kneeRisk:'low', backRisk:'low', level:1, cue:'Sit tall, drive elbows back, don\'t lean back to cheat the pull.'},
 {id:'cb_glute_kickback', name:'Cable Standing Glute Kickback', equipment:'cable', primary:'glutes', secondary:['posterior_chain'], kneeRisk:'low', backRisk:'low', level:1, cue:'Small controlled range — this is a squeeze, not a big swing.'},
 {id:'cb_pallof_press', name:'B52 Pallof Press', equipment:'cable', primary:'core', secondary:[], kneeRisk:'low', backRisk:'low', level:1, cue:'Resist rotation — the whole point is NOT twisting.'},
 {id:'cb_lat_pulldown', name:'Cable Lat Pulldown', equipment:'cable', primary:'back', secondary:['arms'], kneeRisk:'low', backRisk:'low', level:1, cue:'Pull to upper chest, control the return.'},
 {id:'cb_tricep_pushdown', name:'Cable Tricep Pushdown', equipment:'cable', primary:'arms', secondary:[], kneeRisk:'low', backRisk:'low', level:1, cue:'Elbows pinned to sides the whole rep.'},
 {id:'cb_face_pull', name:'Cable Face Pull', equipment:'cable', primary:'shoulders', secondary:['back'], kneeRisk:'low', backRisk:'low', level:1, cue:'Great shoulder-health builder — pull to face height, elbows high.'},

 // ---------------- DUMBBELL ----------------
 {id:'db_step_up', name:'Low Dumbbell Step-Up', equipment:'dumbbell', primary:'legs', secondary:['glutes'], kneeRisk:'med', backRisk:'low', level:1, cue:'Lowest box height. Light or no weight if knees complain.'},
 {id:'db_bench_press', name:'Dumbbell Bench Press', equipment:'dumbbell', primary:'chest', secondary:['arms','shoulders'], kneeRisk:'low', backRisk:'low', level:1, cue:'Feet flat, moderate range.'},
 {id:'db_glute_bridge', name:'Dumbbell Glute Bridge', equipment:'dumbbell', primary:'glutes', secondary:['posterior_chain'], kneeRisk:'low', backRisk:'low', level:1, cue:'Same pattern as the kettlebell version — good rotation partner.'},
 {id:'db_chest_row', name:'Chest-Supported Dumbbell Row', equipment:'dumbbell', primary:'back', secondary:['arms'], kneeRisk:'low', backRisk:'low', level:1, cue:'Chest support removes lower-back strain entirely.'},
 {id:'db_sit_to_stand', name:'Dumbbell Sit-to-Stand', equipment:'dumbbell', primary:'legs', secondary:['glutes'], kneeRisk:'low', backRisk:'low', level:1, cue:'Chair height — great low-impact squat regression.'},
 {id:'db_farmer_carry', name:'Dumbbell Farmer Carry', equipment:'dumbbell', primary:'core', secondary:['back','arms'], kneeRisk:'low', backRisk:'low', level:1, cue:'Walk tall, shoulders back, don\'t let the weights pull you forward.'},
 {id:'db_shoulder_press', name:'Seated Dumbbell Shoulder Press', equipment:'dumbbell', primary:'shoulders', secondary:['arms'], kneeRisk:'low', backRisk:'low', level:1, cue:'Seated with back support removes lower-back strain.'},
 {id:'db_curl', name:'Dumbbell Bicep Curl', equipment:'dumbbell', primary:'arms', secondary:[], kneeRisk:'low', backRisk:'low', level:1, cue:'Standard isolation — no swinging.'},
 {id:'db_calf_raise', name:'Standing Dumbbell Calf Raise', equipment:'dumbbell', primary:'calves', secondary:[], kneeRisk:'low', backRisk:'low', level:1, cue:'Full range, pause at the top.'},

 // ---------------- LANDMINE ----------------
 {id:'lm_squat', name:'Landmine Squat', equipment:'landmine', primary:'legs', secondary:['glutes','core'], kneeRisk:'med', backRisk:'low', level:1, cue:'Bar angle naturally guides a more upright, knee-friendly squat.'},
 {id:'lm_press', name:'Half-Kneeling Single-Arm Landmine Press', equipment:'landmine', primary:'shoulders', secondary:['core','chest'], kneeRisk:'low', backRisk:'low', level:1, cue:'Angled press needs less overhead range than a straight press.'},
 {id:'lm_row', name:'Supported Landmine Row', equipment:'landmine', primary:'back', secondary:['arms'], kneeRisk:'low', backRisk:'low', level:1, cue:'Brace against something to keep the lower back neutral.'},
 {id:'lm_rev_squat', name:'Landmine Reverse Squat / Belt-Squat Style', equipment:'landmine', primary:'legs', secondary:['glutes'], kneeRisk:'med', backRisk:'low', level:2, cue:'Loads the legs while keeping the spine mostly out of the equation.'},
 {id:'lm_anti_rotation', name:'Landmine Anti-Rotation', equipment:'landmine', primary:'core', secondary:[], kneeRisk:'low', backRisk:'low', level:1, cue:'Press straight out, resist the bar pulling you to rotate.'},
 {id:'lm_rdl', name:'Landmine Single-Leg RDL', equipment:'landmine', primary:'posterior_chain', secondary:['glutes','core'], kneeRisk:'low', backRisk:'med', level:2, cue:'Bar as a light counterbalance — great balance + hamstring work.'},

 // ---------------- BANDS ----------------
 {id:'bd_pull_apart', name:'Band Pull-Apart', equipment:'band', primary:'back', secondary:['shoulders'], kneeRisk:'low', backRisk:'low', level:1, cue:'Great warm-up or finisher — controlled, no momentum.'},
 {id:'bd_glute_bridge', name:'Banded Glute Bridge', equipment:'band', primary:'glutes', secondary:['posterior_chain'], kneeRisk:'low', backRisk:'low', level:1, cue:'Band above the knees adds outward tension — squeeze glutes, not lower back.'},
 {id:'bd_row', name:'Standing Band Row', equipment:'band', primary:'back', secondary:['arms'], kneeRisk:'low', backRisk:'low', level:1, cue:'Anchor at chest height, squeeze shoulder blades together.'},
 {id:'bd_lateral_walk', name:'Band Lateral Walk', equipment:'band', primary:'glutes', secondary:['legs'], kneeRisk:'low', backRisk:'low', level:1, cue:'Excellent knee-friendly hip/glute activation.'},
 {id:'bd_pallof', name:'Band Pallof Press', equipment:'band', primary:'core', secondary:[], kneeRisk:'low', backRisk:'low', level:1, cue:'Same anti-rotation idea as the cable version — resist twisting.'},
 {id:'bd_face_pull', name:'Band Face Pull', equipment:'band', primary:'shoulders', secondary:['back'], kneeRisk:'low', backRisk:'low', level:1, cue:'Cheap, effective shoulder-health movement.'},
 {id:'bd_tricep_pressdown', name:'Band Tricep Pressdown', equipment:'band', primary:'arms', secondary:[], kneeRisk:'low', backRisk:'low', level:1, cue:'Anchor high, elbows pinned.'},

 // ---------------- MEDICINE BALL ----------------
 {id:'mb_slam', name:'Medicine Ball Slam (controlled)', equipment:'medicine_ball', primary:'core', secondary:['back','shoulders'], kneeRisk:'low', backRisk:'med', level:2, cue:'Controlled tempo, not max-effort — this is level 2 once the back is warmed up over weeks.'},
 {id:'mb_russian_twist', name:'Seated Medicine Ball Twist', equipment:'medicine_ball', primary:'core', secondary:[], kneeRisk:'low', backRisk:'low', level:1, cue:'Slow and controlled, feet can stay down for lower back friendliness.'},
 {id:'mb_squat_press', name:'Medicine Ball Squat to Press', equipment:'medicine_ball', primary:'legs', secondary:['shoulders','core'], kneeRisk:'med', backRisk:'low', level:2, cue:'Light ball, moderate squat depth — combo movement for a later phase.'},
 {id:'mb_chest_pass', name:'Medicine Ball Chest Pass (wall)', equipment:'medicine_ball', primary:'chest', secondary:['arms'], kneeRisk:'low', backRisk:'low', level:1, cue:'Standing, feet planted, explosive pass into a wall — fun low-load chest work.'},

 // ---------------- CURL BAR ----------------
 {id:'cbar_curl', name:'Curl Bar Bicep Curl', equipment:'curl_bar', primary:'arms', secondary:[], kneeRisk:'low', backRisk:'low', level:1, cue:'The angled grip is easier on the wrists than a straight bar.'},
 {id:'cbar_skullcrusher', name:'Curl Bar Skullcrusher', equipment:'curl_bar', primary:'arms', secondary:[], kneeRisk:'low', backRisk:'low', level:2, cue:'Light weight, controlled — go easy on the elbows starting out.'},
 {id:'cbar_upright_row', name:'Curl Bar Upright Row', equipment:'curl_bar', primary:'shoulders', secondary:['arms'], kneeRisk:'low', backRisk:'low', level:2, cue:'Stop at chest height — don\'t force shoulder range.'},

 // ---------------- BODYWEIGHT (warm-ups / fillers) ----------------
 {id:'bw_march', name:'Standing March', equipment:'bodyweight', primary:'core', secondary:['legs'], kneeRisk:'low', backRisk:'low', level:1, cue:'Warm-up staple — controlled, knee lifted to hip height.'},
 {id:'bw_bird_dog', name:'Bird Dog', equipment:'bodyweight', primary:'core', secondary:['back','glutes'], kneeRisk:'low', backRisk:'low', level:1, cue:'Gold-standard low-back-friendly core/stability move.'},
 {id:'bw_dead_bug', name:'Dead Bug', equipment:'bodyweight', primary:'core', secondary:['back'], kneeRisk:'low', backRisk:'low', level:1, cue:'Keep the lower back flat on the floor the whole rep.'},
 {id:'bw_glute_bridge', name:'Bodyweight Glute Bridge', equipment:'bodyweight', primary:'glutes', secondary:['posterior_chain'], kneeRisk:'low', backRisk:'low', level:1, cue:'The baseline version — used in every warm-up.'},

 // ---------------- LEVERAGE MACHINE (ANICZON leg extension/curl) ----------------
 {id:'lev_leg_extension', name:'Leg Extension Machine', equipment:'leverage_machine', primary:'legs', secondary:[], kneeRisk:'high', backRisk:'low', level:2, cue:'Open-chain knee move — this is the one most likely to bug a sensitive knee. Light weight, stop just short of full lockout, no swinging.'},
 {id:'lev_leg_curl', name:'Leg Curl Machine', equipment:'leverage_machine', primary:'posterior_chain', secondary:['legs'], kneeRisk:'low', backRisk:'low', level:1, cue:'Excellent hamstring isolation, generally very knee-friendly — good early staple for the posterior-chain focus.'},

 // ---------------- PLYO BOX ----------------
 {id:'box_step_up', name:'Box Step-Up', equipment:'plyo_box', primary:'legs', secondary:['glutes'], kneeRisk:'med', backRisk:'low', level:1, cue:'Start at the 12" side. Step down with control — don\'t just drop off the box.'},
 {id:'box_squat_bw', name:'Bodyweight Box Squat', equipment:'plyo_box', primary:'legs', secondary:['glutes'], kneeRisk:'low', backRisk:'low', level:1, cue:'Box behind you as a depth target and confidence builder — the easiest squat regression in the whole program.'},

 // ---------------- PULL-UP BAR ----------------
 {id:'pu_band_assisted', name:'Band-Assisted Pull-Up', equipment:'pull_up_bar', primary:'back', secondary:['arms'], kneeRisk:'low', backRisk:'low', level:2, cue:'Loop a band over the bar for assistance — control the descent, that\'s where the value is.'},
 {id:'pu_dead_hang', name:'Dead Hang', equipment:'pull_up_bar', primary:'back', secondary:['core'], kneeRisk:'low', backRisk:'low', level:1, cue:'Just hang with relaxed shoulders — great low-effort decompression for the spine and grip.'},

 // ---------------- FOAM ROLLER (mobility / cooldown) ----------------
 {id:'fr_lower_back_release', name:'Foam Roll — Lats & Upper Back', equipment:'foam_roller', primary:'back', secondary:[], kneeRisk:'low', backRisk:'low', level:1, cue:'Avoid rolling directly over the lower back/spine — stick to lats, upper back, and glutes.'},
 {id:'fr_glutes_release', name:'Foam Roll — Glutes & Hips', equipment:'foam_roller', primary:'glutes', secondary:['posterior_chain'], kneeRisk:'low', backRisk:'low', level:1, cue:'Slow rolling, pause on tender spots for 20-30 seconds.'},

];

if (typeof module !== 'undefined') module.exports = { EXERCISE_LIBRARY, MUSCLE_GROUPS };
