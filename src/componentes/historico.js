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
                <div key={index} className="cell">{item.Similitud !== null ? item.Similitud + '%' : 'N/A'}</div>
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