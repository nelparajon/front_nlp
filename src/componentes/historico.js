import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css'; // Importamos los estilos CSS


const Historico = ({ onBack }) => {
  const [historicoData, setHistoricoData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/historico') // Petición a la ruta relativa
      .then(response => {
        const sortedData = response.data.Peticiones.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
        setHistoricoData(sortedData);
      })
      .catch(error => {
        console.error('Ha habido un error al intentar acceder a la url', error);
        setError('Ha habido un error al intentar acceder a los datos.');
      });
  }, []);

  const formatResult = () => {
    if (historicoData) {
      return (
      
        <div>
          <h1>Histórico de peticiones</h1>
          <div className='container'>
            <div className="column">
              <div className="header-cell">Documento 1</div>
              {historicoData.map((item, index) => (
                <div key={index} className="cell">{item.doc1}</div>
              ))}
            </div>
            <div className="column">
              <div className="header-cell">Documento 2</div>
              {historicoData.map((item, index) => (
                <div key={index} className="cell">{item.doc2}</div>
              ))}
            </div>
            <div className="column">
              <div className="header-cell">Fecha</div>
              {historicoData.map((item, index) => (
                <div key={index} className="cell">{item.Fecha}</div>
              ))}
            </div>
            <div className="column">
              <div className="header-cell">Similitud</div>
              {historicoData.map((item, index) => (
                <div key={index} className="cell">{item.Similitud > 90 ? 'SI' : 'NO'}</div>
              ))}
            </div>
            <div className="column">
              <div className="header-cell">Porcentaje</div>
              {historicoData.map((item, index) => (
                <div key={index} className="cell">{item.Similitud !== null ? `${item.Similitud}%` : 'N/A'}</div>
              ))}
            </div>
          </div>
          <h2>Datos JSON crudos</h2>
        <pre>{JSON.stringify(historicoData, null, 2)}</pre>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <button onClick={onBack}>Volver</button>
      {error ? (
        <p>{error}</p>
      ) : historicoData ? (
        formatResult()
      ) : (
        <p>Cargando datos históricos...</p>
      )}
    </div>
  );
};

export default Historico;