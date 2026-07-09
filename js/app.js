/* ============================================================
   SCORING ENGINE
=========================================================== */
const WEIGHTS = {
  pages: (count) => count >= 11 ? 30 : count >= 6 ? 15 : count > 0 ? 5 : 0,
  features: {
    'Bookings':15,'Online Payments':20,'Client Dashboard':45,'Member Login':20,'Multi-language':20,
    'Blog / CMS':20,'Admin Panel':30,'CRM Integration':25,'AI Chatbot':35,'API Integrations':40,
    'Analytics & SEO':10,'Contact Forms':2,'Newsletter':3,'Live Chat':8,'WhatsApp Integration':8,
  },
  styleAnimated: 10,
  contentGapPerItem: 3,
};

function computeScore(a){
  let score = 0;
  const pages = a.pages || [];
  score += WEIGHTS.pages(pages.length);
  const features = a.features || [];
  features.forEach(f => score += (WEIGHTS.features[f] || 0));
  const style = a.style || [];
  if (style.includes('Animated')) score += WEIGHTS.styleAnimated;
  const content = a.content || [];
  const contentGap = Math.max(0, 7 - content.length);
  score += Math.min(20, contentGap * WEIGHTS.contentGapPerItem);
  return score;
}

function tierForScore(score, answers = {}){
  let tier = TIERS.foundation;
  if (score >= 221) tier = TIERS.enterprise;
  else if (score >= 131) tier = TIERS.innovation;
  else if (score >= 61) tier = TIERS.growth;
  
  const budget = answers.budget;
  if (budget === 'Under R10,000' && score >= 131) {
    tier = TIERS.growth; // Cap at Growth if budget is heavily restricted
  } else if (budget === 'R10,000 – R20,000' && score >= 221) {
    tier = TIERS.innovation; // Cap at Innovation
  }
  return tier;
}

/* ============================================================
   STATE
=========================================================== */
let state = { step:0, answers:{}, selectedService:null };

function getSteps() {
  return QUESTION_BANKS[state.selectedService] || QUESTION_BANKS.default;
}

function saveState() {
  localStorage.setItem('mirai_state', JSON.stringify(state));
}

function restoreState() {
  const saved = localStorage.getItem('mirai_state');
  if (saved) {
    try { state = JSON.parse(saved); } catch(e){}
  }
}

/* ============================================================
   RENDER: LANDING
=========================================================== */
function renderLanding(){
  const grid = document.getElementById('service-cards');
  grid.innerHTML = SERVICES.map(s => `
    <div class="card ${s.enterprise ? 'card-enterprise':''}" onclick="selectService('${s.id}')">
      <div class="card-icon">${s.icon}</div>
      <div class="card-title">${s.title}</div>
      <div class="card-desc">${s.desc}</div>
    </div>`).join('');
}

function selectService(id){
  state.selectedService = id;
  saveState();
  const svc = SERVICES.find(s=>s.id===id);
  if (svc.enterprise){
    showScreen('enterprise');
    renderEnterprise();
    return;
  }
  state.step = 0;
  state.answers = {};
  saveState();
  showScreen('quiz');
  renderStep();
}

