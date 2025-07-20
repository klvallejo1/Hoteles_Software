import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReservationList = ({ setEditingReservation }) => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/reservations/')
      .then(response => {
        console.log('Reservas cargadas:', response.data);
        setReservations(response.data);
      })
      .catch(error => {
        console.error('Error cargando reservas:', error);
        setError('No se pudieron cargar las reservas.');
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta reserva?")) return;
    try {
      await axios.delete(`http://localhost:8000/reservations/${id}`);
      setReservations(reservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
      alert("No se pudo eliminar la reserva");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'confirmada': 'bg-blue-100 text-blue-800',
      'activa': 'bg-green-100 text-green-800',
      'completada': 'bg-gray-100 text-gray-800',
      'cancelada': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Reservas</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-purple-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Cliente</th>
              <th className="py-3 px-6 text-left">Habitación</th>
              <th className="py-3 px-6 text-left">Fecha Inicio</th>
              <th className="py-3 px-6 text-left">Fecha Fin</th>
              <th className="py-3 px-6 text-left">Estado</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {reservations.map(reservation => (
              <tr key={reservation.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{reservation.id}</td>
                <td className="py-3 px-6">
                  {reservation.client ? reservation.client.name : 'Cliente no encontrado'}
                </td>
                <td className="py-3 px-6">
                  {reservation.room ? `Hab. ${reservation.room.id} (${reservation.room.room_type})` : 'Habitación no encontrada'}
                </td>
                <td className="py-3 px-6">{reservation.start_date}</td>
                <td className="py-3 px-6">{reservation.end_date}</td>
                <td className="py-3 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => {
                      setEditingReservation(reservation);
                      window.scrollTo(0, 0);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(reservation.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationList;
