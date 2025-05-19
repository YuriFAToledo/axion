"use client";

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

async function saveEvaluation(obraCodigo, nota, pontosPositivos, pontosNegativos) {
  const response = await fetch('https://clonex-labs.app.n8n.cloud/webhook/salvar-avaliacao', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      {
        obra_codigo: obraCodigo,
        nota: nota,
        pontos_positivos: pontosPositivos,
        pontos_negativos: pontosNegativos,
      },
    ]),
  });
  return response.json();
}

const AvaliacaoForm = ({ obra, setShowPopup, setObrasRestantes }) => {
  const [rating, setRating] = useState(null);
  const [pontosPositivos, setPontosPositivos] = useState('');
  const [pontosNegativos, setPontosNegativos] = useState('');

  const handleSubmit = async () => {
    if (rating !== null && pontosPositivos.trim() !== '' && pontosNegativos.trim() !== '') {
      await saveEvaluation(obra.Codigo, rating, pontosPositivos, pontosNegativos);
      console.log('Avaliação enviada:', rating, pontosPositivos, pontosNegativos);
      setRating(null);
      setPontosPositivos('');
      setPontosNegativos('');
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
        <p className="text-sm text-gray-700 mb-3">Pontos Positivos</p>
        <textarea
          value={pontosPositivos}
          onChange={(e) => setPontosPositivos(e.target.value)}
          className="w-full h-24 p-3 bg-white border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          placeholder="Descreva os pontos positivos..."
        />
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-700 mb-3">Pontos Negativos</p>
        <textarea
          value={pontosNegativos}
          onChange={(e) => setPontosNegativos(e.target.value)}
          className="w-full h-24 p-3 bg-white border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          placeholder="Descreva os pontos negativos..."
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={rating === null || pontosPositivos.trim() === '' || pontosNegativos.trim() === ''}
        className={`w-full py-3 rounded-lg mt-6 flex items-center justify-center gap-2 transition-colors duration-200 ${
          rating !== null && pontosPositivos.trim() !== '' && pontosNegativos.trim() !== ''
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