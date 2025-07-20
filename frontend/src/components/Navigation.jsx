import React from 'react';

const Navigation = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'rooms', name: 'Habitaciones', icon: '🏠' },
    { id: 'clients', name: 'Clientes', icon: '👥' },
    { id: 'reservations', name: 'Reservas', icon: '📅' },
    { id: 'payments', name: 'Pagos', icon: '💳' },
    { id: 'invoices', name: 'Facturas', icon: '📋' },
  ];

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Sistema de Gestión Hotelera</h1>
        <div className="flex flex-wrap justify-center gap-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                activeSection === section.id
                  ? 'bg-blue-800 text-white'
                  : 'bg-blue-500 hover:bg-blue-700'
              }`}
            >
              <span>{section.icon}</span>
              {section.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
