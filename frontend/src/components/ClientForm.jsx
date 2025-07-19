import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientForm = ({ onClientCreated, editingClient, setEditingClient }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (editingClient) {
      setFormData({
        name: editingClient.name || '',
        email: editingClient.email || '',
        phone: editingClient.phone || ''
      });
    }
  }, [editingClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Datos del cliente a enviar:', formData);
    
    try {
      if (editingClient) {
        const response = await axios.put(`http://localhost:8000/clients/${editingClient.id}`, formData);
        console.log('Respuesta del servidor (actualización):', response.data);
        alert('Cliente actualizado exitosamente');
        setEditingClient(null);
      } else {
        const response = await axios.post('http://localhost:8000/clients/', formData);
        console.log('Respuesta del servidor (creación):', response.data);
        alert('Cliente creado exitosamente');
      }
      
      setFormData({ name: '', email: '', phone: '' });
      onClientCreated();
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del error:', error.response?.data);
      alert(`Error al procesar la solicitud: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleCancel = () => {
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        {editingClient ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono:</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {editingClient ? 'Actualizar' : 'Crear'} Cliente
          </button>
          
          {editingClient && (
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

export default ClientForm;
