import React, { useState, useEffect } from 'react';
import { Trophy, Users, Clock, Play, LogIn, Zap, Crown, Target, Sparkles } from 'lucide-react';
import { database } from './firebase';
import { ref, set, get, onValue, update, remove } from 'firebase/database';
import { CATEGORIES, QUESTIONS } from './constants';
import './App.css';

function App() {
  const [screen, setScreen] = useState('login');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [scores, setScores] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [streakBonus, setStreakBonus] = useState(0);
  const [roomListener, setRoomListener] = useState(null);

  useEffect(() => {
    if (gameStarted && currentQuestion && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswerSubmit();
    }
  }, [timeLeft, gameStarted, currentQuestion, showResult]);

  useEffect(() => {
    return () => {
      if (roomListener) {
        roomListener();
      }
    };
  }, [roomListener]);

  const createRoom = async () => {
    if (!playerName.trim()) return;
    try {
      const code = Math.random().toString(36).substr(2, 6).toUpperCase();
      const roomRef = ref(database, `rooms/${code}`);
      await set(roomRef, {
        code,
        host: playerName,
        players: [playerName],
        started: false,
        questionIndex: 0,
        scores: { [playerName]: 0 }
      });
      setCurrentRoom(code);
      setPlayers([playerName]);
      setScores({ [playerName]: 0 });
      setScreen('lobby');
      const unsubscribe = onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPlayers(data.players || []);
          setScores(data.scores || {});
          if (data.started && !gameStarted) {
            setGameStarted(true);
            setQuestionNumber(data.questionIndex || 0);
            loadQuestion(data.questionIndex || 0);
          }
        }
      });
      setRoomListener(() => unsubscribe);
    } catch (error) {
      alert('Error al crear sala: ' + error.message);
    }
  };

  const joinRoom = async () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    try {
      const code = roomCode.toUpperCase();
      const roomRef = ref(database, `rooms/${code}`);
      const snapshot = await get(roomRef);
      if (!snapshot.exists()) {
        alert('Sala no encontrada');
        return;
      }
      const roomData = snapshot.val();
      if (roomData.started) {
        alert('El juego ya comenzó');
        return;
      }
      if (!roomData.players.includes(playerName)) {
        const updatedPlayers = [...roomData.players, playerName];
        const updatedScores = { ...roomData.scores, [playerName]: 0 };
        await update(roomRef, {
          players: updatedPlayers,
          scores: updatedScores
        });
      }
      setCurrentRoom(code);
      setPlayers(roomData.players);
      setScreen('lobby');
      const unsubscribe = onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPlayers(data.players || []);
          setScores(data.scores || {});
          if (data.started && !gameStarted) {
            setGameStarted(true);
            setQuestionNumber(data.questionIndex || 0);
            loadQuestion(data.questionIndex || 0);
          }
        }
      });
      setRoomListener(() => unsubscribe);
    } catch (error) {
      alert('Error al unirse: ' + error.message);
    }
  };

  const startGame = async () => {
    try {
      const roomRef = ref(database, `rooms/${currentRoom}`);
      await update(roomRef, { started: true, questionIndex: 0 });
      setGameStarted(true);
      setQuestionNumber(0);
      setAnimate(true);
      setTimeout(() => loadQuestion(0), 500);
    } catch (error) {
      alert('Error al iniciar juego');
    }
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

  const handleAnswerSubmit = async () => {
    if (showResult) return;
    setShowResult(true);
    if (selectedAnswer === currentQuestion.c) {
      const basePoints = Math.max(100, 1000 - (15 - timeLeft) * 60);
      const bonus = streakBonus * 100;
      const points = basePoints + bonus;
      setStreakBonus(streakBonus + 1);
      const newScore = (scores[playerName] || 0) + points;
      const newScores = { ...scores, [playerName]: newScore };
      setScores(newScores);
      try {
        const roomRef = ref(database, `rooms/${currentRoom}`);
        await update(roomRef, { scores: newScores });
      } catch (error) {
        console.error('Error al actualizar puntuación:', error);
      }
    } else {
      setStreakBonus(0);
    }
    setTimeout(() => {
      const nextQ = questionNumber + 1;
      if (nextQ >= 6) {
        setGameFinished(true);
      } else {
        setQuestionNumber(nextQ);
        loadQuestion(nextQ);
      }
    }, 3000);
  };

  const resetGame = async () => {
    try {
      if (currentRoom && roomListener) {
        roomListener();
        await remove(ref(database, `rooms/${currentRoom}`));
      }
    } catch (error) {
      console.error('Error al limpiar sala:', error);
    }
    setScreen('login');
    setPlayerName('');
    setRoomCode('');
    setCurrentRoom(null);
    setPlayers([]);
    setGameStarted(false);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setTimeLeft(15);
    setScores({});
    setShowResult(false);
    setQuestionNumber(0);
    setGameFinished(false);
    setStreakBonus(0);
    setRoomListener(null);
  };

  if (screen === 'login') {
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
            <h1 className="title-mega gradient-text">TRIVIA ONLINE</h1>
            <p className="subtitle">¡Demuestra cuánto sabes!</p>
          </div>
          <div className="form-container">
            <input type="text" placeholder="Tu nombre" value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="input-field" />
            <button onClick={createRoom} className="btn btn-primary"><Play className="w-6 h-6" />CREAR SALA</button>
            <div className="divider"><span>O ÚNETE</span></div>
            <input type="text" placeholder="CÓDIGO DE SALA" value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} className="input-field text-center" maxLength={6} />
            <button onClick={joinRoom} className="btn btn-secondary"><LogIn className="w-6 h-6" />UNIRSE</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'lobby') {
    return (
      <div className="screen-container gradient-purple">
        <div className="background-stars">{[...Array(20)].map((_, i) => (<div key={i} className="star" style={{width: Math.random() * 100 + 50, height: Math.random() * 100 + 50, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`}} />))}</div>
        <div className="card glass-card">
          <div className="text-center mb-6">
            <Users className="icon-medium text-cyan mx-auto mb-3 bounce" />
            <h2 className="title-large">SALA DE ESPERA</h2>
            <div className="room-code"><p className="text-sm">CÓDIGO</p><p className="code-display">{currentRoom}</p></div>
          </div>
          <div className="mb-6">
            <div className="section-header"><Target className="w-6 h-6 text-pink" /><h3>JUGADORES ({players.length})</h3></div>
            <div className="players-list">{players.map((player, i) => (<div key={i} className="player-card"><div className="player-avatar">{player.charAt(0).toUpperCase()}</div><span className="player-name">{player}</span>{player === players[0] && (<div className="host-badge"><Crown className="w-4 h-4" /><span>HOST</span></div>)}</div>))}</div>
          </div>
          {players[0] === playerName && (<button onClick={startGame} className="btn btn-success mb-3"><Zap className="w-6 h-6" />¡COMENZAR!</button>)}
          <button onClick={resetGame} className="btn btn-outline">SALIR</button>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    const sortedPlayers = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return (
      <div className="screen-container gradient-purple">
        <div className="confetti-container">{[...Array(50)].map((_, i) => (<div key={i} className="confetti" style={{left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`}}>{['🏆', '⭐', '🎉', '✨', '🎊'][Math.floor(Math.random() * 5)]}</div>))}</div>
        <div className="card glass-card">
          <div className="text-center mb-8"><Trophy className="icon-mega text-yellow mb-4 bounce" /><h2 className="title-mega gradient-text">¡FINAL!</h2><p className="subtitle">Resultados</p></div>
          <div className="results-list">{sortedPlayers.map(([player, score], i) => (<div key={player} className={`result-card rank-${i + 1}`}><div className="rank-number">{i + 1}</div><div className="result-info"><p className="result-name">{player}</p>{i === 0 && <p className="champion-badge">👑 CAMPEÓN</p>}</div><div className="result-score"><p className="score-value">{score}</p><p className="score-label">puntos</p></div></div>))}</div>
          <button onClick={resetGame} className="btn btn-primary">JUGAR DE NUEVO</button>
        </div>
      </div>
    );
  }

  if (gameStarted && currentQuestion) {
    const categoryData = CATEGORIES[currentQuestion.category];
    const progress = ((15 - timeLeft) / 15) * 100;
    return (
      <div className={`screen-container gradient-${currentQuestion.category}`}>
        <div className="category-icons"><div className="category-icon left">{categoryData.icon}</div><div className="category-icon right">{categoryData.emoji}</div></div>
        <div className={`card glass-card question-card ${animate ? 'card-animate' : ''}`}>
          <div className="question-header">
            <div className="category-badge"><div className="category-icon-box">{categoryData.icon}</div><div><p className="category-label">CATEGORÍA</p><p className="category-name">{categoryData.name}</p></div></div>
            <div className="timer-section">{streakBonus > 0 && (<div className="streak-badge">🔥 x{streakBonus}</div>)}<div className="timer-box"><div className="timer-display"><Clock className="w-5 h-5" /><span>{timeLeft}s</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: `${100 - progress}%` }}></div></div></div></div>
          </div>
          <div className="progress-dots">{[...Array(6)].map((_, i) => (<div key={i} className={`dot ${i < questionNumber ? 'done' : i === questionNumber ? 'active' : ''}`}></div>))}</div>
          <p className="question-counter">Pregunta {questionNumber + 1} de 6</p>
          <div className="question-box"><h3 className="question-text">{currentQuestion.q}</h3></div>
          <div className="answers-grid">{currentQuestion.a.map((answer, i) => (<button key={i} onClick={() => !showResult && setSelectedAnswer(i)} disabled={showResult} className={`answer-btn ${showResult ? i === currentQuestion.c ? 'correct' : selectedAnswer === i ? 'incorrect' : 'disabled' : selectedAnswer === i ? 'selected' : ''}`}>{answer}</button>))}</div>
          {selectedAnswer !== null && !showResult && (<button onClick={handleAnswerSubmit} className="btn btn-success">Confirmar Respuesta</button>)}
          <div className="score-display"><p className="score-label">Tu puntuación</p><p className="score-value">{scores[playerName] || 0}</p></div>
        </div>
      </div>
    );
  }
  return null;
}

export default App;