/* ============================================================
   RENDER: QUESTIONNAIRE
=========================================================== */
function renderStep(){
  const steps = getSteps();
  const step = steps[state.step];
  const total = steps.length;
  document.getElementById('progress-label').textContent = `Step ${state.step+1} of ${total}`;
  document.getElementById('progress-time').textContent = `~${Math.max(1, Math.round((total-state.step)*0.4))} min remaining`;
  document.getElementById('progress-fill').style.width = `${(state.step/total)*100}%`;

  const wrap = document.getElementById('q-wrap');
  let body = '';

  if (step.type === 'text'){
    const val = state.answers[step.key] || '';
    body = `<input class="field" id="input-${step.key}" placeholder="${step.placeholder||''}" value="${val}" oninput="setAnswer('${step.key}', this.value)">`;
  } else if (step.type === 'textarea'){
    const val = state.answers[step.key] || '';
    body = `<textarea class="field" placeholder="${step.placeholder||''}" oninput="setAnswer('${step.key}', this.value)">${val}</textarea>`;
  } else if (step.type === 'single'){
    body = `<div class="opt-grid">` + step.options.map(o => `
      <div class="opt ${state.answers[step.key]===o?'selected':''}" onclick="setAnswer('${step.key}', '${escapeAttr(o)}', true)">
        <div class="opt-check opt-radio">${checkSvg}</div>${o}
      </div>`).join('') + `</div>`;
  } else if (step.type === 'multi'){
    const sel = state.answers[step.key] || [];
    body = `<div class="opt-grid">` + step.options.map(o => `
      <div class="opt ${sel.includes(o)?'selected':''}" onclick="toggleMulti('${step.key}', '${escapeAttr(o)}')">
        <div class="opt-check">${checkSvg}</div>${o}
      </div>`).join('') + `</div>`;
  } else if (step.type === 'upload'){
    body = `<div class="upload-box" onclick="alert('File uploads are disabled in this preview.')">Drop files here, or click to browse<br><span style="font-size:11px">Logo · Brand guide · Inspiration links</span></div>`;
  }

  wrap.innerHTML = `
    <div class="section-tag">${step.section}</div>
    <div class="q-title">${step.title}</div>
    ${step.help ? `<div class="q-help">${step.help}</div>` : ''}
    ${body}
    <div class="nav-row">
      <button class="btn btn-ghost" onclick="prevStep()" ${state.step===0?'disabled':''}>Back</button>
      <button class="btn btn-primary" id="next-btn" onclick="nextStep()">${state.step===steps.length-1 ? 'See my results':'Next'}</button>
    </div>
  `;
  updateNextEnabled();
}

