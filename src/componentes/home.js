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

  return (
    //html para la vista del comparador de pdf, por defecto home
    <div>
      <h1>Comparacion de documentos PDF</h1>
      <input type="file" accept="application/pdf" onChange={handlePdf1Change} />
      <input type="file" accept="application/pdf" onChange={handlePdf2Change} />
      <button onClick={handleSubmit}>Comparar PDFs</button>
      <button onClick={() => onViewChange('historico')}>Ver histórico</button>
      
      {result && (
        <div>
          <h2>Resultado:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Home;