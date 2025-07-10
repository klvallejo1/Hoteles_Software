import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomsList from "./features/rooms/RoomsList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<h1>Dashboard</h1>} />
        <Route path="/rooms"  element={<RoomsList />} />
        {/* aquí irán Clients, Reservations */}
      </Routes>
    </BrowserRouter>
  );
}
