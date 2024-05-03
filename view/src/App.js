import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [userMessage, setUserMessage] = useState('')

  useEffect(() => {
    const time = setInterval(() => {
      axios.get('/message')
        .then(response => {
          // Atualiza o estado com a mensagem recebida
          setMessage(oldValue=>oldValue + "<br/>" + new Date() + response.data.message);
        })
        .catch(error => {
          setMessage(new Date() + error);

        });
    }
      , 10000);

    return () => {
      console.log('clear ' + time);
      clearInterval(time);
    }
  }, []);

  const sendMessage = () => {
    console.log(userMessage)
      axios.post("/message",{ message:userMessage})
      .then(()=>setUserMessage(''))
      .catch(error=>console.log('error', error));

  }
  return (
    <div className='container'>


      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">Mensagem</label>
        <input type="text" className="form-control mb-2" id="exampleFormControlInput1" placeholder="mensagem" onChange={(event) => { setUserMessage(event.target.value) }} value={userMessage} />
        <button type="button" className="btn btn-primary" onClick={sendMessage}>Send</button>
      </div>

      <span className='h1'>Mensagem do servidor Fastify:</span>
      <p className="text-info" dangerouslySetInnerHTML={{__html: message}}></p>
    </div>
  );
}

export default App;
