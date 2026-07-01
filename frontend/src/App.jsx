import {
  Activity,
  Ambulance,
  ClipboardList,
  Languages,
  Search,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { MetricCard } from './components/MetricCard.jsx';
import { RecordTimeline } from './components/RecordTimeline.jsx';
import { demoPatients, demoRecords } from './data/demoData.js';
import { analyzeReport, requestAmbulance, verifyIdentity } from './services/mockApi.js';

const sampleReport =
  'Patient reports diabetes follow up. BP: 148/92. Glucose: 312. SpO2: 96. Tablet Metformin 500mg advised. Follow up required.';

export function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(demoPatients[0].id);
  const [reportText, setReportText] = useState(sampleReport);
  const [language, setLanguage] = useState('en');
  const [analysis, setAnalysis] = useState(() => analyzeReport(sampleReport, 'en'));
  const [identityResult, setIdentityResult] = useState(null);
  const [dispatch, setDispatch] = useState(null);

  const filteredPatients = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return demoPatients;
    }

    return demoPatients.filter((patient) =>
      [patient.name, patient.abhaNumber, patient.district].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }, [query]);

  const selectedPatient = demoPatients.find((patient) => patient.id === selectedId) || demoPatients[0];
  const selectedRecords = demoRecords.filter((record) => record.patientId === selectedPatient.id);

  function handleAnalyze() {
    setAnalysis(analyzeReport(reportText, language));
  }

  function handleVerify() {
    setIdentityResult(verifyIdentity(selectedPatient.abhaNumber));
  }

  function handleDispatch() {
    setDispatch(
      requestAmbulance({
        patientName: selectedPatient.name,
        pickup: `${selectedPatient.district} Civil Hospital`,
        destination: 'Nearest emergency care center',
        symptoms: analysis.summary
      })
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1>MediBridge</h1>
            <p>Health record network</p>
          </div>
        </div>

        <nav aria-label="Primary">
          <a className="nav-item active" href="#records">
            <ClipboardList size={18} />
            Records
          </a>
          <a className="nav-item" href="#reports">
            <Activity size={18} />
            Report AI
          </a>
          <a className="nav-item" href="#integrations">
            <ShieldCheck size={18} />
            Integrations
          </a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">SIH prototype dashboard</p>
            <h2>Patient care coordination</h2>
          </div>
          <div className="status-pill">
            <ShieldCheck size={16} />
            Demo data only
          </div>
        </header>

        <section className="metrics-grid">
          <MetricCard icon={ClipboardList} label="Patients" value="2" />
          <MetricCard icon={Activity} label="Records" value="4" />
          <MetricCard icon={Languages} label="Languages" value="EN / HI / MR" />
          <MetricCard icon={Ambulance} label="Emergency ETA" value={dispatch ? `${dispatch.eta} min` : '--'} />
        </section>

        <section className="content-grid">
          <section className="panel patient-panel" id="records">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Patient search</p>
                <h3>Health timeline</h3>
              </div>
              <div className="search-box">
                <Search size={16} />
                <input
                  aria-label="Search patient"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search patient"
                />
              </div>
            </div>

            <div className="patient-layout">
              <div className="patient-list">
                {filteredPatients.map((patient) => (
                  <button
                    className={patient.id === selectedPatient.id ? 'patient-row selected' : 'patient-row'}
                    key={patient.id}
                    onClick={() => setSelectedId(patient.id)}
                    type="button"
                  >
                    <strong>{patient.name}</strong>
                    <span>{patient.district} | {patient.abhaNumber}</span>
                  </button>
                ))}
              </div>

              <div className="patient-detail">
                <div className="patient-card">
                  <div>
                    <h4>{selectedPatient.name}</h4>
                    <p>{selectedPatient.age} yrs | {selectedPatient.gender} | {selectedPatient.bloodGroup}</p>
                  </div>
                  <span>{selectedPatient.district}</span>
                </div>
                <RecordTimeline records={selectedRecords} />
              </div>
            </div>
          </section>

          <section className="panel report-panel" id="reports">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">OCR + NLP prototype</p>
                <h3>Medical report reader</h3>
              </div>
              <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
            </div>

            <textarea
              aria-label="Medical report text"
              value={reportText}
              onChange={(event) => setReportText(event.target.value)}
            />
            <button className="primary-action" onClick={handleAnalyze} type="button">
              Analyze Report
            </button>

            <div className={`analysis-card ${analysis.risk}`}>
              <span>{analysis.risk.toUpperCase()} RISK</span>
              <p>{analysis.summary}</p>
              <dl>
                <div>
                  <dt>Conditions</dt>
                  <dd>{analysis.conditions.join(', ') || 'None detected'}</dd>
                </div>
                <div>
                  <dt>Vitals</dt>
                  <dd>{analysis.vitals.join(', ') || 'No vitals found'}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="panel integration-panel" id="integrations">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Demo adapters</p>
                <h3>ABDM and emergency flows</h3>
              </div>
            </div>

            <div className="integration-actions">
              <button onClick={handleVerify} type="button">
                <ShieldCheck size={16} />
                Verify Health ID
              </button>
              <button onClick={handleDispatch} type="button">
                <Ambulance size={16} />
                Request 108 Dispatch
              </button>
            </div>

            <div className="adapter-output">
              <h4>Identity Workflow</h4>
              <p>{identityResult ? identityResult.message : 'No identity check run yet.'}</p>
            </div>
            <div className="adapter-output">
              <h4>Ambulance Workflow</h4>
              <p>
                {dispatch
                  ? `${dispatch.status} | ${dispatch.priority} | ETA ${dispatch.eta} minutes`
                  : 'No dispatch request created yet.'}
              </p>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

