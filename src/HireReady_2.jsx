import { useState, useRef } from "react";

// ─── CONFIGURATION ──────────────────────────────────────────
const OWNER_EMAILS = ["sweety.tugnawat@gmail.com"]; // YOU: Full access, no paywalls
const TESTER_EMAILS = ["tester@gmail.com"]; // TESTERS: Full access for free

const CURRENCIES = {
    USD: { code: "USD", symbol: "$", price: "14.99", monthly: "$14.99/mo" },
    GBP: { code: "GBP", symbol: "£", price: "11.99", monthly: "£11.99/mo" },
    AED: { code: "AED", symbol: "AED", price: "54.99", monthly: "54.99/mo" }
};

const UK_JOBS = [
    { id:1,  title:"Senior Software Engineer",  company:"Revolut", location:"London, UK", salary:"£90k–£130k", sponsored:true, url: "https://www.revolut.com/careers"  },
    { id:2,  title:"Product Manager", company:"Monzo", location:"London, UK", salary:"£80k–£110k", sponsored:true, url: "https://monzo.com/careers"  }
];

const DUBAI_JOBS = [
    { id:13, title:"Senior Software Engineer", company:"Careem", location:"Dubai, UAE", salary:"AED 25k–35k/mo", sponsored:true, url: "https://careem.com/careers" },
    { id:14, title:"Product Manager", company:"Noon", location:"Dubai, UAE", salary:"AED 22k–30k/mo", sponsored:true, url: "https://noon.com/careers" }
];

const ALL_JOBS = [...UK_JOBS, ...DUBAI_JOBS];

