import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/rooms/')
      .then(response => setRooms(response.data))
      .catch(error => {
        console.error(error);
        setError('No se pudieron cargar las habitaciones.');
      });
  }, []);

  return (
    <div>
      <h2>Habitaciones Disponibles</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Tarifa</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>{room.room_type}</td>
              <td>${room.rate}</td>
              <td>{room.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomList;
