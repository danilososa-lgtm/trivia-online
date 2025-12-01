import React, { useState, useRef } from 'react';
import { Play, UserPlus, Trash2, Send, ArrowRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const COLORS = [
  { name: 'Rojo', value: '#E74C3C', light: '#EC7063', dark: '#C0392B' },
  { name: 'Naranja', value: '#E67E22', light: '#F39C12', dark: '#D35400' },
  { name: 'Amarillo', value: '#F1C40F', light: '#F4D03F', dark: '#F39C12' },
  { name: 'Verde', value: '#27AE60', light: '#52BE80', dark: '#1E8449' },
  { name: 'Azul', value: '#3498DB', light: '#5DADE2', dark: '#2874A6' },
  { name: 'Morado', value: '#9B59B6', light: '#AF7AC5', dark: '#7D3C98' }
];

const ROUNDS = [
  { id: 1, name: 'Expectativas', question: '¿Cuál es tu objetivo personal en este equipo?', color: '#F1C40F' },
  { id: 2, name: 'Contribución', question: '¿Cómo puedes ayudar a alcanzar el objetivo?', color: '#3498DB' },
  { id: 3, name: 'Desafíos', question: '¿Qué obstáculos ves en el camino?', color: '#E74C3C' }
];

function App() {
  const [screen, setScreen] = useState('setup');
  const [playerName, setPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showRoundResults, setShowRoundResults] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [boardPosition, setBoardPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const boardRef = useRef(null);

  const addPlayer = () => {
    if (playerName.trim() && selectedColor && !players.find(p => p.color.value === selectedColor.value)) {
      setPlayers([...players, { name: playerName.trim(), color: selectedColor, position: 0 }]);
      setPlayerName('');
      setSelectedColor(null);
    }
  };

  const removePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const startGame = () => {
    if (players.length < 2) {
      alert('Necesitas al menos 2 jugadores');
      return;
    }
    const initialAnswers = {};
    players.forEach(player => {
      initialAnswers[player.name] = { 1: '', 2: '', 3: '' };
    });
    setPlayerAnswers(initialAnswers);
    setScreen('game');
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) return;

    const currentPlayer = players[currentTurnIndex];
    const updatedAnswers = { ...playerAnswers };
    updatedAnswers[currentPlayer.name][currentRound] = currentAnswer;
    setPlayerAnswers(updatedAnswers);

    const updatedPlayers = [...players];
    updatedPlayers[currentTurnIndex].position = currentRound;
    setPlayers(updatedPlayers);

    setCurrentAnswer('');

    if (currentTurnIndex === players.length - 1) {
      setShowRoundResults(true);
    } else {
      setCurrentTurnIndex(currentTurnIndex + 1);
    }
  };

  const nextRound = () => {
    if (currentRound === 3) {
      setGameFinished(true);
    } else {
      setCurrentRound(currentRound + 1);
      setCurrentTurnIndex(0);
      setShowRoundResults(false);
    }
  };

  const resetGame = () => {
    setScreen('setup');
    setPlayers([]);
    setCurrentRound(1);
    setCurrentTurnIndex(0);
    setPlayerAnswers({});
    setShowRoundResults(false);
    setGameFinished(false);
    setZoom(1);
    setBoardPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - boardPosition.x, y: e.clientY - boardPosition.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setBoardPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.2, 0.5));
  };

  const resetView = () => {
    setZoom(1);
    setBoardPosition({ x: 0, y: 0 });
  };

  const currentPlayer = players[currentTurnIndex];
  const roundData = ROUNDS.find(r => r.id === currentRound);

  if (screen === 'setup') {
    return (
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'}}>
        <div style={{background: 'rgba(255,255,255,0.95)', borderRadius: '2rem', padding: '2rem', maxWidth: '600px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'}}>
          <div style={{textAlign: 'center', marginBottom: '2rem'}}>
            <div style={{fontSize: '4rem', marginBottom: '0.5rem'}}>🚴</div>
            <h1 style={{fontSize: '3rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem'}}>Tándem</h1>
            <p style={{color: '#666', fontSize: '1.1rem'}}>Juego colaborativo de reflexión grupal</p>
          </div>

          <div style={{marginBottom: '2rem'}}>
            <input
              type="text"
              placeholder="Nombre del jugador"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              style={{width: '100%', padding: '1rem', borderRadius: '1rem', border: '2px solid #ddd', fontSize: '1rem', marginBottom: '1rem'}}
            />

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem'}}>
              {COLORS.map(color => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color)}
                  disabled={players.find(p => p.color.value === color.value)}
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    border: selectedColor?.value === color.value ? '4px solid #000' : '2px solid #ddd',
                    background: players.find(p => p.color.value === color.value) ? '#f0f0f0' : color.value,
                    cursor: players.find(p => p.color.value === color.value) ? 'not-allowed' : 'pointer',
                    opacity: players.find(p => p.color.value === color.value) ? 0.3 : 1,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    color: color.value === '#F1C40F' ? '#000' : '#fff',
                    transition: 'all 0.3s'
                  }}
                >
                  {color.name}
                </button>
              ))}
            </div>

            <button
              onClick={addPlayer}
              disabled={!playerName.trim() || !selectedColor}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '1rem',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: playerName.trim() && selectedColor ? 'pointer' : 'not-allowed',
                opacity: playerName.trim() && selectedColor ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <UserPlus size={20} />
              Agregar Jugador
            </button>
          </div>

          {players.length > 0 && (
            <div style={{marginBottom: '2rem'}}>
              <h3 style={{fontWeight: 'bold', marginBottom: '1rem', color: '#333'}}>Jugadores ({players.length})</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {players.map((player, i) => (
                  <div key={i} style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '1rem', border: `3px solid ${player.color.value}`}}>
                    <div style={{fontSize: '1.5rem'}}>🚴</div>
                    <div style={{flex: 1}}>
                      <p style={{fontWeight: 'bold', margin: 0}}>{player.name}</p>
                      <p style={{fontSize: '0.9rem', color: '#666', margin: 0}}>{player.color.name}</p>
                    </div>
                    <button onClick={() => removePlayer(i)} style={{background: '#e74c3c', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer'}}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {players.length >= 2 && (
            <button
              onClick={startGame}
              style={{width: '100%', padding: '1.5rem', borderRadius: '1rem', border: 'none', background: 'linear-gradient(135deg, #11998e, #38ef7d)', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}
            >
              <Play size={24} />
              ¡Comenzar Tándem!
            </button>
          )}
        </div>
      </div>
    );
  }

  if (showRoundResults) {
    return (
      <div style={{minHeight: '100vh', background: `linear-gradient(135deg, ${roundData.color}dd, ${roundData.color}55)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'}}>
        <div style={{background: 'white', borderRadius: '2rem', padding: '2rem', maxWidth: '800px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'}}>
          <div style={{textAlign: 'center', marginBottom: '2rem'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: 'bold', color: roundData.color, marginBottom: '0.5rem'}}>
              Ronda {currentRound}: {roundData.name}
            </h2>
            <p style={{fontSize: '1.2rem', color: '#666'}}>{roundData.question}</p>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem'}}>
            {players.map(player => (
              <div key={player.name} style={{background: '#f8f9fa', padding: '1.5rem', borderRadius: '1rem', border: `3px solid ${player.color.value}`}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                  <span style={{fontSize: '1.5rem'}}>🚴</span>
                  <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{player.name}</span>
                </div>
                <p style={{margin: 0, color: '#333', fontSize: '1rem', fontStyle: 'italic'}}>
                  "{playerAnswers[player.name][currentRound]}"
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={nextRound}
            style={{width: '100%', padding: '1.5rem', borderRadius: '1rem', border: 'none', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}
          >
            {currentRound === 3 ? 'Ver Resumen Final' : 'Siguiente Ronda'}
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflowY: 'auto'}}>
        <div style={{background: 'white', borderRadius: '2rem', padding: '2rem', maxWidth: '900px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'}}>
          <div style={{textAlign: 'center', marginBottom: '2rem'}}>
            <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🚴🚴🚴</div>
            <h1 style={{fontSize: '3rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #f093fb, #f5576c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem'}}>
              ¡Tándem Logrado!
            </h1>
            <p style={{fontSize: '1.2rem', color: '#666'}}>El equipo llegó al centro juntos 🎯</p>
          </div>

          {ROUNDS.map(round => (
            <div key={round.id} style={{marginBottom: '2rem'}}>
              <h3 style={{fontSize: '1.8rem', fontWeight: 'bold', color: round.color, marginBottom: '1rem', borderBottom: `3px solid ${round.color}`, paddingBottom: '0.5rem'}}>
                {round.name}
              </h3>
              <p style={{fontSize: '1rem', color: '#666', marginBottom: '1rem', fontStyle: 'italic'}}>"{round.question}"</p>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem'}}>
                {players.map(player => (
                  <div key={player.name} style={{background: '#f8f9fa', padding: '1rem', borderRadius: '1rem', border: `2px solid ${player.color.value}`}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                      <span style={{fontSize: '1.2rem'}}>🚴</span>
                      <span style={{fontWeight: 'bold'}}>{player.name}</span>
                    </div>
                    <p style={{margin: 0, fontSize: '0.9rem', color: '#555'}}>
                      {playerAnswers[player.name][round.id]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={resetGame}
            style={{width: '100%', padding: '1.5rem', borderRadius: '1rem', border: 'none', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer'}}
          >
            Nuevo Juego
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{height: '100vh', background: '#2c3e50', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
      
      {/* Tablero Grande Interactivo */}
      <div 
        ref={boardRef}
        style={{flex: 1, position: 'relative', overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'grab'}}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Controles de Zoom */}
        <div style={{position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, display: 'flex', gap: '0.5rem'}}>
          <button onClick={handleZoomIn} style={{background: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.75rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'}}>
            <ZoomIn size={20} />
          </button>
          <button onClick={handleZoomOut} style={{background: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.75rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'}}>
            <ZoomOut size={20} />
          </button>
          <button onClick={resetView} style={{background: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.75rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'}}>
            <Maximize2 size={20} />
          </button>
        </div>

        {/* SVG del Tablero */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${boardPosition.x}px), calc(-50% + ${boardPosition.y}px)) scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          width: '800px',
          height: '800px'
        }}>
          <svg viewBox="0 0 800 800" style={{width: '100%', height: '100%', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))'}}>
            
            {/* Fondo del tablero */}
            <circle cx="400" cy="400" r="390" fill="#ecf0f1" stroke="#95a5a6" strokeWidth="4" />
            
            {/* Anillo Externo - Expectativas (Amarillo) */}
            <circle cx="400" cy="400" r="350" fill="none" stroke="#F1C40F" strokeWidth="100" opacity="0.8" />
            <circle cx="400" cy="400" r="350" fill="none" stroke="#F39C12" strokeWidth="100" opacity="0.3" />
            
            {/* Anillo Medio - Contribución (Azul) */}
            <circle cx="400" cy="400" r="230" fill="none" stroke="#3498DB" strokeWidth="100" opacity="0.8" />
            <circle cx="400" cy="400" r="230" fill="none" stroke="#2980B9" strokeWidth="100" opacity="0.3" />
            
            {/* Anillo Interno - Desafíos (Rojo) */}
            <circle cx="400" cy="400" r="110" fill="none" stroke="#E74C3C" strokeWidth="100" opacity="0.8" />
            <circle cx="400" cy="400" r="110" fill="none" stroke="#C0392B" strokeWidth="100" opacity="0.3" />
            
            {/* Centro */}
            <circle cx="400" cy="400" r="60" fill="#fff" stroke="#34495e" strokeWidth="4" />
            <circle cx="400" cy="400" r="55" fill="#3498DB" opacity="0.2" />
            <text x="400" y="415" textAnchor="middle" fontSize="40" fontWeight="bold" fill="#34495e">🎯</text>
            
            {/* Etiquetas de las rondas */}
            <text x="400" y="100" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#F39C12">EXPECTATIVAS</text>
            <text x="400" y="250" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#2980B9">CONTRIBUCIÓN</text>
            <text x="400" y="370" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#C0392B">DESAFÍOS</text>
            
            {/* Puntos decorativos (estrellas) */}
            {[0, 60, 120, 180, 240, 300].map(angle => {
              const rad = (angle * Math.PI) / 180;
              const x = 400 + Math.cos(rad) * 350;
              const y = 400 + Math.sin(rad) * 350;
              return (
                <g key={angle}>
                  <circle cx={x} cy={y} r="15" fill="white" opacity="0.9" />
                  <text x={x} y={y + 6} textAnchor="middle" fontSize="18">⭐</text>
                </g>
              );
            })}
            
            {/* Bicicletas de jugadores */}
            {players.map((player, i) => {
              const angle = (i / players.length) * 360;
              const rad = (angle * Math.PI) / 180;
              
              let radius = 350;
              if (player.position === 1) radius = 230;
              if (player.position === 2) radius = 110;
              if (player.position === 3) radius = 20;
              
              const x = 400 + Math.cos(rad) * radius;
              const y = 400 + Math.sin(rad) * radius;
              
              return (
                <g key={i} style={{transition: 'all 0.5s ease-out'}}>
                  <circle cx={x} cy={y} r="35" fill={player.color.value} stroke="white" strokeWidth="5" opacity="0.95" />
                  <circle cx={x} cy={y} r="32" fill={player.color.dark} opacity="0.3" />
                  <text x={x} y={y + 12} textAnchor="middle" fontSize="35">🚴</text>
                  <text x={x} y={y + 60} textAnchor="middle" fontSize="20" fontWeight="bold" fill={player.color.dark}>{player.name}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Panel de Pregunta Abajo */}
      <div style={{background: 'white', padding: '1.5rem', boxShadow: '0 -4px 20px rgba(0,0,0,0.2)'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem'}}>
          
          {/* Información del turno */}
          <div>
            <div style={{background: roundData.color, padding: '1rem', borderRadius: '1rem', marginBottom: '1rem', textAlign: 'center'}}>
              <h3 style={{color: 'white', fontWeight: 'bold', fontSize: '1.2rem', margin: 0}}>
                Ronda {currentRound}: {roundData.name}
              </h3>
            </div>
            
            <div style={{background: currentPlayer.color.light, padding: '1.5rem', borderRadius: '1rem', border: `3px solid ${currentPlayer.color.value}`, marginBottom: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <span style={{fontSize: '3rem'}}>🚴</span>
                <div>
                  <p style={{fontWeight: 'bold', fontSize: '1.3rem', margin: 0}}>Turno de:</p>
                  <p style={{fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: currentPlayer.color.dark}}>{currentPlayer.name}</p>
                </div>
              </div>
            </div>

            {/* Lista de jugadores */}
            <div style={{background: '#f8f9fa', padding: '1rem', borderRadius: '1rem'}}>
              {players.map((player, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                  background: currentTurnIndex === i ? player.color.light : 'transparent',
                  borderRadius: '0.5rem',
                  border: currentTurnIndex === i ? `2px solid ${player.color.value}` : 'none'
                }}>
                  <div style={{width: '16px', height: '16px', borderRadius: '50%', background: player.color.value}}></div>
                  <span style={{flex: 1, fontWeight: currentTurnIndex === i ? 'bold' : 'normal'}}>{player.name}</span>
                  <span style={{fontSize: '0.8rem', color: '#666'}}>
                    {player.position === 0 && '🟡 Expectativas'}
                    {player.position === 1 && '🔵 Contribución'}
                    {player.position === 2 && '🔴 Desafíos'}
                    {player.position === 3 && '🎯 Centro'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Área de respuesta */}
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <h2 style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '1rem'}}>
              {roundData.question}
            </h2>
            
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '1rem',
                border: '2px solid #ddd',
                fontSize: '1.1rem',
                resize: 'none',
                marginBottom: '1rem',
                fontFamily: 'inherit',
                minHeight: '120px'
              }}
            />

            <button
              onClick={submitAnswer}
              disabled={!currentAnswer.trim()}
              style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                border: 'none',
                background: currentAnswer.trim() ? 'linear-gradient(135deg, #11998e, #38ef7d)' : '#ccc',
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                cursor: currentAnswer.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Send size={24} />
              Enviar Respuesta y Avanzar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;