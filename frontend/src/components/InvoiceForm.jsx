import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvoiceForm = ({ onInvoiceCreated, editingInvoice, setEditingInvoice }) => {
  const [formData, setFormData] = useState({
    reservation_id: '',
    amount: '',
    issue_date: new Date().toISOString().split('T')[0] // Fecha actual
  });
  
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Cargar reservas
    axios.get('http://localhost:8000/reservations/')
      .then(response => setReservations(response.data))
      .catch(error => console.error('Error cargando reservas:', error));
  }, []);

  useEffect(() => {
    if (editingInvoice) {
      setFormData({
        reservation_id: editingInvoice.reservation_id || '',
        amount: editingInvoice.amount || '',
        issue_date: editingInvoice.issue_date || new Date().toISOString().split('T')[0]
      });
    }
  }, [editingInvoice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInvoice) {
        await axios.put(`http://localhost:8000/invoices/${editingInvoice.id}`, formData);
        alert('Factura actualizada exitosamente');
        setEditingInvoice(null);
      } else {
        await axios.post('http://localhost:8000/invoices/', formData);
        alert('Factura creada exitosamente');
      }
      
      setFormData({ 
        reservation_id: '', 
        amount: '', 
        issue_date: new Date().toISOString().split('T')[0] 
      });
      onInvoiceCreated();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la solicitud');
    }
  };

  const handleCancel = () => {
    setEditingInvoice(null);
    setFormData({ 
      reservation_id: '', 
      amount: '', 
      issue_date: new Date().toISOString().split('T')[0] 
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        {editingInvoice ? 'Editar Factura' : 'Crear Nueva Factura'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Reserva:</label>
          <select
            value={formData.reservation_id}
            onChange={(e) => setFormData({...formData, reservation_id: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Seleccionar reserva</option>
            {reservations.map(reservation => (
              <option key={reservation.id} value={reservation.id}>
                Reserva #{reservation.id} - {reservation.client?.name || 'Cliente no encontrado'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monto:</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Emisión:</label>
          <input
            type="date"
            value={formData.issue_date}
            onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {editingInvoice ? 'Actualizar' : 'Crear'} Factura
          </button>
          
          {editingInvoice && (
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

export default InvoiceForm;
