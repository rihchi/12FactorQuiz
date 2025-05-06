import React, { useState, useEffect } from 'react';
import './App.css';
import companyLogo from './codingscape_logo.jpeg';
import companyLogoDark from './codingscape_logo_dark.gif';

interface Question {
  question: string;
}

const questions: Question[] = [
  { question: 'Do you know exactly where the official, up-to-date code for each of your company\'s apps or services is stored?' },
  { question: 'If someone leaves, is it obvious who owns each codebase?' },
  { question: 'Is it easy to see all the software your app depends on, in one place?' },
  { question: 'Can a new developer get all dependencies set up with one command?' },
  { question: 'Are settings like passwords and API keys kept out of your code?' },
  { question: 'Can you move your app to a new environment (like staging or production) without changing the code?' },
  { question: 'If you needed to switch databases or APIs, could you do it without rewriting your app?' },
  { question: 'Are all external services (like storage, email, or cache) treated as replaceable add-ons?' },
  { question: 'Is it clear when your team is building, releasing, or running the app?' },
  { question: 'Can you rebuild and redeploy your app without worrying about hidden changes from previous runs?' },
  { question: 'If you had to double your app\'s capacity today, could you do it without rewriting code?' },
  { question: 'Does your app avoid storing user data or state in memory between requests?' },
  { question: 'Can your app run on any port, or does it require a specific server setup?' },
  { question: 'Could you run your app locally without needing a special web server or IT help?' },
  { question: 'If you needed more workers or web servers, could you add them independently?' },
  { question: 'Does your app handle multiple tasks at once by running more processes, not by adding complexity to the code?' },
  { question: 'If your app crashes or restarts, does it recover quickly and cleanly?' },
  { question: 'Is your development environment set up to be as close to production as possible?' },
  { question: 'Can you see all your app\'s logs in one place, in real time?' },
  { question: 'If you need to run a one-off task (like a database migration), can you do it safely in production?' },
];

const options: string[] = ['0 - Not at all', '1 - Somewhat', '2 - Partially', '3 - Mostly', '4 - Fully'];

type Answer = number | null;

const factorMappings = [
  { factor: 'I. Codebase', questions: [0, 1] },
  { factor: 'II. Dependencies', questions: [2, 3] },
  { factor: 'III. Config', questions: [4, 5] },
  { factor: 'IV. Backing Services', questions: [6, 7] },
  { factor: 'V. Build, Release, Run', questions: [8, 9] },
  { factor: 'VI. Processes', questions: [10, 11] },
  { factor: 'VII. Port Binding', questions: [12, 13] },
  { factor: 'VIII. Concurrency', questions: [14, 15] },
  { factor: 'IX. Disposability', questions: [16] },
  { factor: 'X. Dev/Prod Parity', questions: [17] },
  { factor: 'XI. Logs', questions: [18] },
  { factor: 'XII. Admin Processes', questions: [19] },
];

const factorBlurbs = [
  'Clear codebase ownership is essential for auditability, compliance, and rapid response to change.',
  'Undeclared dependencies create onboarding friction and hidden risk.',
  'Mismanaged config leads to costly outages and compliance headaches.',
  'Tightly coupled services slow innovation and increase vendor lock-in.',
  'Build/release/run confusion causes unpredictable deployments and downtime.',
  'Stateless, scalable processes are the foundation of resilience and agility.',
  'Port binding enables true cloud-native, scalable architectures.',
  'Concurrency gaps limit your ability to scale and respond to demand.',
  'Disposable systems reduce recovery time and operational risk.',
  'Dev/prod parity prevents "it worked on my machine" disasters.',
  'Centralized, actionable logs are critical for security and incident response.',
  'Easy admin processes enable safe, rapid change and compliance.'
];

