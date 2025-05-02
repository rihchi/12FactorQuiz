import React, { useState, useEffect } from 'react';
import './App.css';
import companyLogo from './codingscape_logo.jpeg';
import companyLogoDark from './codingscape_logo_dark.gif';

interface Question {
  question: string;
}

const questions: Question[] = [
  { question: 'How confident are you that your codebase is versioned and has clear ownership?' },
  { question: 'Can a new team member set up the project with a single command?' },
  { question: 'Are all dependencies declared in a single manifest file?' },
  { question: 'Is dependency installation always reproducible and automated?' },
  { question: 'Is configuration always stored outside the codebase?' },
  { question: 'Can you deploy to any environment without changing code?' },
  { question: 'Can you swap out databases or APIs without code changes?' },
  { question: 'Are all backing services (DB, cache, etc.) treated as attached resources?' },
  { question: 'Are build, release, and run stages clearly separated?' },
  { question: 'Can you rebuild and redeploy without worrying about runtime leaks?' },
  { question: 'Are your services stateless and horizontally scalable?' },
  { question: 'Can your app survive a sudden scale-up or failover event?' },
  { question: 'Do your services cleanly bind to ports and run independently?' },
  { question: 'Can you run your app locally without relying on external web servers?' },
  { question: 'Can you scale web servers and workers independently?' },
  { question: 'Is process concurrency (web, worker, etc.) handled via the process model?' },
  { question: 'Do your services start and stop quickly with graceful shutdowns?' },
  { question: 'Is your dev environment nearly identical to production?' },
  { question: 'Can you trace logs and metrics across all services in real time?' },
  { question: 'Can you run one-off admin tasks in the same environment as the app?' },
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

function App() {
  const [answers, setAnswers] = useState<Answer[]>(Array(questions.length).fill(null));
  const [current, setCurrent] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

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

          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            {!emailSent ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setEmailSent(true);
                }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
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
                  style={{ width: 'min(90vw, 320px)' }}
                >
                  Email results to yourself
                </button>
              </form>
            ) : (
              <p style={{ color: '#43a047', fontWeight: 700, fontSize: '1.1rem' }}>
                Results will be sent to your email shortly!
              </p>
            )}
          </div>

          <button className="retake-button" onClick={resetQuiz}>Retake Quiz</button>
        </div>
      )}
    </div>
  );
}

export default App;
