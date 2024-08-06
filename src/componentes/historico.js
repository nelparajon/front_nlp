import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css'; // Importamos los estilos CSS

const Historico = ({ onBack }) => {
  const [historicoData, setHistoricoData] = useState(null);

  // Usamos esto para cargar los datos del servidor con la ruta especificada
  useEffect(() => {
    axios.get('http://localhost:5000/historico')
      .then(response => {
        //ordenados las peticiones en orden descendente
        const sortedData = response.data.Peticiones.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
        // Guardamos los datos recibidos aquí
        setHistoricoData(sortedData);
      })
      .catch(error => {
        console.error('Ha habido un error al intentar acceder a la url', error);
      });
  }, []);

  const formatResult = () => {
    if (historicoData) {
      return (
        <div>
          <h1>Histórico de peticiones</h1>
          <div className='container'>
            <div className="column">
              <h3>Estado</h3>
              {historicoData.map((item, index) => (
                <div key={index} className="row">
                  <div className="cell">{item.Estado}</div>
                </div>
              ))}
            </div>
            <div className="column">
              <h3>Fecha</h3>
              {historicoData.map((item, index) => (
                <div key={index} className="row">
                  <div className="cell">{item.Fecha}</div>
                </div>
              ))}
            </div>
            <div className="column">
              <h3>Mensaje</h3>
              {historicoData.map((item, index) => (
                <div key={index} className="row">
                  <div className="cell">{item.Mensaje}</div>
                </div>
              ))}
            </div>
            <div className="column">
              <h3>Similitud</h3>
              {historicoData.map((item, index) => (
                <div key={index} className="row">
                  <div className="cell">{item.Similitud !== null ? item.Similitud + '%' : 'N/A'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    // HTML para la vista histórico
    <div>
      <h1>Histórico</h1>
      <button onClick={onBack}>Volver</button>
      {historicoData ? (
        formatResult()
      ) : (
        <p>Cargando datos históricos...</p>
      )}
    </div>
  );
};

export default Historico;