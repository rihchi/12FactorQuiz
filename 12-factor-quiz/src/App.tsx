import React, { useState, useEffect } from 'react';
import './App.css';
import companyLogo from './codingscape_logo.jpeg';
import companyLogoDark from './codingscape_logo_dark.gif';

interface Question {
  factor: string;
  question: string;
}

const questions: Question[] = [
  {
    factor: 'I. Codebase',
    question: 'How confident are you that each app has a single, well-managed codebase with clear ownership and version control?'
  },
  {
    factor: 'II. Dependencies',
    question: 'When onboarding a new team member, are app dependencies instantly clear and reproducible without manual steps?'
  },
  {
    factor: 'III. Config',
    question: 'Can your team deploy to different environments without ever touching the codebase?'
  },
  {
    factor: 'IV. Backing Services',
    question: 'How easy is it for your team to switch out a database, cache, or API service without rewriting code?'
  },
  {
    factor: 'V. Build/Release/Run',
    question: 'Can you rebuild and redeploy your app without worrying about runtime behaviors leaking into the build?'
  },
  {
    factor: 'VI. Processes',
    question: 'Would your system survive a sudden scale-up or failover event without requiring shared state or patchwork fixes?'
  },
  {
    factor: 'VII. Port Binding',
    question: 'Do your services cleanly bind to ports and run independently, or are they entangled with infrastructure details?'
  },
  {
    factor: 'VIII. Concurrency',
    question: 'Can your team scale workers, web servers, and other processes independently without intervention?'
  },
  {
    factor: 'IX. Disposability',
    question: 'When your services restart (intentionally or not), do they recover cleanly without ops intervention?'
  },
  {
    factor: 'X. Dev/Prod Parity',
    question: 'How often do bugs appear in production that "never showed up locally"?'
  },
  {
    factor: 'XI. Logs',
    question: 'Can your team trace issues across systems in real time, or are logs trapped on individual machines?'
  },
  {
    factor: 'XII. Admin Processes',
    question: 'How easily can your team run one-off tasks like DB migrations or scripts in your production environment?'
  }
];

const options: string[] = ['0 - Not at all', '1 - Somewhat', '2 - Partially', '3 - Mostly', '4 - Fully'];

type Answer = number | null;

function App() {
  const [answers, setAnswers] = useState<Answer[]>(Array(questions.length).fill(null));
  const [current, setCurrent] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

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
        {darkMode ? '🌙 Dark' : '☀️ Light'}
      </button>
      <img src={darkMode ? companyLogoDark : companyLogo} alt="Company Logo" className="company-logo" />
      <h1>12-Factor Readiness Assessment</h1>
      {!completed ? (
        <div>
          <h2>{questions[current].factor}</h2>
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
            {questions.map((q, idx) => {
              const score = answers[idx] ?? 0;
              let color = '#43a047'; // green
              let icon = '🏆';
              if (score < 2) {
                color = '#e53935'; // red
                icon = '❌';
              } else if (score < 4) {
                color = '#fbc02d'; // orange
                icon = '⚠️';
              }
              return (
                <div className="breakdown-card" key={idx}>
                  <div className="breakdown-label">
                    <span className="breakdown-icon" style={{ color }}>{icon}</span>
                    <span className="breakdown-factor">{q.factor}</span>
                    <span className="breakdown-score-label">{options[score]}</span>
                  </div>
                  <div className="breakdown-bar-bg">
                    <div
                      className="breakdown-bar"
                      style={{ width: `${(score / 4) * 100}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button className="retake-button" onClick={resetQuiz}>Retake Quiz</button>
        </div>
      )}
    </div>
  );
}

export default App;
