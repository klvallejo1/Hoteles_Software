import React, { useState } from "react";
import Navigation from "./components/Navigation";
import RoomList from "./components/RoomList";
import RoomForm from "./components/RoomForm";
import ClientList from "./components/ClientList";
import ClientForm from "./components/ClientForm";
import ReservationList from "./components/ReservationList";
import ReservationForm from "./components/ReservationForm";
import InvoiceList from "./components/InvoiceList";
import InvoiceForm from "./components/InvoiceForm";
import PaymentList from "./components/PaymentList";
import PaymentForm from "./components/PaymentForm";

const App = () => {
  const [activeSection, setActiveSection] = useState('rooms');
  
  // Estados para habitaciones
  const [editingRoom, setEditingRoom] = useState(null); 
  const [refreshRooms, setRefreshRooms] = useState(false);
  
  // Estados para clientes
  const [editingClient, setEditingClient] = useState(null);
  const [refreshClients, setRefreshClients] = useState(false);
  
  // Estados para reservas
  const [editingReservation, setEditingReservation] = useState(null);
  const [refreshReservations, setRefreshReservations] = useState(false);

  // Estados para facturas
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [refreshInvoices, setRefreshInvoices] = useState(false);

  // Estados para pagos
  const [editingPayment, setEditingPayment] = useState(null);
  const [refreshPayments, setRefreshPayments] = useState(false);

  // Funciones de actualización
  const handleRoomCreated = () => setRefreshRooms(!refreshRooms);
  const handleClientCreated = () => setRefreshClients(!refreshClients);
  const handleReservationCreated = () => setRefreshReservations(!refreshReservations);
  const handleInvoiceCreated = () => setRefreshInvoices(!refreshInvoices);
  const handlePaymentCreated = () => setRefreshPayments(!refreshPayments);

  const renderContent = () => {
    switch(activeSection) {
      case 'rooms':
        return (
          <>
            <RoomForm
              onRoomCreated={handleRoomCreated}
              editingRoom={editingRoom}
              setEditingRoom={setEditingRoom}
            />
            <RoomList
              key={refreshRooms}           
              setEditingRoom={setEditingRoom}
            />
          </>
        );
      
      case 'clients':
        return (
          <>
            <ClientForm
              onClientCreated={handleClientCreated}
              editingClient={editingClient}
              setEditingClient={setEditingClient}
            />
            <ClientList
              key={refreshClients}
              setEditingClient={setEditingClient}
            />
          </>
        );
      
      case 'reservations':
        return (
          <>
            <ReservationForm
              onReservationCreated={handleReservationCreated}
              editingReservation={editingReservation}
              setEditingReservation={setEditingReservation}
            />
            <ReservationList
              key={refreshReservations}
              setEditingReservation={setEditingReservation}
            />
          </>
        );
      
      case 'invoices':
        return (
          <>
            <InvoiceForm
              onInvoiceCreated={handleInvoiceCreated}
              editingInvoice={editingInvoice}
              setEditingInvoice={setEditingInvoice}
            />
            <InvoiceList
              key={refreshInvoices}
              setEditingInvoice={setEditingInvoice}
            />
          </>
        );
      
      case 'payments':
        return (
          <>
            <PaymentForm
              onPaymentCreated={handlePaymentCreated}
              editingPayment={editingPayment}
              setEditingPayment={setEditingPayment}
            />
            <PaymentList
              key={refreshPayments}
              setEditingPayment={setEditingPayment}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <div className="flex flex-col items-center py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
