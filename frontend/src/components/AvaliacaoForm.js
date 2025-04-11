"use client";

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

async function saveEvaluation(obraCodigo, nota, justificativa) {
  const response = await fetch('https://clonex-labs.app.n8n.cloud/webhook/salvar-avaliacao', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      {
        obra_codigo: obraCodigo,
        nota: nota,
        justificativa: justificativa,
      },
    ]),
  });
  return response.json();
}

const AvaliacaoForm = ({ obra, setShowPopup, setObrasRestantes }) => {
  const [rating, setRating] = useState(null);
  const [justification, setJustification] = useState('');

  const handleSubmit = async () => {
    if (rating !== null && justification.trim() !== '') {
      await saveEvaluation(obra.Codigo, rating, justification);
      console.log('Avaliação enviada:', rating, justification);
      setRating(null);
      setJustification('');
      setObrasRestantes(prev => prev - 1);
      setShowPopup(true); // Mostrar popup de confirmação
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <p className="text-sm text-gray-700 mb-3">Avaliação</p>
      <div className="flex gap-2 flex-wrap">
        {[...Array(11)].map((_, i) => (
          <button
            key={i}
            onClick={() => setRating(i)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              rating === i ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            <span className={`font-semibold ${rating === i ? 'text-white' : 'text-gray-800'}`}>{i}</span>
          </button>
        ))}
      </div>
      <div className="mt-6">
        <p className="text-sm text-gray-700 mb-3">Justificativa</p>
        <textarea
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          className="w-full h-32 p-3 bg-white border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          placeholder="Explique sua avaliação..."
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={rating === null || justification.trim() === ''}
        className={`w-full py-3 rounded-lg mt-6 flex items-center justify-center gap-2 transition-colors duration-200 ${
          rating !== null && justification.trim() !== ''
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <CheckCircle size={20} />
        Enviar avaliação
      </button>
    </div>
  );
};

export default AvaliacaoForm; 