// ─── STYLES ─────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
:root{
  --bg:#07070d;--s1:#0d0d16;--s2:#12121e;--border:#1e1e30;
  --text:#e4e0f4;--accent:#6c4fff;--gold:#e8a838;--green:#2ed573;
}
body{background:var(--bg);font-family:'Plus Jakarta Sans',sans-serif;color:var(--text);margin:0}
.auth-container{display:flex;align-items:center;justify-content:center;height:100vh;background:var(--bg)}
.auth-card{background:var(--s1);padding:40px;border-radius:20px;border:1px solid var(--border);width:100%;max-width:400px;text-align:center}
.shell{display:flex;min-height:100vh}
.sidebar{width:250px;background:var(--s1);border-right:1px solid var(--border);position:fixed;height:100vh;display:flex;flex-direction:column}
.main{margin-left:250px;flex:1;padding:20px}
.card{background:var(--s1);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:20px}
.btn{padding:12px 24px;border-radius:100px;font-weight:600;cursor:pointer;border:none;transition:0.2s;text-decoration:none;display:inline-block}
.btn-accent{background:var(--accent);color:#fff}
.btn-gold{background:var(--gold);color:#000}
.btn-green{background:var(--green);color:#000}
.input-field{background:var(--s2);border:1px solid var(--border);padding:12px;border-radius:10px;color:#fff;width:100%;margin-bottom:15px;box-sizing:border-box}
.ni{padding:12px;cursor:pointer;border-radius:8px;margin-bottom:5px;transition:0.2s}
.ni:hover, .ni.active{background:rgba(108, 79, 255, 0.1);color:var(--accent)}
.jcard{background:var(--s1);border:1px solid var(--border);border-radius:12px;padding:20px;display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}
.pro-badge{background:var(--gold);color:#000;font-size:10px;padding:2px 8px;border-radius:4px;font-weight:800;margin-left:5px}
`;

// ─── LOGIN COMPONENT ────────────────────────────────────────
function AuthScreen({ onLogin }) {
    const [email, setEmail] = useState("");
    const [isRegister, setIsRegister] = useState(false);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 style={{color: 'var(--accent)'}}>HireReady</h1>
                <p>{isRegister ? "Create your account" : "Welcome back"}</p>
                <input
                    className="input-field"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input className="input-field" type="password" placeholder="Password" />
                <button className="btn btn-accent" style={{width:'100%'}} onClick={() => onLogin(email)}>
                    {isRegister ? "Sign Up" : "Login"}
                </button>
                <p style={{fontSize: 12, marginTop: 20, cursor:'pointer'}} onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? "Already have an account? Login" : "New here? Create an account"}
                </p>
            </div>
        </div>
    );
}

// ─── MAIN APP ───────────────────────────────────────────────
export default function HireReady() {
    const [user, setUser] = useState(null); // Stores logged in user info
    const [currency, setCurrency] = useState(CURRENCIES.USD);
    const [page, setPage] = useState("dashboard");
    const [isProSubscriber, setIsProSubscriber] = useState(false);
    const [jobSearch, setJobSearch] = useState("");

    // AUTH LOGIC
    const handleLogin = (email) => {
        if(!email) return alert("Please enter an email");

        const role = OWNER_EMAILS.includes(email.toLowerCase()) ? "owner" :
            TESTER_EMAILS.includes(email.toLowerCase()) ? "tester" : "user";

        setUser({ email, role });
    };

    const handleLogout = () => setUser(null);

    // ACCESS LOGIC
    // Owners and Testers get Pro for free
    const hasProAccess = user?.role === "owner" || user?.role === "tester" || isProSubscriber;

    if (!user) return <><style>{CSS}</style><AuthScreen onLogin={handleLogin}/></>;

    return (
        <>
            <style>{CSS}</style>
            <div className="shell">
                <div className="sidebar">
                    <div style={{ padding: 20, fontSize: 22, fontWeight: 800 }}>Hire<em>Ready</em></div>

                    <div style={{ flex: 1, padding: 15 }}>
                        <div className={`ni ${page === "dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}>🏠 Dashboard</div>
                        <div className={`ni ${page === "jobs" ? "active" : ""}`} onClick={() => setPage("jobs")}>💼 Job Board</div>
                        <div className={`ni ${page === "resume" ? "active" : ""}`} onClick={() => setPage("resume")}>📄 Resume Builder</div>
                    </div>

                    <div style={{padding: 20, borderTop: '1px solid var(--border)'}}>
                        <div style={{fontSize: 12, marginBottom: 10}}>{user.email}</div>
                        {hasProAccess ? (
                            <div style={{color: 'var(--gold)', fontSize: 11, fontWeight: 800}}>✦ PRO UNLOCKED</div>
                        ) : (
                            <div style={{background: 'rgba(232, 168, 56, 0.1)', padding: 10, borderRadius: 10, textAlign: 'center'}}>
                                <div style={{fontSize: 10, marginBottom: 5}}>Choose Currency</div>
                                <div style={{display:'flex', gap:5, justifyContent:'center', marginBottom:10}}>
                                    {Object.keys(CURRENCIES).map(c => (
                                        <button key={c} onClick={() => setCurrency(CURRENCIES[c])} style={{fontSize:9, cursor:'pointer'}}>{c}</button>
                                    ))}
                                </div>
                                <button className="btn btn-gold" style={{fontSize:11, padding: '8px 12px'}} onClick={() => setIsProSubscriber(true)}>
                                    Upgrade {currency.symbol}{currency.price}
                                </button>
                            </div>
                        )}
                        <div style={{fontSize: 12, marginTop: 15, cursor:'pointer', color: 'var(--muted)'}} onClick={handleLogout}>Logout →</div>
                    </div>
                </div>

                <div className="main">
                    <div className="page">
                        {page === "dashboard" && (
                            <div className="card">
                                <h1>Dashboard {user.role === 'owner' && <span className="pro-badge">ADMIN</span>}</h1>
                                <p>Welcome, {user.email}.</p>
                                {user.role === 'owner' && <p style={{color: 'var(--accent)'}}>Status: You have full developer access.</p>}
                                {user.role === 'tester' && <p style={{color: 'var(--green)'}}>Status: You are a verified tester.</p>}
                            </div>
                        )}

                        {page === "jobs" && (
                            <>
                                <h1>Job Board</h1>
                                <input
                                    className="input-field"
                                    placeholder="Search companies or roles..."
                                    onChange={(e) => setJobSearch(e.target.value)}
                                />
                                {ALL_JOBS.filter(j => j.title.toLowerCase().includes(jobSearch.toLowerCase())).map(j => (
                                    <div key={j.id} className="jcard">
                                        <div>
                                            <div style={{fontWeight: 700}}>{j.title}</div>
                                            <div style={{fontSize: 13, color: 'var(--muted)'}}>{j.company} · {j.location}</div>
                                        </div>
                                        <div style={{display:'flex', gap: 10}}>
                                            <a href={j.url} target="_blank" rel="noreferrer" className="btn btn-green" style={{fontSize: 12}}>Apply Now ↗</a>
                                            <button className="btn btn-accent" style={{fontSize: 12}} onClick={() => alert("Saved to tracker!")}>Track</button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {page === "resume" && (
                            <div className="card" style={{textAlign: 'center', padding: '100px 20px'}}>
                                <h2>AI Resume Builder</h2>
                                {!hasProAccess ? (
                                    <div>
                                        <p>This is a premium feature.</p>
                                        <button className="btn btn-gold" onClick={() => setIsProSubscriber(true)}>Upgrade to Unlock</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p style={{color: 'var(--green)'}}>✓ You have access to the AI Builder</p>
                                        <button className="btn btn-accent">Start Building Resume</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}