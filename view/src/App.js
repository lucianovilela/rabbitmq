import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const time = setInterval(() => {
      axios.get('/message')
        .then(response => {
          // Atualiza o estado com a mensagem recebida
          setMessage(response.data.message);
        })
        .catch(error => {
          console.error('Erro ao buscar mensagem:', error);
        });
    }
      , 1000);

    return () => { clearInterval(time) }
  } , []);

  return (
    <div>
      <h1>Mensagem do servidor Fastify:</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
