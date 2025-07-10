import React, { useState } from 'react';
import RoomList from './components/RoomList';
import RoomForm from './components/RoomForm';

const App = () => {
  const [refresh, setRefresh] = useState(false);

  const handleRoomCreated = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start py-8 text-black">
      <RoomForm onRoomCreated={handleRoomCreated} />
      <RoomList key={refresh} />
    </div>
  );
};

export default App;
