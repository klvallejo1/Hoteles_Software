import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentList = ({ setEditingPayment }) => {
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/payments/clients')
      .then(response => {
        let data = response.data.filter(element => element.payment!==null)
        setPaymentRecords(data)
      })
      .catch(error => {
        console.error(error);
        setError('No se pudieron cargar los pagos.');
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este pago?")) return;
    try {
      await axios.delete(`http://localhost:8000/payments/${id}`);
      setPaymentRecords(paymentRecords.filter(record => record.payment.id !== id));
    } catch (error) {
      console.error("Error al eliminar pago:", error);
      alert("No se pudo eliminar el pago");
    }
  };

  const getMethodColor = (method) => {
    const colors = {
      'efectivo': 'bg-green-100 text-green-800',
      'tarjeta': 'bg-blue-100 text-blue-800',
      'transferencia': 'bg-purple-100 text-purple-800',
      'cheque': 'bg-yellow-100 text-yellow-800'
    };
    return colors[method.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Pagos</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-emerald-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Factura</th>
              <th className="py-3 px-6 text-left">Cliente</th>
              <th className="py-3 px-6 text-left">Método</th>
              <th className="py-3 px-6 text-left">Monto</th>
              <th className="py-3 px-6 text-left">Fecha Pago</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {paymentRecords.map(record => (
              <tr key={record.payment.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{record.payment.id}</td>
                <td className="py-3 px-6">
                  {record.invoice ? `Factura #${record.invoice.id}` : 'Factura no encontrada'}
                </td>
                <td className="py-3 px-6">
                  {record.client.name ? 
                    record.client.name : 
                    'Cliente no encontrado'
                  }
                </td>
                <td className="py-3 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(record.payment.method)}`}>
                    {record.payment.method}
                  </span>
                </td>
                <td className="py-3 px-6 font-semibold">${record.payment.amount}</td>
                <td className="py-3 px-6">{record.payment.payment_date}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => {
                      setEditingPayment(record.payment);
                      window.scrollTo(0, 0);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(record.payment.id)}
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

export default PaymentList;
