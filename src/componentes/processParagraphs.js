import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; 
//muestra los parrafos de cada pagina que ha seleccionado el usuario
const ProcessParagraphs = ({ onBack }) => {
    const [selectedParagraphs, setSelectedParagraphs] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSelectedParagraphs = async () => {
            try {
                const response = await axios.post('/process_paragraphs', {
                    selected_paragraphs: {
                        doc1: ['1-0', '1-1'], 
                        doc2: ['2-0', '2-1']  
                    }
                });

                setSelectedParagraphs(response.data.selected_paragraphs);
            } catch (error) {
                setError('Error al obtener los párrafos seleccionados');
                console.error('Error:', error);
            }
        };

        fetchSelectedParagraphs();
    }, []);

    const formatParagraphInfo = (paragraphInfo) => {
        const [page, paragraph] = paragraphInfo.split('-');
        return `Página ${parseInt(page, 10)}, Párrafo ${parseInt(paragraph, 10) + 1}`;
    };
    

    return (
        <div className="process-paragraphs">
            <h2>Procesar Párrafos Seleccionados</h2>
            {error && <p className="error">{error}</p>}
            {selectedParagraphs ? (
                <div className="paragraphs-display">
                    <h3>Párrafos Seleccionados:</h3>
                    <div className="document-section">
                        <h4>Documento 1:</h4>
                        <ul>
                            {selectedParagraphs.doc1.map((paragraph, index) => (
                                <li key={`doc1-paragraph-${index}`}>
                                    {formatParagraphInfo(paragraph)}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="document-section">
                        <h4>Documento 2:</h4>
                        <ul>
                            {selectedParagraphs.doc2.map((paragraph, index) => (
                                <li key={`doc2-paragraph-${index}`}>
                                    {formatParagraphInfo(paragraph)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <p>Cargando párrafos seleccionados...</p>
            )}
            <button onClick={onBack}>Volver</button>
        </div>
    );
};

export default ProcessParagraphs;