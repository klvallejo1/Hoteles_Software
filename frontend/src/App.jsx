import React, { useState } from "react";
import RoomList from "./components/RoomList";
import RoomForm from "./components/RoomForm";

const App = () => {

  const [editingRoom, setEditingRoom] = useState(null); 
  const [refresh, setRefresh] = useState(false);        

  // se invoca tras crear / editar
  const handleRoomCreated = () => setRefresh(!refresh);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">

      <RoomForm
        onRoomCreated={handleRoomCreated}
        editingRoom={editingRoom}
        setEditingRoom={setEditingRoom}
      />

      <RoomList
        key={refresh}           
        setEditingRoom={setEditingRoom}
      />
    </div>
  );
};

export default App;
