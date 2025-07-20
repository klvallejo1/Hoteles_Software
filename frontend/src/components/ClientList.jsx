import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientList = ({ setEditingClient }) => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Cargando clientes...');
    axios.get('http://localhost:8000/clients/')
      .then(response => {
        console.log('Clientes cargados:', response.data);
        setClients(response.data);
      })
      .catch(error => {
        console.error('Error cargando clientes:', error);
        setError('No se pudieron cargar los clientes.');
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este cliente?")) return;
    try {
      await axios.delete(`http://localhost:8000/clients/${id}`);
      setClients(clients.filter(client => client.id !== id));
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      alert("No se pudo eliminar el cliente");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Clientes Registrados</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Nombre</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Teléfono</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {clients.map(client => (
              <tr key={client.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{client.id}</td>
                <td className="py-3 px-6">{client.name}</td>
                <td className="py-3 px-6">{client.email}</td>
                <td className="py-3 px-6">{client.phone || 'N/A'}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => {
                      setEditingClient(client);
                      window.scrollTo(0, 0);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
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

export default ClientList;
