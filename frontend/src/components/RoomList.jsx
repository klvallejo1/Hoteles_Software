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
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Habitaciones Disponibles</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Tipo</th>
              <th className="py-3 px-6 text-left">Tarifa</th>
              <th className="py-3 px-6 text-left">Estado</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {rooms.map(room => (
              <tr key={room.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{room.id}</td>
                <td className="py-3 px-6">{room.room_type}</td>
                <td className="py-3 px-6">${room.rate}</td>
                <td className="py-3 px-6">{room.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomList;
