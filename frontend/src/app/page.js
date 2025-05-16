"use client";

import React, { useEffect, useState } from 'react';
import ObraDetalhes from '../components/ObraDetalhes';
import AvaliacaoForm from '../components/AvaliacaoForm';

console.log('=== TESTE DE LOG ===');

async function fetchNextWork() {
  try {
    console.log('Iniciando busca da próxima obra...');
    const response = await fetch('https://clonex-labs.app.n8n.cloud/webhook/buscar-proxima-obra');
    
    if (!response.ok) {
      throw new Error('Erro na req dos crias');
    }

    const text = await response.text();
    console.log('Resposta do n8n:', text);
    
    if (!text) {
      throw new Error('Resposta vazia');
    }

    const data = JSON.parse(text);
    console.log('Dados parseados:', data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar obra:', error);
    throw error;
  }
}

export default function Home() {
  console.log('Renderizando componente Home');
  const [obra, setObra] = useState(null);
  const [obrasRestantes, setObrasRestantes] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect executando...');
    async function loadWork() {
      try {
        const data = await fetchNextWork();
        console.log('Dados recebidos em loadWork:', data);
        
        if (!data) {
          console.log('Nenhum dado recebido');
          setObra(null);
          setObrasRestantes(0);
        } else {
          console.log('Dados da obra:', data.obra);
          console.log('Count:', data.count);
          setObra(data.obra);
          setObrasRestantes(data.count);
        }
      } catch (error) {
        console.error('Erro ao carregar obra:', error);
        setObra(null);
      } finally {
        setLoading(false);
      }
    }
    loadWork();
  }, []);

  const handlePopupClose = () => {
    setShowPopup(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-gray-900">Carregando...</p>
      </div>
    );
  }

  if (!obra && obrasRestantes === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-gray-900">Não há mais obras para avaliar</p>
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