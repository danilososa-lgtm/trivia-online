export const CATEGORIES = {
  historia: { name: 'Historia', color: 'from-yellow-400 to-orange-500', emoji: '📚', icon: '🏛️' },
  ciencia: { name: 'Ciencia', color: 'from-green-400 to-emerald-600', emoji: '🔬', icon: '⚗️' },
  deportes: { name: 'Deportes', color: 'from-orange-400 to-red-500', emoji: '⚽', icon: '🏆' },
  geografia: { name: 'Geografía', color: 'from-blue-400 to-cyan-500', emoji: '🌍', icon: '🗺️' },
  entretenimiento: { name: 'Entretenimiento', color: 'from-pink-400 to-purple-500', emoji: '🎬', icon: '🎭' },
  arte: { name: 'Arte', color: 'from-purple-400 to-indigo-600', emoji: '🎨', icon: '🖼️' }
};

export const QUESTIONS = {
  historia: [
    { q: '¿En qué año comenzó la Primera Guerra Mundial?', a: ['1914', '1918', '1920', '1939'], c: 0 },
    { q: '¿Quién fue el primer presidente de Estados Unidos?', a: ['Thomas Jefferson', 'George Washington', 'Abraham Lincoln', 'John Adams'], c: 1 },
    { q: '¿En qué año cayó el Muro de Berlín?', a: ['1987', '1988', '1989', '1990'], c: 2 },
    { q: '¿Qué imperio construyó Machu Picchu?', a: ['Azteca', 'Maya', 'Inca', 'Olmeca'], c: 2 },
  ],
  ciencia: [
    { q: '¿Cuál es el planeta más grande del sistema solar?', a: ['Saturno', 'Neptuno', 'Júpiter', 'Urano'], c: 2 },
    { q: '¿Qué elemento químico tiene el símbolo "Au"?', a: ['Plata', 'Oro', 'Hierro', 'Cobre'], c: 1 },
    { q: '¿Cuántos huesos tiene el cuerpo humano adulto?', a: ['186', '206', '226', '246'], c: 1 },
    { q: '¿Cuál es la velocidad de la luz?', a: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'], c: 0 },
  ],
  deportes: [
    { q: '¿Cuántos jugadores tiene un equipo de fútbol en el campo?', a: ['9', '10', '11', '12'], c: 2 },
    { q: '¿En qué país se originó el tenis?', a: ['Inglaterra', 'Francia', 'Estados Unidos', 'España'], c: 1 },
    { q: '¿Cuántos anillos olímpicos hay?', a: ['4', '5', '6', '7'], c: 1 },
    { q: '¿Cuántos Grand Slams hay en el tenis?', a: ['3', '4', '5', '6'], c: 1 },
  ],
  geografia: [
    { q: '¿Cuál es la capital de Australia?', a: ['Sídney', 'Melbourne', 'Canberra', 'Brisbane'], c: 2 },
    { q: '¿Cuál es el río más largo del mundo?', a: ['Nilo', 'Amazonas', 'Yangtsé', 'Misisipi'], c: 1 },
    { q: '¿Cuántos continentes hay?', a: ['5', '6', '7', '8'], c: 2 },
    { q: '¿Cuál es el país más grande del mundo?', a: ['Canadá', 'China', 'Estados Unidos', 'Rusia'], c: 3 },
  ],
  entretenimiento: [
    { q: '¿Quién dirigió la película "Titanic"?', a: ['Steven Spielberg', 'James Cameron', 'Martin Scorsese', 'Christopher Nolan'], c: 1 },
    { q: '¿Cuántos Oscar ganó "El Señor de los Anillos: El Retorno del Rey"?', a: ['9', '10', '11', '12'], c: 2 },
    { q: '¿En qué año se estrenó la primera película de Harry Potter?', a: ['1999', '2000', '2001', '2002'], c: 2 },
    { q: '¿Quién interpretó a Iron Man en el MCU?', a: ['Chris Evans', 'Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo'], c: 1 },
  ],
  arte: [
    { q: '¿Quién pintó "La Mona Lisa"?', a: ['Miguel Ángel', 'Leonardo da Vinci', 'Rafael', 'Donatello'], c: 1 },
    { q: '¿En qué museo se encuentra "La noche estrellada" de Van Gogh?', a: ['Louvre', 'MoMA', 'Prado', 'British Museum'], c: 1 },
    { q: '¿Cuántas sinfonías compuso Beethoven?', a: ['7', '8', '9', '10'], c: 2 },
    { q: '¿Quién esculpió "El David"?', a: ['Donatello', 'Miguel Ángel', 'Bernini', 'Rodin'], c: 1 },
  ]
};