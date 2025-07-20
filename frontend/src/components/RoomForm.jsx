import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomForm = ({ onRoomCreated, editingRoom, setEditingRoom }) => {
  const [formData, setFormData] = useState({
    room_type: '',
    rate: '',
    status: 'disponible'
  });

  // Cuando cambia editingRoom, rellenamos el formulario con sus datos
  useEffect(() => {
    if (editingRoom) {
      setFormData({
        room_type: editingRoom.room_type,
        rate: editingRoom.rate,
        status: editingRoom.status
      });
    }
  }, [editingRoom]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingRoom) {
        // PUT para editar habitación
        const response = await axios.put(`http://localhost:8000/rooms/${editingRoom.id}`, {
          ...formData,
          rate: parseFloat(formData.rate),
        });
        console.log('Habitación actualizada:', response.data);
        setEditingRoom(null); // Salir del modo edición
      } else {
        // POST para crear habitación
        const response = await axios.post('http://localhost:8000/rooms/', {
          ...formData,
          rate: parseFloat(formData.rate),
        });
        console.log('Habitación creada:', response.data);
      }

      setFormData({ room_type: '', rate: '', status: 'disponible' });
      onRoomCreated(); // Refrescar lista

    } catch (error) {
      console.error('Error al guardar habitación:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingRoom ? 'Editar Habitación' : 'Registrar Nueva Habitación'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Tipo de habitación</label>
          <input
            type="text"
            name="room_type"
            value={formData.room_type}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Tarifa ($)</label>
          <input
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Estado</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          >
            <option value="disponible">Disponible</option>
            <option value="ocupada">Ocupada</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {editingRoom ? 'Guardar Cambios' : 'Crear Habitación'}
        </button>
      </form>
    </div>
  );
};

export default RoomForm;
