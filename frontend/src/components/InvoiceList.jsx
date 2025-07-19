import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvoiceList = ({ setEditingInvoice }) => {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/invoices/')
      .then(response => setInvoices(response.data))
      .catch(error => {
        console.error(error);
        setError('No se pudieron cargar las facturas.');
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta factura?")) return;
    try {
      await axios.delete(`http://localhost:8000/invoices/${id}`);
      setInvoices(invoices.filter(invoice => invoice.id !== id));
    } catch (error) {
      console.error("Error al eliminar factura:", error);
      alert("No se pudo eliminar la factura");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Facturas</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Reserva</th>
              <th className="py-3 px-6 text-left">Cliente</th>
              <th className="py-3 px-6 text-left">Monto</th>
              <th className="py-3 px-6 text-left">Fecha Emisión</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {invoices.map(invoice => (
              <tr key={invoice.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{invoice.id}</td>
                <td className="py-3 px-6">
                  {invoice.reservation ? `Reserva #${invoice.reservation.id}` : 'Reserva no encontrada'}
                </td>
                <td className="py-3 px-6">
                  {invoice.reservation?.client ? invoice.reservation.client.name : 'Cliente no encontrado'}
                </td>
                <td className="py-3 px-6 font-semibold">${invoice.amount}</td>
                <td className="py-3 px-6">{invoice.issue_date}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => {
                      setEditingInvoice(invoice);
                      window.scrollTo(0, 0);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(invoice.id)}
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

export default InvoiceList;
