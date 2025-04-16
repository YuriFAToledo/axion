"use client";

import React, { useEffect, useState } from 'react';
import ObraDetalhes from '../components/ObraDetalhes';
import AvaliacaoForm from '../components/AvaliacaoForm';

async function fetchNextWork() {
  const response = await fetch('https://clonex-labs.app.n8n.cloud/webhook/buscar-proxima-obra');
  
  if (!response.ok) {
    throw new Error('Erro na req dos crias');
  }

  const text = await response.text();
  if (!text) {
    throw new Error('Resposta vazia');
  }

  return JSON.parse(text);
}

export default function Home() {
  const [obra, setObra] = useState(null);
  const [obrasRestantes, setObrasRestantes] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWork() {
      try {
        const data = await fetchNextWork();
        if (!data || data.length === 0) {
          setObra(null);
          setObrasRestantes(0);
        } else {
          const { count, obra } = data;
          setObra(obra);
          setObrasRestantes(count);
        }
      } catch (error) {
        console.error(error);
        setObra(null);
      } finally {
        setLoading(false);
      }
    }
    loadWork();
  }, []);

  const handlePopupClose = () => {
    setShowPopup(false);
    window.location.reload(); // Recarregar a página
  };

  if (!obra && obrasRestantes === 0 && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-gray-900">Carregando...</p>
      </div>
    );
  }

  if (!obra) return <div className="min-h-screen bg-white"></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full px-8 py-4 bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="w-32 h-12 flex items-center justify-center">
            <img src="/clonex.jpeg" alt="Clonex Logo" className="h-12 object-contain" />
          </div>
          <div className="w-32 h-12 flex items-center justify-center">
            <img src="/axion.jpeg" alt="Axion Logo" className="h-12 object-contain" />
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        {showPopup && <Popup onClose={handlePopupClose} />}
        <div className="text-lg font-semibold text-gray-800 mb-4">Obras restantes: {obrasRestantes}</div>
        <ObraDetalhes obra={obra} className="bg-white p-6 rounded-lg shadow-md" />
        <AvaliacaoForm obra={obra} setShowPopup={setShowPopup} setObrasRestantes={setObrasRestantes} />
      </main>
    </div>
  );
}

const Popup = ({ onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 max-w-sm w-full">
      <h2 className="text-xl font-bold mb-4 text-center text-black">Avaliação Concluída!</h2>
      <p className="text-gray-700 text-center mb-4">Obrigado por sua avaliação. A próxima obra será carregada em breve.</p>
      <button onClick={onClose} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">OK</button>
    </div>
  </div>
); 