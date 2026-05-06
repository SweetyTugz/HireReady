import { useState, useRef, useEffect } from "react";

// ─── CURRENCY DETECTION ──────────────────────────────────────
function detectCurrency() {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        if (tz.includes("Dubai") || tz.includes("Abu_Dhabi") || tz.includes("Asia/Dubai")) return { code:"AED", symbol:"AED", price:"54.99", monthly:"54.99/mo" };
        if (tz.includes("London") || tz.includes("Europe/London")) return { code:"GBP", symbol:"£", price:"11.99", monthly:"£11.99/mo" };
    } catch(e) {}
    return { code:"USD", symbol:"$", price:"14.99", monthly:"$14.99/mo" };
}

// ─── MOCK DATA ───────────────────────────────────────────────
const UK_JOBS = [
    { id:1,  title:"Senior Software Engineer",  company:"Revolut",       location:"London, UK",        type:"Full-time", salary:"£90k–£130k",  sponsored:true,  visa:"Skilled Worker", logo:"R", color:"#191c1f", tags:["React","Node.js","TypeScript"], posted:"1d ago",  country:"uk"  },
    { id:2,  title:"Product Manager",           company:"Monzo",         location:"London, UK",        type:"Full-time", salary:"£80k–£110k",  sponsored:true,  visa:"Skilled Worker", logo:"M", color:"#00b4d8", tags:["Product","Agile","Fintech"],   posted:"2d ago",  country:"uk"  },
    { id:3,  title:"Data Scientist",            company:"DeepMind",      location:"London, UK",        type:"Full-time", salary:"£95k–£140k",  sponsored:false, visa:null,             logo:"D", color:"#4285f4", tags:["Python","ML","TensorFlow"],    posted:"3d ago",  country:"uk"  },
    { id:4,  title:"UX Designer",               company:"Wise",          location:"London, UK",        type:"Full-time", salary:"£65k–£85k",   sponsored:true,  visa:"Skilled Worker", logo:"W", color:"#00b67a", tags:["Figma","Research","UX"],       posted:"5h ago",  country:"uk"  },
    { id:5,  title:"Marketing Manager",         company:"Deliveroo",     location:"London, UK",        type:"Full-time", salary:"£55k–£75k",   sponsored:false, visa:null,             logo:"D", color:"#00ccbc", tags:["Growth","SEO","Analytics"],    posted:"4d ago",  country:"uk"  },
    { id:6,  title:"Backend Engineer",          company:"Checkout.com",  location:"London, UK",        type:"Full-time", salary:"£85k–£120k",  sponsored:true,  visa:"Skilled Worker", logo:"C", color:"#0b3ee3", tags:["Go","Payments","AWS"],         posted:"2d ago",  country:"uk"  },
    { id:7,  title:"Software Engineer",         company:"Ocado Tech",    location:"Hatfield, UK",      type:"Full-time", salary:"£70k–£100k",  sponsored:true,  visa:"Skilled Worker", logo:"O", color:"#7b2d8b", tags:["Java","Microservices","K8s"],  posted:"1d ago",  country:"uk"  },
    { id:8,  title:"Financial Analyst",         company:"HSBC",          location:"London, UK",        type:"Full-time", salary:"£50k–£70k",   sponsored:false, visa:null,             logo:"H", color:"#db0011", tags:["Excel","Finance","SQL"],       posted:"6h ago",  country:"uk"  },
    { id:9,  title:"Cloud Architect",           company:"ASOS",          location:"London, UK",        type:"Full-time", salary:"£95k–£125k",  sponsored:true,  visa:"Skilled Worker", logo:"A", color:"#ff3c78", tags:["AWS","Terraform","DevOps"],    posted:"3d ago",  country:"uk"  },
    { id:10, title:"Cybersecurity Analyst",     company:"BAE Systems",   location:"Manchester, UK",    type:"Full-time", salary:"£55k–£80k",   sponsored:false, visa:null,             logo:"B", color:"#003087", tags:["Security","SOC","SIEM"],       posted:"2d ago",  country:"uk"  },
    { id:11, title:"Full Stack Engineer",       company:"Cazoo",         location:"Remote (UK)",       type:"Full-time", salary:"£75k–£105k",  sponsored:true,  visa:"Skilled Worker", logo:"C", color:"#ff6b35", tags:["React","Python","AWS"],        posted:"1d ago",  country:"uk"  },
    { id:12, title:"HR Business Partner",       company:"Unilever",      location:"London, UK",        type:"Full-time", salary:"£45k–£65k",   sponsored:false, visa:null,             logo:"U", color:"#1f36c7", tags:["HR","Talent","Strategy"],      posted:"5d ago",  country:"uk"  },
];

const DUBAI_JOBS = [
    { id:13, title:"Senior Software Engineer",  company:"Careem",        location:"Dubai, UAE",        type:"Full-time", salary:"AED 25k–35k/mo", sponsored:true,  visa:"Employment Visa", logo:"C", color:"#1dbf73", tags:["React","Node.js","AWS"],       posted:"1d ago",  country:"uae" },
    { id:14, title:"Product Manager",           company:"Noon",          location:"Dubai, UAE",        type:"Full-time", salary:"AED 22k–30k/mo", sponsored:true,  visa:"Employment Visa", logo:"N", color:"#f5a623", tags:["E-commerce","Product","Agile"],posted:"2d ago",  country:"uae" },
    { id:15, title:"Financial Analyst",         company:"Emirates NBD",  location:"Dubai, UAE",        type:"Full-time", salary:"AED 18k–28k/mo", sponsored:true,  visa:"Employment Visa", logo:"E", color:"#cc1e2b", tags:["Finance","Excel","Bloomberg"],  posted:"3d ago",  country:"uae" },
    { id:16, title:"Marketing Director",        company:"Property Finder",location:"Dubai, UAE",       type:"Full-time", salary:"AED 28k–40k/mo", sponsored:true,  visa:"Employment Visa", logo:"P", color:"#0077b5", tags:["PropTech","Brand","Digital"],  posted:"4h ago",  country:"uae" },
    { id:17, title:"Data Engineer",             company:"Talabat",       location:"Dubai, UAE",        type:"Full-time", salary:"AED 20k–30k/mo", sponsored:true,  visa:"Employment Visa", logo:"T", color:"#ff6900", tags:["Spark","Python","Airflow"],    posted:"1d ago",  country:"uae" },
    { id:18, title:"Cloud Solutions Architect", company:"G42",           location:"Abu Dhabi, UAE",    type:"Full-time", salary:"AED 30k–45k/mo", sponsored:true,  visa:"Employment Visa", logo:"G", color:"#0050ff", tags:["Azure","AI","Cloud"],          posted:"2d ago",  country:"uae" },
    { id:19, title:"UX/UI Designer",            company:"Fetchr",        location:"Dubai, UAE",        type:"Full-time", salary:"AED 15k–22k/mo", sponsored:true,  visa:"Employment Visa", logo:"F", color:"#e63946", tags:["Figma","Mobile","Design"],     posted:"5d ago",  country:"uae" },
    { id:20, title:"DevOps Engineer",           company:"Majid Al Futtaim",location:"Dubai, UAE",     type:"Full-time", salary:"AED 22k–32k/mo", sponsored:true,  visa:"Employment Visa", logo:"M", color:"#2d6a4f", tags:["Docker","K8s","CI/CD"],        posted:"3d ago",  country:"uae" },
];

const ALL_JOBS = [...UK_JOBS, ...DUBAI_JOBS];

const VISA_INFO = {
    uk: {
        name:"UK Skilled Worker Visa",
        color:"#003078",
        points:[
            "You must have a job offer from a UK employer with a sponsor licence",
            "Role must be at RQF Level 3 or above (A-level equivalent)",
            "Minimum salary: £26,200/year or the 'going rate' for the role",
            "English language requirement: B1 level or above",
            "Application fee: £625–£1,500 depending on length",
            "Processing time: 3 weeks (standard), 5 days (priority)",
        ],
        tip:"Jobs marked 'Skilled Worker Sponsor' on our board already have a Home Office sponsor licence.",
    },
    uae: {
        name:"UAE Employment Visa",
        color:"#cc1e2b",
        points:[
            "Your employer sponsors your visa — no self-sponsorship for most roles",
            "Valid for 2 years (renewable), tied to your employer",
            "No minimum salary requirement in law, but market rate expected",
            "No English language test required",
            "Medical fitness test required on arrival",
            "Processing time: 2–4 weeks after job offer",
        ],
        tip:"All jobs on our Dubai board include visa sponsorship — UAE employers must sponsor to hire expats.",
    },
};

const INTERVIEW_QS = {
    Behavioral:[
        "Tell me about a time you handled a conflict at work.",
        "Describe your biggest professional achievement.",
        "Tell me about a time you failed and what you learned.",
        "How do you manage competing priorities under pressure?",
    ],
    Technical:[
        "Walk me through how you'd debug a critical production issue.",
        "How do you explain a technical concept to non-technical stakeholders?",
        "What's your approach to writing maintainable, scalable code?",
    ],
    Situational:[
        "You disagree with your manager's decision. What do you do?",
        "A deadline is 2 weeks away and you're behind. How do you handle it?",
        "A key team member quits mid-project. What's your response?",
    ],
    "UK/UAE Specific":[
        "Why do you want to work in the UK/UAE specifically?",
        "Are you currently eligible to work in the UK/UAE, or do you require sponsorship?",
        "How do you handle working across multicultural teams?",
        "What do you know about the differences between UK and UAE working culture?",
    ],
};

const INIT_FORM = {
    name:"", email:"", phone:"", location:"", linkedin:"", portfolio:"",
    jobTitle:"", targetIndustry:"", targetCountry:"uk", summary:"",
    experience:[{ company:"", role:"", duration:"", description:"" }],
    education:[{ school:"", degree:"", year:"", gpa:"" }],
    skills:"", certifications:"",
};

