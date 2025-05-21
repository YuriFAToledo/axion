"use client";

import React, { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

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
  console.log(obra);
  const [rating, setRating] = useState(null);
  const [pontosPositivos, setPontosPositivos] = useState('');
  const [pontosNegativos, setPontosNegativos] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating !== null && pontosPositivos.trim() !== '' && pontosNegativos.trim() !== '' && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await saveEvaluation(obra.projectId, rating, pontosPositivos, pontosNegativos);
        console.log('Avaliação enviada:', rating, pontosPositivos, pontosNegativos);
        setRating(null);
        setPontosPositivos('');
        setPontosNegativos('');
        setObrasRestantes(prev => prev - 1);
        setShowPopup(true); // Mostrar popup de confirmação
      } catch (error) {
        console.error("Erro ao salvar avaliação:", error);
        // Aqui você poderia mostrar um popup de erro se desejado
        // Por exemplo: setShowErrorPopup("Falha ao enviar. Tente novamente.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const canSubmit = rating !== null && pontosPositivos.trim() !== '' && pontosNegativos.trim() !== '';

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <p className="text-sm text-gray-700 mb-3">Avaliação</p>
      <div className="flex gap-2 flex-wrap">
        {[...Array(11)].map((_, i) => (
          <button
            key={i}
            onClick={() => setRating(i)}
            disabled={isSubmitting}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              rating === i ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
            } ${isSubmitting ? 'cursor-not-allowed' : ''}`}
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
          disabled={isSubmitting}
          className="w-full h-24 p-3 bg-white border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          placeholder="Descreva os pontos positivos..."
        />
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-700 mb-3">Pontos Negativos</p>
        <textarea
          value={pontosNegativos}
          onChange={(e) => setPontosNegativos(e.target.value)}
          disabled={isSubmitting}
          className="w-full h-24 p-3 bg-white border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          placeholder="Descreva os pontos negativos..."
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || isSubmitting}
        className={`w-full py-3 rounded-lg mt-6 flex items-center justify-center gap-2 transition-colors duration-200 ${
          canSubmit && !isSubmitting
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <CheckCircle size={20} />
            Enviar avaliação
          </>
        )}
      </button>
    </div>
  );
};

export default AvaliacaoForm; 