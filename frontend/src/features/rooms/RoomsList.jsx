import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/rooms/")
      .then((res) => setRooms(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando habitaciones...</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <section>
      <h2>Habitaciones</h2>
      {rooms.length === 0 ? (
        <p>No hay habitaciones registradas.</p>
      ) : (
        <ul>
          {rooms.map((room) => (
            <li key={room.id}>
              <strong>{room.room_type}</strong> — ${room.rate} / noche ({room.status})
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
