import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationForm = ({ onReservationCreated, editingReservation, setEditingReservation }) => {
  const [formData, setFormData] = useState({
    client_id: '',
    room_id: '',
    start_date: '',
    end_date: '',
    status: 'pendiente'
  });
  
  const [clients, setClients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  useEffect(() => {
    // Cargar clientes y habitaciones
    Promise.all([
      axios.get('http://localhost:8000/clients/'),
      axios.get('http://localhost:8000/rooms/')
    ]).then(([clientsRes, roomsRes]) => {
      setClients(clientsRes.data);
      setRooms(roomsRes.data);
    }).catch(error => {
      console.error('Error cargando datos:', error);
    });
  }, []);

  useEffect(() => {
    if (editingReservation) {
      setFormData({
        client_id: editingReservation.client_id || '',
        room_id: editingReservation.room_id || '',
        start_date: editingReservation.start_date || '',
        end_date: editingReservation.end_date || '',
        status: editingReservation.status || 'pendiente'
      });
      // Calcular monto si estamos editando
      calculateAmount(
        editingReservation.room_id,
        editingReservation.start_date,
        editingReservation.end_date
      );
    }
  }, [editingReservation, rooms]);

  // Función para calcular el monto total
  const calculateAmount = (roomId, startDate, endDate) => {
    if (roomId && startDate && endDate) {
      const room = rooms.find(r => r.id === parseInt(roomId));
      if (room) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        if (nights > 0) {
          const total = nights * room.rate;
          setCalculatedAmount(total);
          return total;
        }
      }
    }
    setCalculatedAmount(0);
    return 0;
  };

  // Cargar fechas no disponibles cuando se selecciona una habitación
  useEffect(() => {
    if (formData.room_id) {
      axios.get(`http://localhost:8000/room-availability/${formData.room_id}/unavailable-dates`)
        .then(response => {
          setUnavailableDates(response.data);
        })
        .catch(error => {
          console.error('Error cargando fechas no disponibles:', error);
        });
    }
  }, [formData.room_id]);

  // Verificar disponibilidad y calcular monto cuando cambian las fechas
  useEffect(() => {
    if (formData.room_id && formData.start_date && formData.end_date) {
      // Calcular monto total
      calculateAmount(formData.room_id, formData.start_date, formData.end_date);
      
      // Verificar disponibilidad
      const excludeReservationId = editingReservation ? editingReservation.id : null;
      
      axios.get(`http://localhost:8000/room-availability/${formData.room_id}/check-availability`, {
        params: {
          start_date: formData.start_date,
          end_date: formData.end_date,
          exclude_reservation_id: excludeReservationId
        }
      })
      .then(response => {
        if (response.data.available) {
          setAvailabilityMessage('✅ Habitación disponible en las fechas seleccionadas');
        } else {
          setAvailabilityMessage('❌ Habitación NO disponible en las fechas seleccionadas');
        }
      })
      .catch(error => {
        console.error('Error verificando disponibilidad:', error);
        setAvailabilityMessage('Error verificando disponibilidad');
      });
    } else {
      setAvailabilityMessage('');
      setCalculatedAmount(0);
    }
  }, [formData.room_id, formData.start_date, formData.end_date, editingReservation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convertir a enteros los IDs
    const dataToSend = {
      ...formData,
      client_id: parseInt(formData.client_id),
      room_id: parseInt(formData.room_id)
    };
    
    console.log('Datos a enviar:', dataToSend);
    
    try {
      if (editingReservation) {
        const response = await axios.put(`http://localhost:8000/reservations/${editingReservation.id}`, dataToSend);
        console.log('Respuesta del servidor (actualización):', response.data);
        alert('Reserva actualizada exitosamente');
        setEditingReservation(null);
      } else {
        const response = await axios.post('http://localhost:8000/reservations/', dataToSend);
        console.log('Respuesta del servidor (creación):', response.data);
        alert('Reserva creada exitosamente');
      }
      
      setFormData({ client_id: '', room_id: '', start_date: '', end_date: '', status: 'pendiente' });
      setAvailabilityMessage('');
      onReservationCreated();
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del error:', error.response?.data);
      alert(`Error al procesar la solicitud: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleCancel = () => {
    setEditingReservation(null);
    setFormData({ client_id: '', room_id: '', start_date: '', end_date: '', status: 'pendiente' });
    setAvailabilityMessage('');
  };

  // Función para deshabilitar fechas no disponibles
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        {editingReservation ? 'Editar Reserva' : 'Crear Nueva Reserva'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente:</label>
          <select
            value={formData.client_id}
            onChange={(e) => setFormData({...formData, client_id: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Seleccionar cliente</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Habitación:</label>
          <select
            value={formData.room_id}
            onChange={(e) => setFormData({...formData, room_id: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Seleccionar habitación</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                Hab. {room.id} - {room.room_type} (${room.rate}) - {room.status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Inicio:</label>
          <input
            type="date"
            value={formData.start_date}
            min={getMinDate()}
            onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Fin:</label>
          <input
            type="date"
            value={formData.end_date}
            min={formData.start_date || getMinDate()}
            onChange={(e) => setFormData({...formData, end_date: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        {/* Mensaje de disponibilidad */}
        {availabilityMessage && (
          <div className={`p-3 rounded-md text-sm font-medium ${
            availabilityMessage.includes('✅') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {availabilityMessage}
          </div>
        )}

        {/* Mostrar cálculo del monto total */}
        {calculatedAmount > 0 && (
          <div className="bg-emerald-50 p-4 rounded-md border border-emerald-200">
            <h4 className="font-medium text-emerald-900 mb-2">💰 Cálculo de Prefactura:</h4>
            <div className="text-sm text-emerald-800 space-y-1">
              {(() => {
                const room = rooms.find(r => r.id === parseInt(formData.room_id));
                const nights = formData.start_date && formData.end_date ? 
                  Math.ceil((new Date(formData.end_date) - new Date(formData.start_date)) / (1000 * 60 * 60 * 24)) : 0;
                
                return (
                  <>
                    <p>• Habitación: {room?.room_type} - ${room?.rate}/noche</p>
                    <p>• Noches: {nights}</p>
                    <p className="font-bold text-lg">• Total: ${calculatedAmount}</p>
                    <p className="text-xs mt-2 text-emerald-600">
                      ℹ️ Se generará automáticamente una prefactura por este monto
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Estado:</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="activa">Activa</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        {/* Información adicional sobre estados */}
        <div className="bg-blue-50 p-3 rounded-md text-sm">
          <p><strong>🔄 Proceso Automático:</strong></p>
          <ul className="mt-1 space-y-1 text-xs">
            <li>• <strong>Cualquier reserva:</strong> Genera prefactura automáticamente</li>
            <li>• <strong>Confirmada/Activa:</strong> Bloquea fechas de la habitación</li>
            <li>• <strong>Activa:</strong> Cambia habitación a "ocupada"</li>
            <li>• <strong>Pago completo:</strong> Finaliza automáticamente al llegar fecha de salida</li>
            <li>• <strong>Cancelada:</strong> Libera fechas y habitación</li>
          </ul>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={availabilityMessage.includes('❌')}
            className={`flex-1 py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              availabilityMessage.includes('❌')
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            {editingReservation ? 'Actualizar' : 'Crear'} Reserva
          </button>
          
          {editingReservation && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