const STATUS_STYLES = {
    "Wishlist":  { bg:"#1a1a2e", text:"#a078ff", border:"#2a1a4a" },
    "Applied":   { bg:"#0a1a2e", text:"#4a9eff", border:"#1a3a5a" },
    "Interview": { bg:"#0a1f12", text:"#34d475", border:"#1a4a2a" },
    "Offer":     { bg:"#1f180a", text:"#e8a838", border:"#4a3a1a" },
    "Rejected":  { bg:"#1f0a0a", text:"#ff5a72", border:"#4a1a1a" },
};

// ─── STYLES ─────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,600;0,700;1,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07070d;--s1:#0d0d16;--s2:#12121e;--s3:#181828;--s4:#1e1e30;
  --border:#1e1e30;--border2:#262640;
  --text:#e4e0f4;--muted:#58587a;--faint:#141428;
  --accent:#6c4fff;--accent-l:#9d82ff;--accent-d:#4a30d4;
  --gold:#e8a838;--gold-l:#f0c060;
  --green:#2ed573;--green-bg:#081812;--green-b:#154028;
  --red:#ff4d6a;--blue:#4da6ff;--orange:#ff8c42;
  --uk:#003078;--uae:#cc1e2b;
}
body{background:var(--bg);font-family:'Plus Jakarta Sans',sans-serif;color:var(--text)}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}

/* SHELL */
.shell{display:flex;min-height:100vh}
.sidebar{width:248px;flex-shrink:0;background:var(--s1);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100}
.main{margin-left:248px;flex:1;min-height:100vh}

