import { useEffect, useState } from 'react';
import PacienteInfo from './PacienteInfo'; // Ajustá el path según tu estructura

const NFCListener = () => {
  const [cardId, setCardId] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8765');

    socket.onmessage = (event) => {
      const { card_id } = JSON.parse(event.data);
      setCardId(card_id);
    };

    return () => socket.close();
  }, []);

  return (
    <div>
      {cardId ? (
        <PacienteInfo cardId={cardId} />
      ) : (
        <p>Esperando lectura de tarjeta NFC...</p>
      )}
    </div>
  );
};

export default NFCListener;