const checkSvg = `<svg viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2" stroke="#0A0A0C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
function escapeAttr(s){ return String(s).replace(/'/g, "\\'"); }

function setAnswer(key, value, isSingleSelect){
  state.answers[key] = value;
  saveState();
  flashSaved();
  if (isSingleSelect) renderStep();
  updateNextEnabled();
}
function toggleMulti(key, value){
  const arr = state.answers[key] || [];
  const idx = arr.indexOf(value);
  if (idx > -1) arr.splice(idx,1); else arr.push(value);
  state.answers[key] = arr;
  saveState();
  flashSaved();
  renderStep();
}
function updateNextEnabled(){
  const steps = getSteps();
  const step = steps[state.step];
  const btn = document.getElementById('next-btn');
  if (!btn) return;
  if (!step.required){ btn.disabled = false; return; }
  const val = state.answers[step.key];
  const ok = step.type==='multi' ? (val && val.length>0) : (val && String(val).trim().length>0);
  btn.disabled = !ok;
}
let saveTimer;
function flashSaved(){
  const el = document.getElementById('autosave');
  el.classList.add('show');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(()=>el.classList.remove('show'), 1200);
}
function nextStep(){
  const steps = getSteps();
  if (state.step < steps.length-1){ 
    state.step++; 
    saveState();
    renderStep(); 
    window.scrollTo({top:0,behavior:'smooth'}); 
  } else { 
    showResults(); 
  }
}
function prevStep(){
  if (state.step>0){ 
    state.step--; 
    saveState();
    renderStep(); 
    window.scrollTo({top:0,behavior:'smooth'}); 
  }
}

/* ============================================================
   RENDER: RESULTS
=========================================================== */
async function showResults(){
  const steps = getSteps();
  state.step = steps.length;
  saveState();

  const score = computeScore(state.answers);
  const tier = tierForScore(score, state.answers);
  const ref = 'MS-' + Math.random().toString(36).slice(2,8).toUpperCase();
  
  showScreen('results');
  const wrap = document.getElementById('res-wrap');
  
  // 1. Loading State
  wrap.innerHTML = `
    <div class="res-eyebrow">Processing Submission</div>
    <h1 style="margin-bottom:20px;">Generating your custom brief...</h1>
    <div class="analysis-badge" style="display:inline-flex; position:relative; bottom:0;"><div class="orbit"><div class="orbit-ring"></div></div>Analyzing responses</div>
  `;

  // 2. Assemble Payload
  const payload = {
    submissionType: "standard", // Can be toggled for enterprise in future
    service: state.selectedService,
    referenceId: ref,
    client: {
      businessName: state.answers.businessName || '',
      industry: state.answers.industry || '',
      email: state.answers.email || '',
      contactName: state.answers.contactName || ''
    },
    answers: state.answers,
    scoring: {
      rawScore: score,
      recommendedTier: tier.name,
      budgetCapped: false, // Could compute this if needed
      tierDetails: tier
    }
  };

  // 3. Submit to Vercel Serverless Function
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
    }
  } catch (err) {
    console.error('Submission failed, continuing gracefully...', err);
  }

  // 4. Render Final Results UI
  wrap.innerHTML = `
    <div class="res-check"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 12.5L9.5 18L20 6" stroke="#C6A15B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    <div class="res-eyebrow">Project Assessment Complete</div>
    <h1>Here's what we recommend for ${state.answers.businessName || 'your project'}.</h1>
    <p class="res-lede">Our assessment indicates that your project aligns with our <strong>${tier.name}</strong> solution. This means ${tierExplain(tier)}</p>

    <div class="tier-card">
      <div class="tier-label">Recommended Plan</div>
      <div class="tier-name">${tier.name}</div>
      <div class="tier-desc">${tier.desc}</div>
      <div class="tier-meta">
        <div class="tier-meta-item"><div class="l">Estimated Timeline</div><div class="v">${tier.timeline}</div></div>
        <div class="tier-meta-item"><div class="l">Suggested Session</div><div class="v">${tier.consult}</div></div>
      </div>
    </div>

    <div class="res-actions">
      <button class="btn btn-gold" style="flex:1" onclick="alert('This would open scheduling.')">Schedule Consultation</button>
      <button class="btn btn-ghost" style="flex:1" disabled>Results Emailed</button>
    </div>

    <div class="ref-tag">Reference ${ref} · Submitted ${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div>
    <div class="restart-link" onclick="restart()">Start a new assessment</div>
  `;
}
function tierExplain(tier){
  const map = {
    Foundation:'your project needs a clean, focused build without heavy custom development.',
    Growth:'your project requires moderate custom development with integrations and scalability considerations.',
    Innovation:'your project needs advanced functionality — dashboards, automation, or AI features — on infrastructure built to scale.',
    Enterprise:'your project involves mission-critical systems, complex integrations, and dedicated delivery resourcing.',
  };
  return map[tier.name];
}

/* ============================================================
   RENDER: ENTERPRISE INTAKE
=========================================================== */
function renderEnterprise(){
  const wrap = document.getElementById('ent-wrap');
  wrap.innerHTML = `
    <div class="section-tag" style="margin-top:0">Enterprise Intake</div>
    <div class="q-title" style="font-size:30px">Let's scope this properly.</div>
    <div class="q-help">Enterprise engagements skip the standard questionnaire — a member of our team reviews every submission personally.</div>

    <div class="ent-section-title">Organisation</div>
    <div class="ent-grid">
      <div class="ent-field"><label>Company Name</label><input class="field"></div>
      <div class="ent-field"><label>Registration Number</label><input class="field"></div>
      <div class="ent-field"><label>Tax Number</label><input class="field"></div>
      <div class="ent-field"><label>Industry</label><input class="field"></div>
      <div class="ent-field"><label>Annual Revenue</label><input class="field"></div>
      <div class="ent-field"><label>Number of Employees</label><input class="field"></div>
      <div class="ent-field" style="grid-column:1/-1"><label>Countries Operating In</label><input class="field"></div>
    </div>

    <div class="ent-section-title">Current Environment</div>
    <div class="ent-grid">
      <div class="ent-field" style="grid-column:1/-1"><label>Existing Systems</label><textarea class="field" style="min-height:70px"></textarea></div>
      <div class="ent-field" style="grid-column:1/-1"><label>Current Technology Stack</label><textarea class="field" style="min-height:70px"></textarea></div>
      <div class="ent-field" style="grid-column:1/-1"><label>Current Vendors</label><input class="field"></div>
      <div class="ent-field" style="grid-column:1/-1"><label>Current Challenges</label><textarea class="field" style="min-height:70px"></textarea></div>
    </div>

    <div class="ent-section-title">Project Scope</div>
    <div class="ent-grid">
      <div class="ent-field" style="grid-column:1/-1"><label>Project Objectives</label><textarea class="field" style="min-height:70px"></textarea></div>
      <div class="ent-field" style="grid-column:1/-1"><label>Expected Outcomes</label><textarea class="field" style="min-height:70px"></textarea></div>
      <div class="ent-field"><label>Security Requirements</label><input class="field"></div>
      <div class="ent-field"><label>Compliance Requirements</label><input class="field"></div>
      <div class="ent-field" style="grid-column:1/-1"><label>Required Integrations</label><input class="field"></div>
      <div class="ent-field"><label>Preferred Timeline</label><input class="field"></div>
      <div class="ent-field"><label>Project Budget</label><input class="field"></div>
    </div>

    <div class="ent-section-title">Contacts</div>
    <div class="ent-grid">
      <div class="ent-field"><label>Primary Decision Maker</label><input class="field"></div>
      <div class="ent-field"><label>Technical Contact</label><input class="field"></div>
      <div class="ent-field" style="grid-column:1/-1"><label>Business Contact</label><input class="field"></div>
    </div>

    <div class="ent-section-title">Supporting Documents</div>
    <div class="upload-box" onclick="alert('File uploads are disabled in this preview.')">Requirements · Architecture · PDF · Excel · Word · PowerPoint · Infrastructure Diagrams</div>

    <div class="nav-row">
      <button class="btn btn-ghost" onclick="restart()">Cancel</button>
      <button class="btn btn-primary" onclick="alert('This would submit to the Enterprise pipeline and notify the sales team.')">Submit for Review</button>
    </div>
  `;
}

/* ============================================================
   NAV & INIT
=========================================================== */
function showScreen(name, animate=true){
  const screens = document.querySelectorAll('.screen');
  const target = document.getElementById('screen-'+name);
  
  if(!animate) {
    screens.forEach(s => { 
      s.classList.remove('active'); 
      s.style.opacity = ''; 
      s.style.transform = ''; 
    });
    target.classList.add('active');
    window.scrollTo({top:0});
    lucide.createIcons();
    return;
  }

  const active = Array.from(screens).find(s => s.classList.contains('active'));
  if (active && active !== target) {
    gsap.to(active, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      onComplete: () => {
        active.classList.remove('active');
        active.style.transform = '';
        active.style.opacity = '';
        target.classList.add('active');
        gsap.fromTo(target, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.4, ease: "power2.out"});
        window.scrollTo({top:0});
        lucide.createIcons();
      }
    });
  } else {
    screens.forEach(s => s.classList.remove('active'));
    target.classList.add('active');
    gsap.fromTo(target, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.4, ease: "power2.out"});
    window.scrollTo({top:0});
    lucide.createIcons();
  }
}

function restart(){
  state = { step:0, answers:{}, selectedService:null };
  saveState();
  renderLanding();
  showScreen('landing');
}

function init() {
  restoreState();
  if (state.selectedService) {
    const svc = SERVICES.find(s=>s.id===state.selectedService);
    if (svc && svc.enterprise) {
      renderEnterprise();
      showScreen('enterprise', false);
    } else {
      const steps = getSteps();
      if (state.step >= steps.length) {
        showResults();
      } else {
        renderStep();
        showScreen('quiz', false);
      }
    }
  } else {
    renderLanding();
    showScreen('landing', false);
  }
}

init();