/* SIDEBAR */
.sb-logo{padding:24px 20px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.sb-logo-icon{width:36px;height:36px;background:linear-gradient(135deg,var(--accent),var(--accent-d));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;flex-shrink:0}
.sb-logo-text{font-family:'Lora',serif;font-size:19px;font-weight:700}
.sb-logo-text em{font-style:italic;color:var(--accent-l)}
.sb-user{padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.sb-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--gold));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
.sb-uname{font-size:13px;font-weight:600;color:var(--text);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sb-plan{font-size:9px;color:var(--accent-l);letter-spacing:1.5px;text-transform:uppercase;font-weight:700}
.sb-nav{flex:1;padding:10px;overflow-y:auto;display:flex;flex-direction:column;gap:2px}
.ni{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;transition:all .2s;color:var(--muted);font-size:13px;font-weight:500;border:1px solid transparent;user-select:none}
.ni:hover{background:var(--s2);color:var(--text)}
.ni.active{background:linear-gradient(135deg,#6c4fff18,#6c4fff06);border-color:#6c4fff30;color:var(--accent-l)}
.ni-icon{font-size:15px;width:20px;text-align:center;flex-shrink:0}
.ni-badge{margin-left:auto;background:var(--accent);color:#fff;font-size:9px;font-weight:700;padding:2px 7px;border-radius:100px;min-width:20px;text-align:center}
.sb-footer{padding:14px 16px;border-top:1px solid var(--border)}
.sb-pro-box{background:linear-gradient(135deg,#e8a83810,#6c4fff10);border:1px solid #e8a83830;border-radius:12px;padding:14px;text-align:center}
.sb-pro-box strong{display:block;color:var(--gold);font-size:13px;margin-bottom:4px}
.sb-pro-box p{font-size:11px;color:var(--muted);margin-bottom:10px;line-height:1.5}

/* TOPBAR */
.topbar{padding:18px 28px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--bg);position:sticky;top:0;z-index:50}
.topbar-title{font-family:'Lora',serif;font-size:20px;font-weight:700}
.topbar-title em{font-style:italic;color:var(--accent-l)}
.topbar-right{display:flex;align-items:center;gap:10px}
.market-pills{display:flex;gap:6px}
.mk-pill{font-size:10px;font-weight:700;padding:4px 10px;border-radius:100px;letter-spacing:.5px}
.mk-uk{background:#00307820;color:#6699ff;border:1px solid #00307840}
.mk-uae{background:#cc1e2b18;color:#ff8080;border:1px solid #cc1e2b40}

/* PAGE */
.page{padding:28px;animation:fadeUp .3s ease both}

/* BUTTONS */
.btn{padding:10px 20px;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .22s;border:none;letter-spacing:.1px;display:inline-flex;align-items:center;gap:6px}
.btn-accent{background:var(--accent);color:#fff}
.btn-accent:hover{background:var(--accent-l);transform:translateY(-1px);box-shadow:0 6px 20px #6c4fff44}
.btn-accent:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none}
.btn-ghost{background:var(--s3);border:1px solid var(--border2);color:var(--muted)}
.btn-ghost:hover{color:var(--text);border-color:#555}
.btn-gold{background:linear-gradient(135deg,var(--gold),#c8842a);color:#000;font-weight:700}
.btn-gold:hover{transform:translateY(-1px);box-shadow:0 8px 22px #e8a83855}
.btn-green{background:var(--green);color:#000;font-weight:700}
.btn-green:hover{transform:translateY(-1px)}
.btn-sm{padding:7px 16px;font-size:12px}
.btn-xs{padding:5px 11px;font-size:11px}

/* CARDS */
.card{background:var(--s1);border:1px solid var(--border);border-radius:16px;padding:24px}
.card-sm{background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:18px}

/* FORMS */
.fg{display:flex;flex-direction:column;gap:7px;margin-bottom:16px}
.fg.full{grid-column:1/-1}
label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);font-weight:700}
input,textarea,select{background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;padding:11px 14px;outline:none;transition:border .2s,box-shadow .2s;width:100%}
input:focus,textarea:focus,select:focus{border-color:var(--accent);box-shadow:0 0 0 3px #6c4fff12}
input::placeholder,textarea::placeholder{color:#252540}
textarea{resize:vertical;min-height:82px;line-height:1.6}
select option{background:#111}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.hint{font-size:11px;color:#303050;margin-top:3px;line-height:1.5}

/* SECTION HEADER */
.sec-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px}
.sec-title{font-family:'Lora',serif;font-size:20px;font-weight:700}
.sec-sub{font-size:12px;color:var(--muted);margin-top:2px}
.divider{border:none;border-top:1px solid var(--border);margin:22px 0}

/* STATS */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:26px}
.stat-card{background:var(--s1);border:1px solid var(--border);border-radius:16px;padding:20px;position:relative;overflow:hidden}
.stat-card::after{content:'';position:absolute;top:-24px;right:-24px;width:80px;height:80px;border-radius:50%;opacity:.1}
.stat-card.blue::after{background:var(--blue)}
.stat-card.green::after{background:var(--green)}
.stat-card.gold::after{background:var(--gold)}
.stat-card.purple::after{background:var(--accent)}
.stat-icon{font-size:20px;margin-bottom:10px}
.stat-val{font-family:'Lora',serif;font-size:32px;font-weight:700;line-height:1}
.stat-label{font-size:11px;color:var(--muted);margin-top:4px;letter-spacing:.3px}
.stat-note{font-size:11px;color:var(--green);margin-top:5px}

/* JOB BOARD */
.job-filters{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;align-items:center}
.fpill{padding:7px 15px;border-radius:100px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border2);background:var(--s2);color:var(--muted);transition:all .2s;white-space:nowrap}
.fpill:hover{color:var(--text)}
.fpill.on{background:var(--accent);color:#fff;border-color:var(--accent)}
.fpill.uk-on{background:#003078;color:#99bbff;border-color:#003078}
.fpill.uae-on{background:#cc1e2b;color:#ffaaaa;border-color:#cc1e2b}
.fpill.sp-on{background:var(--green);color:#000;border-color:var(--green)}
.jsearch input{border-radius:100px;padding:9px 16px;max-width:280px}
.jobs-list{display:flex;flex-direction:column;gap:10px}
.jcard{background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:20px;display:flex;align-items:flex-start;gap:14px;transition:all .22s;position:relative}
.jcard:hover{border-color:var(--border2);background:var(--s2);transform:translateY(-1px)}
.jlogo{width:44px;height:44px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0}
.jbody{flex:1;min-width:0}
.jtitle{font-size:15px;font-weight:700;color:var(--text);margin-bottom:2px}
.jmeta{font-size:12px;color:var(--muted);margin-bottom:8px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.jtags{display:flex;flex-wrap:wrap;gap:5px}
.jtag{background:var(--faint);color:#7070a0;font-size:11px;padding:3px 9px;border-radius:100px;border:1px solid var(--border2)}
.jright{display:flex;flex-direction:column;align-items:flex-end;gap:7px;flex-shrink:0;min-width:0}
.jsalary{font-size:13px;font-weight:700;color:var(--text);white-space:nowrap}
.jposted{font-size:10px;color:var(--muted)}
.visa-badge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:100px;letter-spacing:.3px;white-space:nowrap}
.visa-badge.sponsored{background:var(--green-bg);border:1px solid var(--green-b);color:var(--green)}
.visa-badge.no-sponsor{background:#1a1a2e;border:1px solid #252540;color:#6060a0}
.country-tag{font-size:10px;font-weight:700;padding:2px 8px;border-radius:100px}
.country-tag.uk{background:#00307818;color:#6699ff;border:1px solid #00307840}
.country-tag.uae{background:#cc1e2b14;color:#ff8888;border:1px solid #cc1e2b30}
.empty-state{text-align:center;padding:60px 20px;color:var(--muted)}
.empty-state .e-icon{font-size:40px;margin-bottom:12px}
.empty-state p{font-size:14px}

/* VISA INFO */
.visa-section{margin-top:28px}
.visa-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.visa-card{border-radius:16px;padding:24px;position:relative;overflow:hidden}
.visa-card.uk{background:linear-gradient(135deg,#001840,#003078);border:1px solid #0050a0}
.visa-card.uae{background:linear-gradient(135deg,#300008,#8b0015);border:1px solid #cc1e2b}
.visa-card-title{font-family:'Lora',serif;font-size:17px;font-weight:700;color:#fff;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.visa-points{list-style:none;display:flex;flex-direction:column;gap:8px}
.visa-point{font-size:12px;color:rgba(255,255,255,.75);line-height:1.5;display:flex;gap:8px}
.visa-point::before{content:'→';color:rgba(255,255,255,.4);flex-shrink:0}
.visa-tip{margin-top:14px;background:rgba(255,255,255,.08);border-radius:8px;padding:10px;font-size:11px;color:rgba(255,255,255,.6);line-height:1.5}

/* APP TRACKER */
.tracker-board{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;overflow-x:auto}
.t-col{background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:14px;min-width:180px}
.t-col-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.t-col-title{font-size:11px;font-weight:700;letter-spacing:.5px}
.t-count{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800}
.app-card{background:var(--s2);border:1px solid var(--border2);border-radius:10px;padding:13px;margin-bottom:8px;cursor:pointer;transition:all .2s}
.app-card:hover{border-color:var(--border2);transform:translateY(-1px);background:var(--s3)}
.app-card-title{font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px}
.app-card-co{font-size:11px;color:var(--muted);margin-bottom:6px}
.app-card-loc{font-size:10px;color:#404060}
.app-card-date{font-size:10px;color:#404060;margin-top:4px}
.add-app{width:100%;background:transparent;border:1px dashed var(--border2);border-radius:10px;padding:9px;color:var(--muted);font-size:12px;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .2s}
.add-app:hover{border-color:var(--accent);color:var(--accent-l)}
.add-app-form{background:var(--s2);border:1px solid var(--border2);border-radius:10px;padding:12px;margin-bottom:8px}

/* INTERVIEW PREP */
.iq-tabs{display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap}
.iq-tab{padding:7px 16px;border-radius:100px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border2);background:var(--s2);color:var(--muted);transition:all .2s}
.iq-tab.active{background:var(--accent);color:#fff;border-color:var(--accent)}
.iq-card{background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:22px;margin-bottom:12px}
.iq-q{font-size:15px;font-weight:600;color:var(--text);margin-bottom:14px;line-height:1.5}
.iq-textarea textarea{min-height:90px;background:var(--s2)}
.ai-fb{background:linear-gradient(135deg,#6c4fff0e,#6c4fff04);border:1px solid #6c4fff28;border-radius:12px;padding:16px;margin-top:12px;font-size:13px;color:#b0a8d4;line-height:1.75}
.ai-fb-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--accent-l);font-weight:700;margin-bottom:8px}
.ai-gen-btn{display:flex;align-items:center;gap:6px;margin-top:10px}
.spin{animation:spin 1s linear infinite;display:inline-block}

/* RESUME BUILDER */
.rsteps{display:flex;gap:5px;margin-bottom:24px;flex-wrap:wrap}
.rstep{padding:7px 16px;border-radius:100px;font-size:11px;font-weight:600;border:1px solid var(--border);color:var(--faint);background:var(--s1);transition:all .3s}
.rstep.active{background:var(--accent);color:#fff;border-color:var(--accent);box-shadow:0 0 14px #6c4fff44}
.rstep.done{color:var(--accent-l);border-color:#6c4fff40}
.eblock{border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:12px;background:var(--s2);transition:border-color .2s}
.eblock:focus-within{border-color:#6c4fff30}
.eblock-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.eblock-label{font-size:10px;color:var(--accent-l);letter-spacing:2px;text-transform:uppercase;font-weight:700}
.btn-rm{background:var(--s3);border:1px solid var(--border);color:var(--muted);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:11px;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s}
.btn-rm:hover{background:#2a0a0a;color:#ff6b6b;border-color:#ff6b6b44}
.btn-add-more{background:transparent;border:1px dashed var(--border2);color:var(--muted);border-radius:10px;padding:10px;width:100%;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;transition:all .2s;margin-top:4px}
.btn-add-more:hover{border-color:var(--accent);color:var(--accent-l)}
.nav-row{display:flex;gap:10px;margin-top:28px}

/* RESUME PREVIEW */
.r-shell{background:#fff;color:#111;border-radius:12px;overflow:hidden;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 30px 80px #00000077}
.r-top{background:#0a0a18;padding:30px 38px 22px}
.r-name{font-family:'Lora',serif;font-size:32px;font-weight:700;color:#fff;line-height:1;margin-bottom:3px}
.r-title-line{font-size:11px;color:#9d82ff;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:12px}
.r-contacts{display:flex;flex-wrap:wrap;gap:4px 15px;font-size:11px;color:#aaa}
.r-body{display:grid;grid-template-columns:185px 1fr}
.r-sidebar{background:#f5f5fa;padding:22px 16px;border-right:1px solid #eee}
.r-main{padding:22px 26px}
.r-sec{margin-bottom:17px}
.r-sec-t{font-size:8px;letter-spacing:3px;text-transform:uppercase;font-weight:800;color:#0a0a18;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #6c4fff;display:block}
.r-summary-txt{font-size:12px;color:#333;line-height:1.75}
.r-exp{margin-bottom:15px}
.r-exp-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1px}
.r-role{font-size:13px;font-weight:700;color:#111}
.r-company{font-size:11px;color:#888;margin-bottom:6px}
.r-dur{font-size:10px;color:#aaa;margin-left:8px;background:#f0f0f0;padding:1px 7px;border-radius:4px;white-space:nowrap}
.r-buls{padding-left:14px}
.r-bul{font-size:11.5px;color:#444;line-height:1.6;margin-bottom:4px}
.r-skill{font-size:11px;color:#333;padding:4px 0;border-bottom:1px solid #eee;display:flex;align-items:center;gap:5px}
.r-skill::before{content:'';width:4px;height:4px;background:#6c4fff;border-radius:50%;flex-shrink:0}
.r-edu{margin-bottom:11px}
.r-edu-deg{font-size:11px;font-weight:700;color:#111;line-height:1.4}
.r-edu-sch{font-size:10px;color:#666}
.r-edu-yr{font-size:10px;color:#999;margin-top:1px}
.r-cert{font-size:11px;color:#444;padding:3px 0;border-bottom:1px solid #eee}

/* ATS */
.ats-wrap{background:var(--s1);border:1px solid var(--border);border-radius:16px;padding:28px}
.ats-top{display:flex;align-items:center;gap:20px;margin-bottom:24px;flex-wrap:wrap}
.ats-circle{position:relative;width:88px;height:88px;flex-shrink:0}
.ats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}
.ats-item{background:var(--s2);border:1px solid var(--border2);border-radius:11px;padding:14px}
.ats-item-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:5px;font-weight:700}
.ats-item-val{font-size:14px;font-weight:700}
.ats-item-val.good{color:var(--green)}
.ats-kw-wrap{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.ats-kw{background:var(--green-bg);border:1px solid var(--green-b);color:var(--green);font-size:11px;padding:3px 10px;border-radius:100px;font-weight:600}
.ats-tips{margin-top:16px}
.ats-tip{font-size:12.5px;color:#8080a8;padding:8px 0;border-bottom:1px solid var(--border);display:flex;gap:8px;line-height:1.5}
.ats-tip::before{content:'→';color:var(--accent);flex-shrink:0}

/* COVER LETTER */
.cl-wrap{background:var(--s1);border:1px solid var(--border);border-radius:16px;padding:28px}
.cl-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px}
.cl-body{background:#fff;border-radius:10px;padding:30px;color:#222;font-family:'Plus Jakarta Sans',sans-serif;font-size:13.5px;line-height:1.85;white-space:pre-wrap;min-height:280px}
.cl-loading{text-align:center;padding:40px;color:var(--muted);font-size:13px}

/* LINKEDIN */
.li-wrap{background:var(--s1);border:1px solid var(--border);border-radius:16px;padding:28px}
.li-sec{margin-bottom:22px}
.li-sec h4{font-family:'Lora',serif;font-size:17px;font-weight:700;margin-bottom:10px;color:var(--text)}
.li-content{background:var(--s2);border:1px solid var(--border2);border-radius:10px;padding:16px;font-size:13px;color:#c0b8e0;line-height:1.75;white-space:pre-wrap}
.li-charcount{font-size:10px;color:var(--muted);text-align:right;margin-top:5px}

/* COPY BTN */
.copy-btn{background:var(--s3);border:1px solid var(--border2);color:var(--muted);border-radius:8px;padding:6px 13px;font-size:11px;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .2s}
.copy-btn:hover{color:var(--text)}
.copy-btn.copied{color:var(--green);border-color:var(--green-b)}

/* TABS */
.result-tabs{display:flex;gap:4px;margin-bottom:18px;background:var(--s1);border:1px solid var(--border);border-radius:13px;padding:5px;flex-wrap:wrap}
.rtab{flex:1;padding:9px 14px;border-radius:9px;font-size:12px;font-weight:600;cursor:pointer;border:none;font-family:'Plus Jakarta Sans',sans-serif;background:transparent;color:var(--muted);transition:all .22s;display:flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap}
.rtab:hover{color:var(--text)}
.rtab.active{background:var(--s3);color:var(--text);box-shadow:0 2px 8px #00000055}
.rtab .pro-tag{background:var(--accent);color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:100px}
.rtab-locked{opacity:.4;cursor:not-allowed}

/* PAYWALL */
.paywall-banner{background:linear-gradient(135deg,#110e06,#0a0a14);border:1px solid #e8a83840;border-radius:16px;padding:26px 30px;margin-bottom:18px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;position:relative;overflow:hidden}
.paywall-banner::before{content:'';position:absolute;top:-50px;right:-50px;width:160px;height:160px;background:radial-gradient(circle,#e8a8381a,transparent 70%);pointer-events:none}
.pw-info{flex:1;min-width:180px}
.pw-info h3{font-family:'Lora',serif;font-size:19px;font-weight:700;margin-bottom:5px}
.pw-info p{color:var(--muted);font-size:12px;line-height:1.5}
.pw-features{display:flex;flex-direction:column;gap:3px;margin-top:8px}
.pw-feat{font-size:12px;color:var(--green);display:flex;align-items:center;gap:5px}
.pw-right{display:flex;flex-direction:column;align-items:center;gap:10px}
.pw-price{font-family:'Lora',serif;font-size:40px;font-weight:700;color:var(--gold);line-height:1;text-align:center}
.pw-price-sub{font-size:11px;color:var(--muted);text-align:center;margin-top:2px}
.pw-secure{font-size:10px;color:#404060;display:flex;align-items:center;gap:4px}

/* BLUR OVERLAY */
.blur-wrap{position:relative}
.blur-inner{filter:blur(5px);pointer-events:none;user-select:none}
.blur-overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;z-index:10;background:#00000055;backdrop-filter:blur(1px);border-radius:12px}
.blur-overlay p{color:#fff;font-size:14px;font-weight:500;text-align:center;padding:0 24px}

/* DOWNLOAD BTN */
.dl-btn{display:inline-flex;align-items:center;gap:7px;background:var(--green);color:#000;padding:11px 24px;border-radius:100px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s}
.dl-btn:hover{background:#48e88a;transform:translateY(-1px)}
.dl-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}

/* GEN SPINNER */
.gen-wrap{text-align:center;padding:48px 20px}
.gen-ring{width:56px;height:56px;margin:0 auto 22px;position:relative}
.gen-ring::before,.gen-ring::after{content:'';position:absolute;inset:0;border-radius:50%;border:2px solid transparent}
.gen-ring::before{border-top-color:var(--accent);animation:spin 1s linear infinite}
.gen-ring::after{border-bottom-color:#6c4fff44;animation:spin 1.4s linear infinite reverse}
.gen-wrap strong{display:block;font-family:'Lora',serif;font-size:22px;margin-bottom:8px}
.gen-wrap p{color:var(--muted);font-size:13px;line-height:1.7}
.gen-steps{margin-top:22px;display:flex;flex-direction:column;gap:8px;align-items:center}
.gs{font-size:12px;color:#333;display:flex;align-items:center;gap:7px}
.gs.on{color:var(--accent-l)}
.gs.on .gs-icon{animation:spin 1s linear infinite;display:inline-block}
.gs.done{color:var(--green)}

/* DASHBOARD QUICK ACTIONS */
.quick-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:26px}
.qa-card{background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:20px;cursor:pointer;transition:all .22s;text-align:center}
.qa-card:hover{border-color:var(--border2);background:var(--s2);transform:translateY(-2px)}
.qa-icon{font-size:26px;margin-bottom:8px}
.qa-label{font-size:13px;font-weight:600;color:var(--text);margin-bottom:3px}
.qa-sub{font-size:11px;color:var(--muted)}

/* RECENT ACTIVITY */
.activity-list{display:flex;flex-direction:column;gap:10px}
.activity-item{background:var(--s1);border:1px solid var(--border);border-radius:12px;padding:16px;display:flex;align-items:center;gap:14px}
.activity-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.activity-body{flex:1}
.activity-title{font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px}
.activity-sub{font-size:11px;color:var(--muted)}
.activity-time{font-size:11px;color:#404060}

@media(max-width:900px){
  .sidebar{transform:translateX(-100%)}
  .main{margin-left:0}
  .stats-grid,.quick-actions{grid-template-columns:1fr 1fr}
  .tracker-board{grid-template-columns:repeat(3,1fr)}
  .visa-cards{grid-template-columns:1fr}
  .r-body{grid-template-columns:1fr}
  .r-sidebar{border-right:none;border-bottom:1px solid #eee}
}
@media(max-width:600px){
  .form-row{grid-template-columns:1fr}
  .stats-grid,.quick-actions{grid-template-columns:1fr}
  .ats-grid{grid-template-columns:1fr}
  .tracker-board{grid-template-columns:1fr 1fr}
}
`;

// ═══════════════════════════════════════════════════════════════
//  SMALL COMPONENTS
// ═══════════════════════════════════════════════════════════════
function CopyBtn({ text }) {
    const [ok, setOk] = useState(false);
    return (
        <button className={`copy-btn ${ok ? "copied" : ""}`} onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }}>
            {ok ? "✓ Copied" : "Copy"}
        </button>
    );
}

function ATSRing({ score }) {
    const r = 34, c = 2 * Math.PI * r, fill = (score / 100) * c;
    const col = score >= 85 ? "#2ed573" : score >= 65 ? "#e8a838" : "#ff4d6a";
    return (
        <div className="ats-circle">
            <svg width="88" height="88" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r={r} fill="none" stroke="#1e1e30" strokeWidth="8" />
                <circle cx="44" cy="44" r={r} fill="none" stroke={col} strokeWidth="8"
                        strokeLinecap="round" strokeDasharray={`${fill} ${c}`}
                        transform="rotate(-90 44 44)" />
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <strong style={{ fontFamily:"Lora,serif", fontSize:"22px", color:col, lineHeight:1 }}>{score}</strong>
                <span style={{ fontSize:"9px", color:"var(--muted)" }}>/ 100</span>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function HireReady() {
    const currency  = detectCurrency();
    const [page, setPage]     = useState("dashboard");
    const [isPro, setIsPro]   = useState(false);
    const [user]              = useState({ name:"Alex Johnson", initials:"AJ" });

    // Resume state
    const [rStep, setRStep]   = useState(0);
    const [form, setForm]     = useState(INIT_FORM);
    const [generating, setGen]= useState(false);
    const [genPhase, setGP]   = useState(0);
    const [resume, setResume] = useState(null);
    const [activeTab, setTab] = useState("resume");
    const [coverLetter, setCL]= useState(null);
    const [linkedin, setLI]   = useState(null);
    const [atsData, setATS]   = useState(null);
    const [tabLoading, setTL] = useState(null);
    const [downloading, setDL]= useState(false);
    const resumeRef           = useRef(null);

    // Saved resumes (simulated user account)
    const [savedResumes, setSaved] = useState([
        { id:1, name:"Software Engineer CV", updated:"2 days ago", score:94 },
        { id:2, name:"Product Manager CV",   updated:"1 week ago",  score:88 },
    ]);

    // Job board state
    const [jobFilter, setJF]    = useState("all");
    const [sponsorOnly, setSO]  = useState(false);
    const [jobSearch, setJS]    = useState("");

    // Tracker state
    const [apps, setApps] = useState({
        Wishlist:  [{ id:1, title:"Senior Engineer",  company:"Revolut",   location:"London", date:"Mar 28" }],
        Applied:   [{ id:2, title:"Product Manager",  company:"Noon",      location:"Dubai",  date:"Apr 1"  }],
        Interview: [{ id:3, title:"Data Scientist",   company:"DeepMind",  location:"London", date:"Apr 5"  }],
        Offer:     [],
        Rejected:  [{ id:4, title:"UX Designer",      company:"Figma",     location:"London", date:"Mar 25" }],
    });
    const [addingTo, setAddingTo] = useState(null);
    const [newApp, setNewApp]     = useState({ title:"", company:"", location:"" });

    // Interview prep
    const [iqCat, setIQCat]     = useState("Behavioral");
    const [answers, setAnswers] = useState({});
    const [feedback, setFeedback]= useState({});
    const [fbLoading, setFBL]   = useState(null);

    // ─── CLAUDE API ───────────────────────────────────────────
    async function claude(prompt, maxTokens = 1000) {
        const r = await fetch("https://api.anthropic.com/v1/messages", {
            method:"POST", headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:maxTokens, messages:[{role:"user", content:prompt}] })
        });
        const d = await r.json();
        return d.content.map(b => b.text||"").join("");
    }

    // ─── FORM HELPERS ─────────────────────────────────────────
    const upd  = (k,v) => setForm(f => ({...f,[k]:v}));
    const updE = (i,k,v) => { const a=[...form.experience]; a[i]={...a[i],[k]:v}; upd("experience",a); };
    const updU = (i,k,v) => { const a=[...form.education];  a[i]={...a[i],[k]:v}; upd("education",a);  };
    const addE = () => upd("experience",[...form.experience,{company:"",role:"",duration:"",description:""}]);
    const rmE  = i  => upd("experience",form.experience.filter((_,j)=>j!==i));
    const addU = () => upd("education",[...form.education,{school:"",degree:"",year:"",gpa:""}]);
    const rmU  = i  => upd("education",form.education.filter((_,j)=>j!==i));

    // ─── GENERATE RESUME ──────────────────────────────────────
    async function generateResume() {
        setGen(true); setRStep(4); setGP(1);
        const t1=setTimeout(()=>setGP(2),1100), t2=setTimeout(()=>setGP(3),2300);
        const country = form.targetCountry === "uk"
            ? "UK (no photo, reverse chronological, include right-to-work note if applicable)"
            : "UAE/Dubai (professional tone, include nationality if helpful, metric-rich bullets)";
        try {
            const raw = await claude(`Elite ATS resume writer. Return ONLY valid JSON, no markdown, no backticks.
Target country format: ${country}
ATS rules: action verbs, quantify ALL achievements, keyword-dense summary naming the job title explicitly, standard section names, embed both acronyms and full terms.
Input: Name:${form.name}|Email:${form.email}|Phone:${form.phone}|Location:${form.location}|LinkedIn:${form.linkedin}|Portfolio:${form.portfolio}|Title:${form.jobTitle}|Industry:${form.targetIndustry}|Country:${form.targetCountry}|Summary:${form.summary}|Exp:${JSON.stringify(form.experience)}|Edu:${JSON.stringify(form.education)}|Skills:${form.skills}|Certs:${form.certifications}
JSON: {"name":"","email":"","phone":"","location":"","linkedin":"","portfolio":"","jobTitle":"","summary":"3-sentence ATS summary naming job title","experience":[{"company":"","role":"","duration":"","bullets":["action verb+task+metric","...","..."]}],"education":[{"school":"","degree":"","year":"","gpa":""}],"skills":["up to 14"],"certifications":["..."],"atsKeywords":["top 6"],"atsScore":92,"atsTips":["tip1","tip2","tip3"]}`, 1000);
            clearTimeout(t1); clearTimeout(t2);
            const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
            setGP(4);
            setTimeout(()=>{ setResume(parsed); setATS(parsed); setGen(false); setSaved(s=>[{id:Date.now(), name:`${parsed.jobTitle} CV`, updated:"Just now", score:parsed.atsScore||92},...s]); }, 500);
        } catch(e) {
            clearTimeout(t1); clearTimeout(t2);
            alert("Generation failed. Please try again."); setRStep(3); setGen(false);
        }
    }

    // ─── GENERATE COVER LETTER ────────────────────────────────
    async function generateCoverLetter() {
        if (!isPro) return; setTL("cl"); setCL(null);
        try {
            const t = await claude(`Write a professional cover letter for ${form.name} applying for ${resume.jobTitle}${form.targetCompany?` at ${form.targetCompany}`:""} in ${form.targetCountry==="uk"?"the UK":"Dubai/UAE"}.
Resume context: ${JSON.stringify({summary:resume.summary,experience:resume.experience?.slice(0,2),skills:resume.skills?.slice(0,6)})}
4 paragraphs: (1) strong opener with role and enthusiasm (2) top 2 achievements with metrics (3) skills alignment (4) confident close with call to action.
Use ${form.name} as signatory. Address "Hiring Manager". Under 350 words. Professional, warm tone. Return ONLY the letter text.`, 800);
            setCL(t.trim());
        } catch(e) { setCL("Failed to generate. Please try again."); }
        setTL(null);
    }

    // ─── GENERATE LINKEDIN ────────────────────────────────────
    async function generateLinkedIn() {
        if (!isPro) return; setTL("li"); setLI(null);
        try {
            const t = await claude(`Generate LinkedIn profile content for ${form.name}, a ${resume.jobTitle} targeting ${form.targetCountry==="uk"?"UK":"UAE/Dubai"} roles.
Context: ${JSON.stringify({summary:resume.summary,skills:resume.skills,experience:resume.experience?.slice(0,2)})}
Return ONLY valid JSON:
{"headline":"LinkedIn headline under 220 chars — role | key skill | value prop","about":"LinkedIn About section, 2600 chars max. Hook first line. 3-4 paragraphs: expertise, achievements with metrics, passion, CTA. First-person. Avoid buzzwords.","skills":["top 10 LinkedIn keyword skills for this role in UK/UAE market"]}`, 800);
            setLI(JSON.parse(t.replace(/```json|```/g,"").trim()));
        } catch(e) { setLI({headline:"Failed.",about:"Please try again.",skills:[]}); }
        setTL(null);
    }

    // ─── GENERATE INTERVIEW FEEDBACK ─────────────────────────
    async function getFeedback(q, idx) {
        const ans = answers[idx]; if (!ans?.trim()) return;
        setFBL(idx);
        try {
            const t = await claude(`You are an expert interview coach for UK and UAE job markets. Give concise feedback on this interview answer.
Question: "${q}"
Answer: "${ans}"
Give: (1) What's strong (2) What to improve (3) One rewritten sentence that's stronger.
Keep it under 120 words. Be direct and encouraging.`);
            setFeedback(f => ({...f, [idx]:t.trim()}));
        } catch(e) { setFeedback(f => ({...f, [idx]:"Could not load feedback."})); }
        setFBL(null);
    }

    // ─── DOWNLOAD PDF ─────────────────────────────────────────
    async function downloadPDF() {
        setDL(true);
        try {
            await new Promise((res,rej)=>{
                if (window.html2pdf) return res();
                const s=document.createElement("script");
                s.src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
                s.onload=res; s.onerror=rej; document.head.appendChild(s);
            });
            await window.html2pdf().set({
                margin:0, filename:`${(resume.name||"Resume").replace(/\s+/g,"_")}_HireReady_ATS.pdf`,
                image:{type:"jpeg",quality:.98},
                html2canvas:{scale:2,useCORS:true,backgroundColor:"#fff"},
                jsPDF:{unit:"mm",format:"a4",orientation:"portrait"},
            }).from(resumeRef.current).save();
        } catch(e) { alert("PDF failed. Please try again."); }
        setDL(false);
    }

    // ─── SWITCH TAB ───────────────────────────────────────────
    function switchTab(t) {
        if (!isPro && t!=="resume") return;
        setTab(t);
        if (t==="cl" && !coverLetter && !tabLoading) generateCoverLetter();
        if (t==="li" && !linkedin && !tabLoading) generateLinkedIn();
    }

    // ─── JOB FILTERING ────────────────────────────────────────
    const filteredJobs = ALL_JOBS.filter(j => {
        if (jobFilter==="uk"  && j.country!=="uk")  return false;
        if (jobFilter==="uae" && j.country!=="uae") return false;
        if (sponsorOnly && !j.sponsored) return false;
        if (jobSearch && !j.title.toLowerCase().includes(jobSearch.toLowerCase()) &&
            !j.company.toLowerCase().includes(jobSearch.toLowerCase()) &&
            !j.tags.some(t=>t.toLowerCase().includes(jobSearch.toLowerCase()))) return false;
        return true;
    });

    // ─── ADD APP TO TRACKER ───────────────────────────────────
    function addApp(col) {
        if (!newApp.title) return;
        setApps(a => ({...a,[col]:[{id:Date.now(),...newApp,date:"Today"},...a[col]]}));
        setNewApp({title:"",company:"",location:""}); setAddingTo(null);
    }

    // ═══════════════════════════════════════════════════════════
    //  NAV ITEMS
    // ═══════════════════════════════════════════════════════════
    const NAV = [
        { id:"dashboard",  icon:"🏠", label:"Dashboard" },
        { id:"resume",     icon:"📄", label:"Resume Builder" },
        { id:"jobs",       icon:"💼", label:"Job Board",    badge: filteredJobs.length },
        { id:"tracker",    icon:"📊", label:"App Tracker" },
        { id:"interview",  icon:"🎤", label:"Interview Prep" },
        { id:"visa",       icon:"🌍", label:"Visa Guide" },
    ];

    const totalApps = Object.values(apps).flat().length;

    // ═══════════════════════════════════════════════════════════
    //  RENDER
    // ═══════════════════════════════════════════════════════════
    return (
        <>
            <style>{CSS}</style>
            <div className="shell">

                {/* ── SIDEBAR ── */}
                <div className="sidebar">
                    <div className="sb-logo">
                        <div className="sb-logo-icon">H</div>
                        <div className="sb-logo-text">Hire<em>Ready</em></div>
                    </div>
                    <div className="sb-user">
                        <div className="sb-avatar">{user.initials}</div>
                        <div>
                            <div className="sb-uname">{user.name}</div>
                            <div className="sb-plan">{isPro ? "✦ Pro Member" : "Free Plan"}</div>
                        </div>
                    </div>
                    <div className="sb-nav">
                        {NAV.map(n => (
                            <div key={n.id} className={`ni ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
                                <span className="ni-icon">{n.icon}</span>
                                {n.label}
                                {n.badge && <span className="ni-badge">{n.badge}</span>}
                            </div>
                        ))}
                    </div>
                    <div className="sb-footer">
                        {!isPro ? (
                            <div className="sb-pro-box">
                                <strong>✦ Upgrade to Pro</strong>
                                <p>PDF downloads · Cover letters · LinkedIn optimizer · ATS score</p>
                                <button className="btn btn-gold btn-sm" style={{width:"100%"}} onClick={()=>{alert("Connect Stripe here!\n\nCreate a subscription product at the price below.\nOn success → setIsPro(true)");setIsPro(true);}}>
                                    {currency.symbol}{currency.price}/mo
                                </button>
                            </div>
                        ) : (
                            <div className="sb-pro-box">
                                <strong style={{color:"var(--green)"}}>✓ Pro Active</strong>
                                <p style={{color:"var(--muted)"}}>All features unlocked. {currency.symbol}{currency.price}/mo</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── MAIN ── */}
                <div className="main">
                    <div className="topbar">
                        <div className="topbar-title">
                            {page==="dashboard" && <>Welcome back, <em>{user.name.split(" ")[0]}</em> 👋</>}
                            {page==="resume"    && <>Resume <em>Builder</em></>}
                            {page==="jobs"      && <>Job <em>Board</em></>}
                            {page==="tracker"   && <>Application <em>Tracker</em></>}
                            {page==="interview" && <>Interview <em>Prep</em></>}
                            {page==="visa"      && <>Visa <em>Guide</em></>}
                        </div>
                        <div className="topbar-right">
                            <div className="market-pills">
                                <span className="mk-pill mk-uk">🇬🇧 UK</span>
                                <span className="mk-pill mk-uae">🇦🇪 Dubai</span>
                            </div>
                        </div>
                    </div>

                    {/* ════ DASHBOARD ════ */}
                    {page==="dashboard" && (
                        <div className="page">
                            <div className="stats-grid">
                                <div className="stat-card purple">
                                    <div className="stat-icon">📄</div>
                                    <div className="stat-val">{savedResumes.length}</div>
                                    <div className="stat-label">Saved Resumes</div>
                                    <div className="stat-note">↑ Last updated today</div>
                                </div>
                                <div className="stat-card blue">
                                    <div className="stat-icon">📨</div>
                                    <div className="stat-val">{totalApps}</div>
                                    <div className="stat-label">Applications Tracked</div>
                                    <div className="stat-note">↑ {apps.Interview.length} in interview stage</div>
                                </div>
                                <div className="stat-card green">
                                    <div className="stat-icon">💼</div>
                                    <div className="stat-val">{ALL_JOBS.filter(j=>j.sponsored).length}</div>
                                    <div className="stat-label">Visa Sponsorship Jobs</div>
                                    <div className="stat-note">UK + Dubai combined</div>
                                </div>
                                <div className="stat-card gold">
                                    <div className="stat-icon">🎯</div>
                                    <div className="stat-val">{resume?.atsScore||"–"}</div>
                                    <div className="stat-label">Your ATS Score</div>
                                    <div className="stat-note">{resume ? "Last resume generated" : "Generate a resume first"}</div>
                                </div>
                            </div>

                            <div className="quick-actions">
                                {[
                                    { icon:"✨", label:"Build Resume",     sub:"AI-powered, ATS-ready",     pg:"resume"    },
                                    { icon:"💼", label:"Browse Jobs",      sub:`${ALL_JOBS.length} live roles`, pg:"jobs"  },
                                    { icon:"📊", label:"Track Apps",       sub:`${totalApps} tracked`,        pg:"tracker"  },
                                    { icon:"🎤", label:"Practice Interview",sub:"AI feedback on answers",     pg:"interview" },
                                ].map(q=>(
                                    <div key={q.pg} className="qa-card" onClick={()=>setPage(q.pg)}>
                                        <div className="qa-icon">{q.icon}</div>
                                        <div style={{fontSize:13,fontWeight:700,marginBottom:3}}>{q.label}</div>
                                        <div style={{fontSize:11,color:"var(--muted)"}}>{q.sub}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="sec-hd">
                                <div><div className="sec-title">Saved Resumes</div><div className="sec-sub">Your AI-generated CVs</div></div>
                                <button className="btn btn-accent btn-sm" onClick={()=>setPage("resume")}>+ New Resume</button>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
                                {savedResumes.map(r=>(
                                    <div key={r.id} className="card-sm" style={{display:"flex",alignItems:"center",gap:14}}>
                                        <div style={{fontSize:22}}>📄</div>
                                        <div style={{flex:1}}>
                                            <div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{r.name}</div>
                                            <div style={{fontSize:11,color:"var(--muted)"}}>Updated {r.updated}</div>
                                        </div>
                                        <div style={{background:"var(--green-bg)",border:"1px solid var(--green-b)",color:"var(--green)",fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:100}}>ATS {r.score}%</div>
                                        <button className="btn btn-ghost btn-xs" onClick={()=>setPage("resume")}>Edit</button>
                                    </div>
                                ))}
                            </div>

                            <div className="sec-hd">
                                <div><div className="sec-title">Recent Activity</div></div>
                            </div>
                            <div className="activity-list">
                                {[
                                    { icon:"✅", bg:"var(--green-bg)", title:"Applied to Product Manager at Noon",     sub:"Dubai, UAE · Employment Visa Sponsored", time:"2h ago" },
                                    { icon:"🎤", bg:"#1a1a2e",          title:"Interview scheduled with DeepMind",      sub:"London, UK · Skilled Worker Sponsor",     time:"Yesterday" },
                                    { icon:"📄", bg:"#1a0a2e",          title:"Resume updated — Software Engineer CV",  sub:"ATS Score: 94%",                          time:"2 days ago" },
                                ].map((a,i)=>(
                                    <div key={i} className="activity-item">
                                        <div className="activity-icon" style={{background:a.bg}}>{a.icon}</div>
                                        <div className="activity-body">
                                            <div className="activity-title">{a.title}</div>
                                            <div className="activity-sub">{a.sub}</div>
                                        </div>
                                        <div className="activity-time">{a.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ════ RESUME BUILDER ════ */}
                    {page==="resume" && (
                        <div className="page">
                            {/* Step indicators */}
                            {(rStep < 4 || generating) && (
                                <div className="rsteps">
                                    {["Personal","Experience","Education","Skills","Result"].map((s,i)=>(
                                        <div key={s} className={`rstep ${i===rStep?"active":i<rStep?"done":""}`}>
                                            {i<rStep?`✓ ${s}`:`${i+1}. ${s}`}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* STEP 0 */}
                            {rStep===0 && (
                                <div className="card">
                                    <h2 style={{fontFamily:"Lora,serif",fontSize:24,marginBottom:6}}>Personal Information</h2>
                                    <p style={{color:"var(--muted)",fontSize:13,marginBottom:28}}>ATS systems parse this first — be precise.</p>
                                    <div className="form-row">
                                        <div className="fg"><label>Full Name</label><input value={form.name} onChange={e=>upd("name",e.target.value)} placeholder="Alex Johnson" /></div>
                                        <div className="fg"><label>Target Job Title</label><input value={form.jobTitle} onChange={e=>upd("jobTitle",e.target.value)} placeholder="Senior Software Engineer" /></div>
                                        <div className="fg">
                                            <label>Target Country</label>
                                            <select value={form.targetCountry} onChange={e=>upd("targetCountry",e.target.value)}>
                                                <option value="uk">🇬🇧 United Kingdom</option>
                                                <option value="uae">🇦🇪 Dubai / UAE</option>
                                            </select>
                                        </div>
                                        <div className="fg">
                                            <label>Target Industry</label>
                                            <select value={form.targetIndustry} onChange={e=>upd("targetIndustry",e.target.value)}>
                                                <option value="">Select...</option>
                                                {["Technology","Finance","Healthcare","Marketing","Sales","Design","Operations","Engineering","Education","Consulting","Legal","HR","Real Estate","Other"].map(x=><option key={x}>{x}</option>)}
                                            </select>
                                        </div>
                                        <div className="fg"><label>Email</label><input type="email" value={form.email} onChange={e=>upd("email",e.target.value)} placeholder="alex@email.com" /></div>
                                        <div className="fg"><label>Phone</label><input value={form.phone} onChange={e=>upd("phone",e.target.value)} placeholder={form.targetCountry==="uk"?"+44 7700 000000":"+971 50 000 0000"} /></div>
                                        <div className="fg"><label>Location</label><input value={form.location} onChange={e=>upd("location",e.target.value)} placeholder={form.targetCountry==="uk"?"London, UK":"Dubai, UAE"} /></div>
                                        <div className="fg"><label>LinkedIn URL</label><input value={form.linkedin} onChange={e=>upd("linkedin",e.target.value)} placeholder="linkedin.com/in/alexjohnson" /></div>
                                        <div className="fg full"><label>Target Company (optional)</label><input value={form.targetCompany} onChange={e=>upd("targetCompany",e.target.value)} placeholder="Revolut, Noon, Careem..." /></div>
                                        <div className="fg full">
                                            <label>About You (rough notes)</label>
                                            <textarea value={form.summary} onChange={e=>upd("summary",e.target.value)} placeholder="Years of experience, main strengths, biggest wins, what role you're targeting... AI polishes everything." />
                                            <div className="hint">💡 The more detail you give, the stronger your AI-generated summary will be.</div>
                                        </div>
                                    </div>
                                    <div className="nav-row">
                                        <button className="btn btn-accent" style={{flex:1}} onClick={()=>setRStep(1)} disabled={!form.name||!form.email||!form.jobTitle}>Next: Work Experience →</button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 1 */}
                            {rStep===1 && (
                                <div className="card">
                                    <h2 style={{fontFamily:"Lora,serif",fontSize:24,marginBottom:6}}>Work Experience</h2>
                                    <p style={{color:"var(--muted)",fontSize:13,marginBottom:28}}>Rough notes are fine — AI writes achievement-based bullets with metrics.</p>
                                    {form.experience.map((exp,i)=>(
                                        <div className="eblock" key={i}>
                                            <div className="eblock-hd">
                                                <div className="eblock-label">Position {i+1}</div>
                                                {i>0 && <button className="btn-rm" onClick={()=>rmE(i)}>Remove</button>}
                                            </div>
                                            <div className="form-row">
                                                <div className="fg"><label>Company</label><input value={exp.company} onChange={e=>updE(i,"company",e.target.value)} placeholder="Revolut" /></div>
                                                <div className="fg"><label>Your Title</label><input value={exp.role} onChange={e=>updE(i,"role",e.target.value)} placeholder="Software Engineer" /></div>
                                                <div className="fg full"><label>Duration</label><input value={exp.duration} onChange={e=>updE(i,"duration",e.target.value)} placeholder="Jan 2022 – Present" /></div>
                                                <div className="fg full">
                                                    <label>What did you do? (rough notes)</label>
                                                    <textarea value={exp.description} onChange={e=>updE(i,"description",e.target.value)} placeholder="Built features, cut load time by fixing slow DB queries, managed 3 devs, launched product used by 10k users..." style={{minHeight:100}} />
                                                    <div className="hint">💡 Any numbers or outcomes — even estimates — help AI add powerful metrics.</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="btn-add-more" onClick={addE}>+ Add Another Position</button>
                                    <div className="nav-row">
                                        <button className="btn btn-ghost" onClick={()=>setRStep(0)}>← Back</button>
                                        <button className="btn btn-accent" style={{flex:1}} onClick={()=>setRStep(2)}>Next: Education →</button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2 */}
                            {rStep===2 && (
                                <div className="card">
                                    <h2 style={{fontFamily:"Lora,serif",fontSize:24,marginBottom:6}}>Education</h2>
                                    <p style={{color:"var(--muted)",fontSize:13,marginBottom:28}}>ATS systems scan for degree keywords — be accurate.</p>
                                    {form.education.map((edu,i)=>(
                                        <div className="eblock" key={i}>
                                            <div className="eblock-hd">
                                                <div className="eblock-label">Education {i+1}</div>
                                                {i>0 && <button className="btn-rm" onClick={()=>rmU(i)}>Remove</button>}
                                            </div>
                                            <div className="form-row">
                                                <div className="fg"><label>University / School</label><input value={edu.school} onChange={e=>updU(i,"school",e.target.value)} placeholder="Imperial College London" /></div>
                                                <div className="fg"><label>Graduation Year</label><input value={edu.year} onChange={e=>updU(i,"year",e.target.value)} placeholder="2022" /></div>
                                                <div className="fg"><label>Degree & Major</label><input value={edu.degree} onChange={e=>updU(i,"degree",e.target.value)} placeholder="B.Sc. Computer Science" /></div>
                                                <div className="fg"><label>Grade / GPA (optional)</label><input value={edu.gpa} onChange={e=>updU(i,"gpa",e.target.value)} placeholder="First Class / 3.8 GPA" /></div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="btn-add-more" onClick={addU}>+ Add Another</button>
                                    <div className="nav-row">
                                        <button className="btn btn-ghost" onClick={()=>setRStep(1)}>← Back</button>
                                        <button className="btn btn-accent" style={{flex:1}} onClick={()=>setRStep(3)}>Next: Skills →</button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3 */}
                            {rStep===3 && (
                                <div className="card">
                                    <h2 style={{fontFamily:"Lora,serif",fontSize:24,marginBottom:6}}>Skills & Certifications</h2>
                                    <p style={{color:"var(--muted)",fontSize:13,marginBottom:28}}>Critical for ATS — more relevant keywords = higher match score.</p>
                                    <div className="fg">
                                        <label>Skills (comma separated)</label>
                                        <textarea value={form.skills} onChange={e=>upd("skills",e.target.value)} placeholder="React, Node.js, Python, AWS, SQL, Agile, Figma, TypeScript, Docker, Team Leadership..." style={{minHeight:100}} />
                                        <div className="hint">💡 Include both technical and soft skills. AI selects the most ATS-relevant ones for {form.targetCountry==="uk"?"UK":"UAE"} market.</div>
                                    </div>
                                    <hr className="divider" />
                                    <div className="fg">
                                        <label>Certifications (optional)</label>
                                        <textarea value={form.certifications} onChange={e=>upd("certifications",e.target.value)} placeholder="AWS Solutions Architect, Google Analytics, Prince2, CFA..." style={{minHeight:68}} />
                                    </div>
                                    <div className="nav-row">
                                        <button className="btn btn-ghost" onClick={()=>setRStep(2)}>← Back</button>
                                        <button className="btn btn-accent" style={{flex:1}} onClick={generateResume} disabled={!form.skills}>✨ Generate ATS Resume</button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: GENERATING */}
                            {rStep===4 && generating && (
                                <div className="card">
                                    <div className="gen-wrap">
                                        <div className="gen-ring" />
                                        <strong>Building Your Resume...</strong>
                                        <p>AI is writing powerful, ATS-optimized content<br />tailored for the {form.targetCountry==="uk"?"UK":"UAE/Dubai"} job market.</p>
                                        <div className="gen-steps">
                                            {["Analysing your experience & target role","Writing ATS-optimized bullet points with metrics","Embedding UK/UAE market keywords","Running ATS compatibility check"].map((l,i)=>(
                                                <div key={i} className={`gs ${genPhase===i+1?"on":genPhase>i+1?"done":""}`}>
                                                    <span className="gs-icon">{genPhase===i+1?"⟳":genPhase>i+1?"✓":"○"}</span> {l}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: RESULTS */}
                            {rStep===4 && !generating && resume && (
                                <>
                                    {!isPro && (
                                        <div className="paywall-banner">
                                            <div className="pw-info">
                                                <h3>Unlock Your Full Career Suite</h3>
                                                <p>Your resume is ready. Subscribe to download it + get AI cover letter, LinkedIn optimizer, and detailed ATS analysis.</p>
                                                <div className="pw-features">
                                                    <div className="pw-feat">✓ Unlimited PDF resume downloads</div>
                                                    <div className="pw-feat">✓ AI Cover Letter per application</div>
                                                    <div className="pw-feat">✓ LinkedIn headline + About section</div>
                                                    <div className="pw-feat">✓ Detailed ATS Score + tips</div>
                                                </div>
                                            </div>
                                            <div className="pw-right">
                                                <div>
                                                    <div className="pw-price">{currency.symbol}{currency.price}</div>
                                                    <div className="pw-price-sub">per month · cancel anytime</div>
                                                </div>
                                                <button className="btn btn-gold" onClick={()=>{alert(`Connect Stripe here!\nPrice: ${currency.symbol}${currency.price}/month (${currency.code})\nOn payment success → setIsPro(true)`);setIsPro(true);}}>
                                                    🚀 Subscribe — {currency.monthly}
                                                </button>
                                                <div className="pw-secure">🔒 Stripe · Auto-detects {currency.code} · Cancel anytime</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* RESULT TABS */}
                                    <div className="result-tabs">
                                        {[
                                            {id:"resume",label:"📄 Resume"},
                                            {id:"ats",   label:"🎯 ATS Score", pro:true},
                                            {id:"cl",    label:"✉️ Cover Letter",pro:true},
                                            {id:"li",    label:"💼 LinkedIn",   pro:true},
                                        ].map(t=>(
                                            <button key={t.id} className={`rtab ${activeTab===t.id?"active":""} ${t.pro&&!isPro?"rtab-locked":""}`}
                                                    onClick={()=>switchTab(t.id)} title={t.pro&&!isPro?"Subscribe to unlock":""}>
                                                {t.label} {t.pro&&<span className="pro-tag">PRO</span>} {t.pro&&!isPro&&"🔒"}
                                            </button>
                                        ))}
                                    </div>

                                    {/* RESUME TAB */}
                                    {activeTab==="resume" && (
                                        <div className="blur-wrap">
                                            {!isPro && (
                                                <div className="blur-overlay">
                                                    <p>Subscribe to download your ATS resume as a clean PDF</p>
                                                    <button className="btn btn-gold" onClick={()=>{alert("Connect Stripe!");setIsPro(true);}}>🚀 Subscribe to Download</button>
                                                </div>
                                            )}
                                            <div className={!isPro?"blur-inner":""}>
                                                <div className="r-shell" ref={resumeRef}>
                                                    <div className="r-top">
                                                        <div className="r-name">{resume.name}</div>
                                                        <div className="r-title-line">{resume.jobTitle}</div>
                                                        <div className="r-contacts">
                                                            {resume.email    && <span>✉ {resume.email}</span>}
                                                            {resume.phone    && <span>☏ {resume.phone}</span>}
                                                            {resume.location && <span>◎ {resume.location}</span>}
                                                            {resume.linkedin && <span>in {resume.linkedin}</span>}
                                                            {resume.portfolio&& <span>⬡ {resume.portfolio}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="r-body">
                                                        <div className="r-sidebar">
                                                            {resume.skills?.length>0 && <div className="r-sec"><div className="r-sec-t">Core Skills</div>{resume.skills.map((s,i)=><div className="r-skill" key={i}>{s}</div>)}</div>}
                                                            {resume.education?.length>0 && <div className="r-sec" style={{marginTop:16}}><div className="r-sec-t">Education</div>{resume.education.map((e,i)=><div className="r-edu" key={i}><div className="r-edu-deg">{e.degree}</div><div className="r-edu-sch">{e.school}</div><div className="r-edu-yr">{e.year}{e.gpa?` · ${e.gpa}`:""}</div></div>)}</div>}
                                                            {resume.certifications?.length>0 && <div className="r-sec" style={{marginTop:16}}><div className="r-sec-t">Certifications</div>{resume.certifications.map((c,i)=><div className="r-cert" key={i}>{c}</div>)}</div>}
                                                        </div>
                                                        <div className="r-main">
                                                            {resume.summary && <div className="r-sec"><div className="r-sec-t">Professional Summary</div><p className="r-summary-txt">{resume.summary}</p></div>}
                                                            {resume.experience?.length>0 && <div className="r-sec"><div className="r-sec-t">Work Experience</div>{resume.experience.map((exp,i)=><div className="r-exp" key={i}><div className="r-exp-hd"><div className="r-role">{exp.role}</div><div className="r-dur">{exp.duration}</div></div><div className="r-company">{exp.company}</div><ul className="r-buls">{exp.bullets?.map((b,j)=><li className="r-bul" key={j}>{b}</li>)}</ul></div>)}</div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {isPro && <div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}><button className="dl-btn" onClick={downloadPDF} disabled={downloading}>{downloading?"⟳ Generating...":"⬇ Download PDF"}</button></div>}
                                        </div>
                                    )}

                                    {/* ATS TAB */}
                                    {activeTab==="ats" && isPro && atsData && (
                                        <div className="ats-wrap">
                                            <div className="ats-top">
                                                <ATSRing score={atsData.atsScore||92} />
                                                <div>
                                                    <div style={{fontFamily:"Lora,serif",fontSize:20,fontWeight:700,marginBottom:5}}>ATS Compatibility Score</div>
                                                    <p style={{color:"var(--muted)",fontSize:13,lineHeight:1.6}}>Your resume is highly optimised for {form.targetCountry==="uk"?"UK":"UAE/Dubai"} ATS systems.<br />Breakdown below.</p>
                                                </div>
                                            </div>
                                            <div className="ats-grid">
                                                {[["Action Verbs","✓ Excellent"],["Keyword Density","✓ High"],["Quantified Results","✓ Present"],["Section Headings","✓ Standard"],["Contact Info","✓ Complete"],["Market Fit",`✓ ${form.targetCountry==="uk"?"UK":"UAE"} Optimised`]].map(([l,v])=>(
                                                    <div className="ats-item" key={l}><div className="ats-item-label">{l}</div><div className="ats-item-val good">{v}</div></div>
                                                ))}
                                            </div>
                                            <div style={{marginBottom:8,fontSize:11,color:"var(--muted)",letterSpacing:"1px",textTransform:"uppercase",fontWeight:700}}>Top ATS Keywords Detected</div>
                                            <div className="ats-kw-wrap">{(atsData.atsKeywords||[]).map((k,i)=><span className="ats-kw" key={i}>{k}</span>)}</div>
                                            {atsData.atsTips?.length>0 && <div className="ats-tips" style={{marginTop:18}}><div style={{fontSize:11,color:"var(--muted)",letterSpacing:"1px",textTransform:"uppercase",fontWeight:700,marginBottom:10}}>Tips to Push Score Higher</div>{atsData.atsTips.map((t,i)=><div className="ats-tip" key={i}>{t}</div>)}</div>}
                                        </div>
                                    )}

                                    {/* COVER LETTER TAB */}
                                    {activeTab==="cl" && isPro && (
                                        <div className="cl-wrap">
                                            <div className="cl-hd"><div style={{fontFamily:"Lora,serif",fontSize:20,fontWeight:700}}>AI Cover Letter</div>{coverLetter&&<CopyBtn text={coverLetter}/>}</div>
                                            {tabLoading==="cl"||!coverLetter ? <div className="cl-loading">⟳ Writing your personalised cover letter...</div> : <div className="cl-body">{coverLetter}</div>}
                                        </div>
                                    )}

                                    {/* LINKEDIN TAB */}
                                    {activeTab==="li" && isPro && (
                                        <div className="li-wrap">
                                            {tabLoading==="li"||!linkedin ? <div className="cl-loading">⟳ Optimising your LinkedIn profile...</div> : (
                                                <>
                                                    <div className="li-sec">
                                                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><h4>LinkedIn Headline</h4><CopyBtn text={linkedin.headline}/></div>
                                                        <div className="li-content">{linkedin.headline}</div>
                                                        <div className="li-charcount">{linkedin.headline?.length||0} / 220 chars</div>
                                                    </div>
                                                    <div className="li-sec">
                                                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><h4>About Section</h4><CopyBtn text={linkedin.about}/></div>
                                                        <div className="li-content">{linkedin.about}</div>
                                                        <div className="li-charcount">{linkedin.about?.length||0} / 2,600 chars</div>
                                                    </div>
                                                    {linkedin.skills?.length>0 && <div className="li-sec"><h4>Recommended Skills to Add</h4><div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:10}}>{linkedin.skills.map((s,i)=><span className="ats-kw" key={i}>{s}</span>)}</div></div>}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <div style={{textAlign:"center",marginTop:16}}>
                                        <button style={{background:"none",border:"none",color:"var(--muted)",fontFamily:"Plus Jakarta Sans,sans-serif",fontSize:13,cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3}}
                                                onClick={()=>{setRStep(0);setResume(null);setCL(null);setLI(null);setATS(null);setTab("resume");setGP(0);}}>
                                            ← Start a new resume
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ════ JOB BOARD ════ */}
                    {page==="jobs" && (
                        <div className="page">
                            <div className="sec-hd" style={{marginBottom:18}}>
                                <div>
                                    <div className="sec-title">Live Job Board</div>
                                    <div className="sec-sub">🇬🇧 UK + 🇦🇪 Dubai — updated daily</div>
                                </div>
                                <input style={{maxWidth:240,borderRadius:100,padding:"9px 16px"}} placeholder="🔍 Search jobs..." value={jobSearch} onChange={e=>setJS(e.target.value)} />
                            </div>
                            <div className="job-filters">
                                {[["all","All Markets"],["uk","🇬🇧 UK Only"],["uae","🇦🇪 Dubai Only"]].map(([v,l])=>(
                                    <div key={v} className={`fpill ${jobFilter===v?(v==="uk"?"uk-on":v==="uae"?"uae-on":"on"):""}`} onClick={()=>setJF(v)}>{l}</div>
                                ))}
                                <div className={`fpill ${sponsorOnly?"sp-on":""}`} onClick={()=>setSO(s=>!s)}>
                                    {sponsorOnly?"✓ ":""}Visa Sponsorship Only
                                </div>
                                <div style={{marginLeft:"auto",fontSize:12,color:"var(--muted)"}}>{filteredJobs.length} roles found</div>
                            </div>
                            <div className="jobs-list">
                                {filteredJobs.length===0 ? (
                                    <div className="empty-state"><div className="e-icon">🔍</div><p>No jobs match your filters. Try broadening your search.</p></div>
                                ) : filteredJobs.map(j=>(
                                    <div key={j.id} className="jcard">
                                        <div className="jlogo" style={{background:j.color}}>{j.logo}</div>
                                        <div className="jbody">
                                            <div className="jtitle">{j.title}</div>
                                            <div className="jmeta">
                                                <span>{j.company}</span>
                                                <span>·</span>
                                                <span>{j.location}</span>
                                                <span className={`country-tag ${j.country}`}>{j.country==="uk"?"🇬🇧 UK":"🇦🇪 UAE"}</span>
                                            </div>
                                            <div className="jtags">{j.tags.map(t=><span className="jtag" key={t}>{t}</span>)}</div>
                                        </div>
                                        <div className="jright">
                                            <div className="jsalary">{j.salary}</div>
                                            <span className={`visa-badge ${j.sponsored?"sponsored":"no-sponsor"}`}>
                        {j.sponsored ? `✓ ${j.visa}` : "No Sponsorship"}
                      </span>
                                            <div className="jposted">{j.posted}</div>
                                            <button className="btn btn-accent btn-xs" onClick={()=>{
                                                setApps(a=>({...a,Wishlist:[{id:Date.now(),title:j.title,company:j.company,location:j.location,date:"Today"},...a.Wishlist]}));
                                                alert(`Added "${j.title} at ${j.company}" to your tracker!\nView it in Application Tracker.`);
                                            }}>Save + Track</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ════ APPLICATION TRACKER ════ */}
                    {page==="tracker" && (
                        <div className="page">
                            <div className="sec-hd">
                                <div><div className="sec-title">Application Tracker</div><div className="sec-sub">{totalApps} applications tracked</div></div>
                            </div>
                            <div className="tracker-board">
                                {Object.entries(apps).map(([col, items])=>{
                                    const st = STATUS_STYLES[col];
                                    return (
                                        <div className="t-col" key={col}>
                                            <div className="t-col-hd">
                                                <div className="t-col-title" style={{color:st.text}}>{col}</div>
                                                <div className="t-count" style={{background:st.bg,color:st.text,border:`1px solid ${st.border}`}}>{items.length}</div>
                                            </div>
                                            {items.map(app=>(
                                                <div className="app-card" key={app.id}>
                                                    <div className="app-card-title">{app.title}</div>
                                                    <div className="app-card-co">{app.company}</div>
                                                    <div className="app-card-loc">📍 {app.location}</div>
                                                    <div className="app-card-date">{app.date}</div>
                                                </div>
                                            ))}
                                            {addingTo===col ? (
                                                <div className="add-app-form">
                                                    <input placeholder="Job title" value={newApp.title} onChange={e=>setNewApp(a=>({...a,title:e.target.value}))} style={{marginBottom:6}} />
                                                    <input placeholder="Company" value={newApp.company} onChange={e=>setNewApp(a=>({...a,company:e.target.value}))} style={{marginBottom:6}} />
                                                    <input placeholder="Location (UK/Dubai)" value={newApp.location} onChange={e=>setNewApp(a=>({...a,location:e.target.value}))} style={{marginBottom:8}} />
                                                    <div style={{display:"flex",gap:6}}>
                                                        <button className="btn btn-accent btn-xs" style={{flex:1}} onClick={()=>addApp(col)}>Add</button>
                                                        <button className="btn btn-ghost btn-xs" onClick={()=>setAddingTo(null)}>Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button className="add-app" onClick={()=>setAddingTo(col)}>+ Add</button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ════ INTERVIEW PREP ════ */}
                    {page==="interview" && (
                        <div className="page">
                            <div className="sec-hd">
                                <div><div className="sec-title">Interview Prep</div><div className="sec-sub">Practice answers · Get AI feedback · UK & UAE specific questions</div></div>
                            </div>
                            <div className="iq-tabs">
                                {Object.keys(INTERVIEW_QS).map(cat=>(
                                    <div key={cat} className={`iq-tab ${iqCat===cat?"active":""}`} onClick={()=>setIQCat(cat)}>{cat}</div>
                                ))}
                            </div>
                            {INTERVIEW_QS[iqCat].map((q,idx)=>(
                                <div className="iq-card" key={idx}>
                                    <div className="iq-q">{q}</div>
                                    <div className="iq-textarea">
                    <textarea placeholder="Type your answer here — then click 'Get AI Feedback' to see how you did..."
                              value={answers[`${iqCat}-${idx}`]||""}
                              onChange={e=>setAnswers(a=>({...a,[`${iqCat}-${idx}`]:e.target.value}))}
                              style={{minHeight:90}} />
                                    </div>
                                    <div style={{display:"flex",alignItems:"center",gap:10,marginTop:10}}>
                                        <button className="btn btn-accent btn-sm"
                                                disabled={!answers[`${iqCat}-${idx}`]?.trim()||fbLoading===`${iqCat}-${idx}`}
                                                onClick={()=>getFeedback(q,`${iqCat}-${idx}`)}>
                                            {fbLoading===`${iqCat}-${idx}` ? "⟳ Analysing..." : "✨ Get AI Feedback"}
                                        </button>
                                        {answers[`${iqCat}-${idx}`] && <span style={{fontSize:12,color:"var(--muted)"}}>{answers[`${iqCat}-${idx}`].split(/\s+/).filter(Boolean).length} words</span>}
                                    </div>
                                    {feedback[`${iqCat}-${idx}`] && (
                                        <div className="ai-fb">
                                            <div className="ai-fb-title">✦ AI Coach Feedback</div>
                                            {feedback[`${iqCat}-${idx}`]}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ════ VISA GUIDE ════ */}
                    {page==="visa" && (
                        <div className="page">
                            <div className="sec-hd">
                                <div><div className="sec-title">Visa Guide</div><div className="sec-sub">Everything you need to know about working in the UK and Dubai</div></div>
                            </div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:28}}>
                                {Object.entries(VISA_INFO).map(([key,info])=>(
                                    <div key={key} className={`visa-card ${key}`}>
                                        <div className="visa-card-title">{key==="uk"?"🇬🇧":"🇦🇪"} {info.name}</div>
                                        <ul className="visa-points">
                                            {info.points.map((p,i)=><li key={i} className="visa-point">{p}</li>)}
                                        </ul>
                                        <div className="visa-tip">💡 {info.tip}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="card">
                                <div style={{fontFamily:"Lora,serif",fontSize:18,fontWeight:700,marginBottom:16}}>🔄 Moving Between UK ↔ Dubai?</div>
                                <p style={{color:"var(--muted)",fontSize:13,lineHeight:1.75,marginBottom:16}}>
                                    Many professionals move between London and Dubai throughout their careers. HireReady is built for exactly this journey — our job board covers both markets, our resume builder knows both CV formats, and our interview prep includes cross-cultural questions.
                                </p>
                                <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                                    <button className="btn btn-accent" onClick={()=>{setJF("uk");setPage("jobs");}}>Browse UK Jobs 🇬🇧</button>
                                    <button className="btn btn-accent" onClick={()=>{setJF("uae");setPage("jobs");}}>Browse Dubai Jobs 🇦🇪</button>
                                    <button className="btn btn-ghost" onClick={()=>setPage("resume")}>Build UK/UAE Resume ✨</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
