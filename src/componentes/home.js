import React, { useState } from 'react';
import axios from 'axios';

const Home = ({ onViewChange }) => {
  const [pdf1, setPdf1] = useState(null);
  const [pdf2, setPdf2] = useState(null);
  const [result, setResult] = useState(null);

//maneja los cambios del primer documento
  const handlePdf1Change = (event) => {
    setPdf1(event.target.files[0]);
  };

  //maneja los cambios del segundo documento
  const handlePdf2Change = (event) => {
    setPdf2(event.target.files[0]);
  };

  //envía los documentos al servidor como formData
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('pdf1', pdf1);
    formData.append('pdf2', pdf2);

    try {
      //usamos axio de terceros para enviar los documentos al servidor
      const response = await axios.post('http://localhost:5000/analizar_documentos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setResult(response.data); //guardamos la respuesta del servidor
    } catch (error) {
      console.error('Ha habido un error al intentar acceder a la URL', error);
      setResult({ 
        error: 'Ha habido un error en la respuesta de la solicitud',
        message: error.message,
        stack: error.stack,
        response: error.response ? error.response.data : 'No hay respuesta del servidor'
      });
    }
  };

  const formatResult = () => {
    if (result) {
      if (result.Similitud !== undefined) {
        // Convertimos la cadena de similitud a un número
        const similitud = parseFloat(result.Similitud);
        const isHighSimilarity = similitud >= 90.00;
        const message = isHighSimilarity
          ? `Los documentos son similares. Similitud: ${similitud}%`
          : `Los documentos no son similares. Similitud: ${similitud}%`;

        const resultStyle = {
          backgroundColor: 'white',
          color: isHighSimilarity ? 'green' : 'red',
          padding: '10px',
          marginTop: '20px',
        };

        return <div style={resultStyle}>{message}</div>;
      } else if (result.error) {
        return (
          <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', marginTop: '20px' }}>
            {result.error}
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <h1>Comparación de documentos PDF</h1>
      <input type="file" accept="application/pdf" onChange={handlePdf1Change} />
      <input type="file" accept="application/pdf" onChange={handlePdf2Change} />
      <button onClick={handleSubmit}>Comparar PDFs</button>
      <button onClick={() => onViewChange('historico')}>Ver histórico</button>
      
      {result && (
        <div>
          <h2>Resultado de la comparación</h2>
          {formatResult()}
          
        </div>
      )}
    </div>
  );
};

export default Home;