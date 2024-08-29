import React, { useState } from 'react';
import Home from './componentes/home';
import Historico from './componentes/historico';
import FilesB64 from './componentes/filesB64';
import GetParagraphs from './componentes/getParagraphs.js';
import ProcessParagraphs from './componentes/processParagraphs.js';


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
      {/* Inicia el componente upload_files_b64 si la vista actual es 'upload_files_b64' */}
      {currentView === 'filesB64' && <FilesB64 onViewChange={handleViewChange} />}
      {/* Inicia el componente GetParagraphs si la vista actual es 'getParagraphs' */}
    {currentView === 'getParagraphs' && (<GetParagraphs onBack={() => handleViewChange('home')} onViewChange={handleViewChange} />)}
    {/* Inicia el componente ProcessParagraphs si la vista actual es 'processParagraphs' */}
    {currentView === 'processParagraphs' && (<ProcessParagraphs onBack={() => handleViewChange('home')} onViewChange={handleViewChange} />)}</div>
);
};

export default App;