function App() {
  const [answers, setAnswers] = useState<Answer[]>(Array(questions.length).fill(null));
  const [current, setCurrent] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleOptionChange = (idx: number) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const getScore = (): number => {
    const validAnswers = answers.filter((a): a is number => a !== null);
    const total = validAnswers.reduce((a, b) => a + b, 0);
    return Math.round((total / (validAnswers.length * 4)) * 100);
  };

  const resetQuiz = () => {
    setAnswers(Array(questions.length).fill(null));
    setCurrent(0);
    setCompleted(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSuccess(true);
    // Store email and timestamp in SheetDB
    fetch('https://sheetdb.io/api/v1/h1sci2oa288jn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { email: userEmail, timestamp: new Date().toISOString() } }),
    });
    setUserEmail('');
    setTimeout(() => setEmailSuccess(false), 2000);
  };

  return (
    <div className={`App${darkMode ? ' dark' : ''}`}>
      <button
        className="dark-toggle"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setDarkMode((d) => !d)}
      >
        {darkMode ? '🌙' : '☀️'}
        <span className="toggle-label"> {darkMode ? 'Dark' : 'Light'}</span>
      </button>
      <img src={darkMode ? companyLogoDark : companyLogo} alt="Company Logo" className="company-logo" />
      <h1>12-Factor Readiness Assessment</h1>
      {!completed ? (
        <div>
          <h2>{current + 1}</h2>
          <p>{questions[current].question}</p>
          {options.map((opt, idx) => (
            <div key={idx}>
              <label>
                <input
                  type="radio"
                  name={`question-${current}`}
                  checked={answers[current] === idx}
                  onChange={() => handleOptionChange(idx)}
                />
                {opt}
              </label>
            </div>
          ))}
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${((answers.filter(a => a !== null).length) / questions.length) * 100}%` }}
            />
          </div>
          <p>{answers.filter(a => a !== null).length}/{questions.length} answered</p>
          <div className="nav-buttons">
            <button
              className="nav-button"
              onClick={() => setCurrent(current - 1)}
              disabled={current === 0}
            >
              Back
            </button>
            {current < questions.length - 1 ? (
              <button
                className="nav-button"
                onClick={() => setCurrent(current + 1)}
                disabled={answers[current] === null}
              >
                Next
              </button>
            ) : (
              <button
                className="nav-button"
                onClick={() => setCompleted(true)}
                disabled={answers[current] === null}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Results callout */}
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ color: '#FF3C2E', fontSize: '1.2rem', marginBottom: '1rem' }}>
              Most CIOs and VPs are surprised by what they learn here.
            </h2>
            <p style={{ fontSize: '1.05rem', color: darkMode ? '#fff' : '#222', maxWidth: 520, margin: '0 auto' }}>
              Gaps in these areas can mean higher risk, slower innovation, and missed opportunities.<br />
              Want a confidential, expert review of your results? <a href="#" style={{ color: '#43a047', textDecoration: 'underline', fontWeight: 700 }}>Book a Discovery Call</a>
            </p>
          </div>
          <h2>Your 12-Factor Readiness Score</h2>
          <h1>{getScore()}%</h1>
          <p>{getScore() > 75 ? 'Strong foundation, let\'s build on it.' : 'Some gaps exist, worth exploring in a discovery session.'}</p>

          <h3>Factor-by-Factor Breakdown</h3>
          <div className="breakdown-cards">
            {factorMappings.map((mapping, idx) => {
              const scores = mapping.questions.map(qIdx => answers[qIdx] ?? 0);
              const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
              let color = '#43a047'; // green
              let icon = '🏆';
              if (avg < 2) {
                color = '#e53935'; // red
                icon = '❌';
              } else if (avg < 4) {
                color = '#fbc02d'; // orange
                icon = '⚠️';
              }
              return (
                <div className="breakdown-card" key={idx}>
                  <div className="breakdown-label">
                    <span className="breakdown-icon" style={{ color }}>{icon}</span>
                    <span className="breakdown-factor">{mapping.factor}</span>
                    <span className="breakdown-score-label">{scores.length ? `${avg.toFixed(1)} / 4` : 'N/A'}</span>
                  </div>
                  <div style={{ fontSize: '0.95em', color: darkMode ? '#fff' : '#222', marginBottom: 8, marginTop: -4 }}>
                    <em>{factorBlurbs[idx]}</em>
                  </div>
                  <div className="breakdown-bar-bg">
                    <div
                      className="breakdown-bar"
                      style={{ width: `${(avg / 4) * 100}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="email-form">
            <form
              onSubmit={handleEmailSubmit}
              style={{ width: '100%' }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                required
                className="email-input"
              />
              <button
                type="submit"
                className="retake-button"
                style={{ width: '100%' }}
              >
                Email results to yourself
              </button>
              {emailSuccess && (
                <p className="email-success">
                  Results will be sent to your email shortly!
                </p>
              )}
            </form>
          </div>

          <button className="retake-button" onClick={resetQuiz}>Retake Quiz</button>
        </div>
      )}
    </div>
  );
}

export default App;
