import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Historico = ({ onBack }) => {
  const [historicoData, setHistoricoData] = useState(null);
//usamos esto para cargar los datos del servidor con la ruta especificada
  useEffect(() => {
    axios.get('http://localhost:5000/historico')
      .then(response => {
        //guardamos los datos recibidos aquí
        setHistoricoData(response.data);
      })
      .catch(error => {
        console.error('Ha habido un error al intentar acceder a la url', error);
      });
  }, []);

  return (
    //html para la vista histórico
    <div>
      <h1>Histórico</h1>
      <button onClick={onBack}>Volver</button>
      {historicoData ? (
        <pre>{JSON.stringify(historicoData, null, 2)}</pre>
      ) : (
        <p>Cargando datos históricos...</p>
      )}
    </div>
  );
};

export default Historico;