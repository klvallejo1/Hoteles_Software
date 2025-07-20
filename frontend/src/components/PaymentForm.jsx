import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentForm = ({ onPaymentCreated, editingPayment, setEditingPayment }) => {
  const [formData, setFormData] = useState({
    invoice_id: '',
    method: '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0]
  });
  
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar clientes
    axios.get('http://localhost:8000/clients/')
      .then(response => setClients(response.data))
      .catch(error => console.error('Error cargando clientes:', error));
  }, []);

  useEffect(() => {
    if (editingPayment) {
      setFormData({
        invoice_id: editingPayment.invoice_id || '',
        method: editingPayment.method || '',
        amount: editingPayment.amount || '',
        payment_date: editingPayment.payment_date || new Date().toISOString().split('T')[0]
      });
    }
  }, [editingPayment]);

  // Cuando se selecciona un cliente, cargar sus facturas pendientes
  const handleClientChange = async (clientId) => {
    setSelectedClient(clientId);
    setPendingInvoices([]);
    setFormData({ ...formData, invoice_id: '', amount: '' });
    
    if (clientId) {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/invoices/pending-by-client/${clientId}`);
        setPendingInvoices(response.data);
        console.log('Facturas pendientes:', response.data);
      } catch (error) {
        console.error('Error cargando facturas pendientes:', error);
        alert('Error al cargar las facturas del cliente');
      } finally {
        setLoading(false);
      }
    }
  };

  // Cuando se selecciona una factura
  const handleInvoiceChange = (invoiceId) => {
    const selectedInvoice = pendingInvoices.find(inv => inv.id === parseInt(invoiceId));
    if (selectedInvoice) {
      setFormData({
        ...formData,
        invoice_id: invoiceId,
        amount: selectedInvoice.pending_amount.toString() // Monto pendiente
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Datos del pago a enviar:', formData);
    
    try {
      if (editingPayment) {
        const response = await axios.put(`http://localhost:8000/payments/${editingPayment.id}`, formData);
        console.log('Pago actualizado:', response.data);
        alert('Pago actualizado exitosamente');
        setEditingPayment(null);
      } else {
        const response = await axios.post('http://localhost:8000/payments/', formData);
        console.log('Pago registrado:', response.data);
        alert('Pago registrado exitosamente. Si completa el total de la factura, se procesará automáticamente el checkout.');
      }
      
      // Resetear formulario
      setFormData({ 
        invoice_id: '', 
        method: '', 
        amount: '', 
        payment_date: new Date().toISOString().split('T')[0] 
      });
      setSelectedClient('');
      setPendingInvoices([]);
      onPaymentCreated();
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del error:', error.response?.data);
      alert(`Error al procesar el pago: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleCancel = () => {
    setEditingPayment(null);
    setFormData({ 
      invoice_id: '', 
      method: '', 
      amount: '', 
      payment_date: new Date().toISOString().split('T')[0] 
    });
    setSelectedClient('');
    setPendingInvoices([]);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        {editingPayment ? 'Editar Pago' : 'Registrar Nuevo Pago'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de cliente */}
        {!editingPayment && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Seleccionar Cliente:
            </label>
            <select
              value={selectedClient}
              onChange={(e) => handleClientChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              required={!editingPayment}
            >
              <option value="">Seleccionar cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.email}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Mostrar facturas pendientes */}
        {loading && (
          <div className="text-center py-4">
            <p className="text-blue-600">Cargando facturas...</p>
          </div>
        )}

        {pendingInvoices.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-blue-900 mb-3">Facturas Pendientes de Pago:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {pendingInvoices.map(invoice => (
                <div key={invoice.id} className="bg-white p-3 rounded border text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p><strong>Factura #{invoice.id}</strong></p>
                      <p>Reserva: {invoice.reservation?.start_date} - {invoice.reservation?.end_date}</p>
                      <p>Habitación: {invoice.reservation?.room?.room_type} (${invoice.reservation?.room?.rate}/noche)</p>
                      <p>Estado: <span className="font-medium">{invoice.reservation?.status}</span></p>
                    </div>
                    <div className="text-right">
                      <p>Total: <strong>${invoice.amount}</strong></p>
                      <p>Pagado: ${invoice.total_paid}</p>
                      <p className="text-red-600 font-bold">Pendiente: ${invoice.pending_amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedClient && pendingInvoices.length === 0 && !loading && (
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-green-800">
              ✅ Este cliente no tiene facturas pendientes de pago.
            </p>
          </div>
        )}

        {/* Selector de factura */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Factura a Pagar:
          </label>
          <select
            value={formData.invoice_id}
            onChange={(e) => handleInvoiceChange(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            required
            disabled={!selectedClient && !editingPayment}
          >
            <option value="">Seleccionar factura</option>
            {pendingInvoices.map(invoice => (
              <option key={invoice.id} value={invoice.id}>
                Factura #{invoice.id} - Pendiente: ${invoice.pending_amount}
              </option>
            ))}
          </select>
          {!selectedClient && !editingPayment && (
            <p className="mt-1 text-sm text-gray-500">
              Primero selecciona un cliente
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Método de Pago:</label>
          <select
            value={formData.method}
            onChange={(e) => setFormData({...formData, method: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Seleccionar método</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monto a Pagar:</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            El monto se auto-completa con el saldo pendiente al seleccionar una factura
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Pago:</label>
          <input
            type="date"
            value={formData.payment_date}
            onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Información del proceso */}
        <div className="bg-green-50 p-3 rounded-md text-sm">
          <p><strong>💡 Proceso de Pago:</strong></p>
          <ul className="mt-2 space-y-1 text-xs text-green-800">
            <li>• Todas las reservas generan automáticamente una prefactura</li>
            <li>• Puedes hacer pagos parciales o completos</li>
            <li>• Al completar el pago total, la transacción se finaliza automáticamente</li>
            <li>• Las habitaciones se liberan cuando se llega a la fecha de salida y el pago está completo</li>
          </ul>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            {editingPayment ? 'Actualizar' : 'Procesar'} Pago
          </button>
          
          {editingPayment && (
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

export default PaymentForm;
