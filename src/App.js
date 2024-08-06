import React, { useState } from 'react';
import Home from './componentes/home';
import Historico from './componentes/historico';

//componente principal App
const App = () => {
  const [currentView, setCurrentView] = useState('home');

  //manejamos la vista actual, por defecto home
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div>
      {/* Inicia el componente Home si la vista actual es 'home' */}
      {currentView === 'home' && <Home onViewChange={handleViewChange} />}
      {/* Inicia el componente historico si la vista es historico */}
      {currentView === 'historico' && <Historico onBack={() => handleViewChange('home')} />}
    </div>
  );
};

export default App;