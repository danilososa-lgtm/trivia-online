import React, { useState, useEffect } from 'react';
import { Trophy, Users, Clock, Play, UserPlus, Trash2, Sparkles, HourglassIcon, CheckCircle } from 'lucide-react';
import { CATEGORIES, QUESTIONS } from './constants';
import './App.css';

function App() {
  const [screen, setScreen] = useState('setup');
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [scores, setScores] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [playersAnswered, setPlayersAnswered] = useState([]);

  useEffect(() => {
    if (currentQuestion && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswerSubmit();
    }
  }, [timeLeft, currentQuestion, showResult]);

  const addPlayer = () => {
    if (playerName.trim() && !players.includes(playerName.trim())) {
      setPlayers([...players, playerName.trim()]);
      setPlayerName('');
    }
  };

  const removePlayer = (playerToRemove) => {
    setPlayers(players.filter(p => p !== playerToRemove));
  };

  const startGame = () => {
    if (players.length < 2) {
      alert('Necesitas al menos 2 jugadores');
      return;
    }
    
    const initialScores = {};
    players.forEach(player => {
      initialScores[player] = 0;
    });
    
    setScores(initialScores);
    setScreen('game');
    loadQuestion(0);
    setCurrentTurnIndex(0);
    setPlayersAnswered([]);
  };

  const loadQuestion = (index) => {
    const categories = Object.keys(QUESTIONS);
    const category = categories[index % categories.length];
    const questions = QUESTIONS[category];
    const question = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion({ ...question, category });
    setTimeLeft(15);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
  };

  const handleAnswerSubmit = () => {
    if (showResult) return;
    setShowResult(true);
    
    const currentPlayer = players[currentTurnIndex];
    const newScores = { ...scores };
    
    if (selectedAnswer === currentQuestion.c) {
      const basePoints = Math.max(100, 1000 - (15 - timeLeft) * 60);
      newScores[currentPlayer] = (newScores[currentPlayer] || 0) + basePoints;
    }
    
    setScores(newScores);
    
    const newPlayersAnswered = [...playersAnswered, currentPlayer];
    setPlayersAnswered(newPlayersAnswered);
    
    setTimeout(() => {
      const nextTurn = (currentTurnIndex + 1) % players.length;
      
      if (nextTurn === 0) {
        const nextQ = questionNumber + 1;
        
        if (nextQ >= 6) {
          setGameFinished(true);
        } else {
          setQuestionNumber(nextQ);
          loadQuestion(nextQ);
          setCurrentTurnIndex(0);
          setPlayersAnswered([]);
        }
      } else {
        setCurrentTurnIndex(nextTurn);
        setTimeLeft(15);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 2500);
  };

  const resetGame = () => {
    setScreen('setup');
    setPlayerName('');
    setPlayers([]);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setTimeLeft(15);
    setScores({});
    setShowResult(false);
    setQuestionNumber(0);
    setGameFinished(false);
    setCurrentTurnIndex(0);
    setPlayersAnswered([]);
  };

  const currentPlayer = players[currentTurnIndex];

  if (screen === 'setup') {
    return (
      <div className="screen-container gradient-purple">
        <div className="background-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        
        <div className="card glass-card">
          <div className="text-center mb-8 bounce">
            <div className="icon-container">
              <Trophy className="icon-large text-yellow animate-pulse" />
              <Sparkles className="icon-small text-yellow spin-slow" />
            </div>
            <h1 className="title-mega gradient-text">TRIVIA LOCAL</h1>
            <p className="subtitle">¡Juego por turnos en el mismo dispositivo!</p>
          </div>

          <div className="form-container">
            <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
              <input
                type="text"
                placeholder="Nombre del jugador"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                className="input-field"
                style={{flex: 1}}
              />
              <button onClick={addPlayer} className="btn btn-secondary" style={{width: 'auto', padding: '0 1.5rem'}}>
                <UserPlus className="w-6 h-6" />
              </button>
            </div>

            {players.length > 0 && (
              <div style={{marginBottom: '1rem'}}>
                <div className="section-header">
                  <Users className="w-6 h-6 text-cyan" />
                  <h3 style={{color: 'white', fontWeight: 'bold'}}>JUGADORES ({players.length})</h3>
                </div>
                <div className="players-list">
                  {players.map((player, i) => (
                    <div key={i} className="player-card">
                      <div className="player-avatar">
                        {player.charAt(0).toUpperCase()}
                      </div>
                      <span className="player-name">{player}</span>
                      <button 
                        onClick={() => removePlayer(player)}
                        style={{background: 'rgba(239,68,68,0.3)', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer'}}
                      >
                        <Trash2 className="w-4 h-4" style={{color: 'white'}} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {players.length >= 2 && (
              <button onClick={startGame} className="btn btn-primary">
                <Play className="w-6 h-6" />
                ¡COMENZAR JUEGO!
              </button>
            )}

            {players.length < 2 && (
              <div style={{background: 'rgba(59,130,246,0.2)', padding: '1rem', borderRadius: '1rem', textAlign: 'center'}}>
                <p style={{color: 'white', margin: 0}}>Agrega al menos 2 jugadores para comenzar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    const sortedPlayers = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return (
      <div className="screen-container gradient-purple">
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {['🏆', '⭐', '🎉', '✨', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>

        <div className="card glass-card">
          <div className="text-center mb-8">
            <Trophy className="icon-mega text-yellow mb-4 bounce" />
            <h2 className="title-mega gradient-text">¡FINAL!</h2>
            <p className="subtitle">Resultados</p>
          </div>

          <div className="results-list">
            {sortedPlayers.map(([player, score], i) => (
              <div key={player} className={`result-card rank-${i + 1}`}>
                <div className="rank-number">{i + 1}</div>
                <div className="result-info">
                  <p className="result-name">{player}</p>
                  {i === 0 && <p className="champion-badge">👑 CAMPEÓN</p>}
                </div>
                <div className="result-score">
                  <p className="score-value">{score}</p>
                  <p className="score-label">puntos</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={resetGame} className="btn btn-primary">
            JUGAR DE NUEVO
          </button>
        </div>
      </div>
    );
  }

  if (currentQuestion) {
    const categoryData = CATEGORIES[currentQuestion.category];
    const progress = ((15 - timeLeft) / 15) * 100;
    
    return (
      <div className={`screen-container gradient-${currentQuestion.category}`}>
        <div className="category-icons">
          <div className="category-icon left">{categoryData.icon}</div>
          <div className="category-icon right">{categoryData.emoji}</div>
        </div>

        <div className={`card glass-card question-card ${animate ? 'card-animate' : ''}`}>
          
          <div style={{background: 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(59,130,246,0.3))', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', border: '2px solid rgba(255,255,255,0.4)'}}>
            <HourglassIcon className="w-10 h-10 mx-auto mb-2 text-white animate-pulse" />
            <p className="text-white font-black text-2xl mb-2">Turno de: {currentPlayer}</p>
            <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap'}}>
              {players.map((player, i) => (
                <div 
                  key={i}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.75rem',
                    background: playersAnswered.includes(player) 
                      ? 'rgba(34,197,94,0.3)' 
                      : player === currentPlayer 
                      ? 'rgba(251,191,36,0.4)' 
                      : 'rgba(255,255,255,0.1)',
                    border: player === currentPlayer ? '2px solid rgba(251,191,36,0.8)' : '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {playersAnswered.includes(player) && <CheckCircle className="w-4 h-4 text-green-400" />}
                  <span style={{color: 'white', fontWeight: 'bold', fontSize: '0.875rem'}}>{player}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="question-header">
            <div className="category-badge">
              <div className="category-icon-box">{categoryData.icon}</div>
              <div>
                <p className="category-label">CATEGORÍA</p>
                <p className="category-name">{categoryData.name}</p>
              </div>
            </div>
            
            <div className="timer-section">
              <div className="timer-box">
                <div className="timer-display">
                  <Clock className="w-5 h-5" />
                  <span>{timeLeft}s</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${100 - progress}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="progress-dots">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`dot ${i < questionNumber ? 'done' : i === questionNumber ? 'active' : ''}`}></div>
            ))}
          </div>
          <p className="question-counter">Pregunta {questionNumber + 1} de 6</p>

          <div className="question-box">
            <h3 className="question-text">{currentQuestion.q}</h3>
          </div>

          <div className="answers-grid">
            {currentQuestion.a.map((answer, i) => (
              <button
                key={i}
                onClick={() => !showResult && setSelectedAnswer(i)}
                disabled={showResult}
                className={`answer-btn ${
                  showResult
                    ? i === currentQuestion.c
                      ? 'correct'
                      : selectedAnswer === i
                      ? 'incorrect'
                      : 'disabled'
                    : selectedAnswer === i
                    ? 'selected'
                    : ''
                }`}
              >
                {answer}
              </button>
            ))}
          </div>

          {selectedAnswer !== null && !showResult && (
            <button onClick={handleAnswerSubmit} className="btn btn-success">
              Confirmar Respuesta
            </button>
          )}

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1.5rem'}}>
            {players.map((player, i) => (
              <div key={i} style={{background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '1rem', textAlign: 'center'}}>
                <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginBottom: '0.25rem'}}>{player}</p>
                <p style={{color: 'white', fontSize: '1.5rem', fontWeight: 'bold'}}>{scores[player] || 0}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;