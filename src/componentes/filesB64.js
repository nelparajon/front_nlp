import React, { useState } from 'react';
import axios from 'axios';

const FilesB64 = ({ onViewChange }) => {
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

  //convertimos los archivos a base64 antes de enviarlos
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            let base64String = reader.result.split(',')[1]; // Remover el prefijo de datos data:application/pdf;base64,
            console.log('CADENA CONVERTIDA: ', JSON.stringify(base64String, null, 2)) //comprobar que la cadena resultante sea correcta
            resolve(base64String);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
};

  //envía los documentos al servidor como formData
  const handleSubmit = async () => {
    const jsonData = {
      'file1':{
        'name': pdf1.name,
        'content': await convertToBase64(pdf1)
      },
      'file2':{
        'name': pdf2.name,
        'content': await convertToBase64(pdf2)
      }
    }
    
    console.log('Datos JSON a enviar:', JSON.stringify(jsonData, null, 2));

    try {
      //usamos axio de terceros para enviar los documentos al servidor
      const response = await axios.post('/analizar_documentos_b64', jsonData, {
        headers: {
          'Content-Type': 'application/json',
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
      <h1>Comparación de documentos PDF en Base64</h1>
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

export default FilesB64;