import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; 
import ProcessParagraphs from './processParagraphs'; 

//primero pedimos las paginas que quiere analizar el usuario, después los parrafos
//le pasamos todo al servidor a través de un formulario
const GetParagraphs = ({ onViewChange, onBack }) => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [selectedPagesInput, setSelectedPagesInput] = useState('');
  const [result, setResult] = useState(null);
  const [selectedParrafos, setSelectedParrafos] = useState({ doc1: [], doc2: [] });
  const [step, setStep] = useState(1);

  const handleFileChange = (setter) => (e) => setter(e.target.files[0]);

  const handleParagraphSelection = (doc, page, paragraph) => {
    setSelectedParrafos((prevState) => {
      const key = doc === 1 ? 'doc1' : 'doc2';
      const paragraphKey = `${page}-${paragraph}`;
      
      let updatedSelection;
      if (prevState[key].includes(paragraphKey)) {
        updatedSelection = prevState[key].filter(p => p !== paragraphKey);
      } else {
        updatedSelection = [...prevState[key], paragraphKey];
      }
  
      return { ...prevState, [key]: updatedSelection };
    });
  };

  const handleSubmit = async () => {
    if (!file1 || !file2) {
      alert('Por favor, carga ambos documentos.');
      return;
    }

    const selectedPages = selectedPagesInput.split(',').map(page => parseInt(page.trim(), 10)).filter(page => !isNaN(page));
    if (selectedPages.length === 0) {
      alert('Por favor, ingresa al menos una página válida.');
      return;
    }

    const formData = new FormData();
    formData.append('doc1', file1);
    formData.append('doc2', file2);
    formData.append('selected_pages', selectedPages.join(','));

    try {
      const response = await axios.post('/get_paragraphs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      setStep(2);
    } catch (error) {
      console.error('Error al procesar las imágenes', error);
    }
  };

  const handleConfirmSelection = async () => {
    const { doc1, doc2 } = selectedParrafos;
    if (doc1.length !== doc2.length) {
      alert('La selección de párrafos debe ser igual en ambos documentos.');
      return;
    }
    try {
      const response = await axios.post('/process_paragraphs', {
        selected_paragraphs: selectedParrafos
      });

      console.log('Respuesta del servidor:', response.data);
      
      // Cambiar a la vista de ProcessParagraphs después de confirmar la selección
      onViewChange('processParagraphs');
    } catch (error) {
      console.error('Error al enviar los párrafos seleccionados', error);
    }
  };

  const renderParagraphSelection = (doc, docKey) => {
    return (
      <div>
        <h3>{`Documento ${doc}`}</h3>
        {Object.entries(result[docKey].images_with_contours).map(([page, image]) => (
          <div key={`doc${doc}-page-${page}`}>
            <h4>{`Página ${page}`}</h4>
            <img src={`data:image/png;base64,${image}`} alt={`Página ${page}`} style={{ width: '600px', height: 'auto' }} />
            {result[docKey].contours_positions[page] && (
              <>
                <p>{`Número de párrafos: ${result[docKey].contours_positions[page].length}`}</p>
                {result[docKey].contours_positions[page].map((_, index) => (
                  <div key={`doc${doc}-paragraph-${page}-${index}`}>
                    <input
                      type="checkbox"
                      onChange={() => handleParagraphSelection(doc, page, index)}
                      checked={selectedParrafos[docKey].includes(`${page}-${index}`)}
                    />
                    <label>{`Párrafo ${index + 1}`}</label>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <h1>Cargar Documentos</h1>
          <div className='file-upload'>
            <label>Documento 1:</label>
            <input type='file' onChange={handleFileChange(setFile1)} />
          </div>
          <div className='file-upload'>
            <label>Documento 2:</label>
            <input type='file' onChange={handleFileChange(setFile2)} />
          </div>
          <div>
            <h3>Ingresa las páginas que deseas procesar (formato: 1,2,3...):</h3>
            <input
              type="text"
              value={selectedPagesInput}
              onChange={(e) => setSelectedPagesInput(e.target.value)}
              placeholder="Ejemplo: 1,3,5"
            />
          </div>
          <button onClick={handleSubmit}>Procesar Páginas</button>
        </div>
      )}

      {step === 2 && result && (
        <div className='result'>
          <h2>Selecciona los Párrafos</h2>
          {renderParagraphSelection(1, 'doc1')}
          {renderParagraphSelection(2, 'doc2')}
          <button onClick={handleConfirmSelection}>Confirmar Selección</button>
          <button onClick={onBack}>Volver a Home</button>
        </div>
      )}
    </div>
  );
};

export default GetParagraphs;
