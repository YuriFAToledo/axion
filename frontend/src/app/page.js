"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ObraDetalhes from '../components/ObraDetalhes';
import AvaliacaoForm from '../components/AvaliacaoForm';

// Popup Component
const ConfirmationPopup = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

async function fetchNextWork() {
  try {
    const response = await fetch('https://clonex-labs.app.n8n.cloud/webhook/buscar-proxima-obra');
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    if (!text) {
      console.warn("Resposta da API vazia");
      return null;
    }
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error('Erro ao buscar próxima obra:', error);
    throw error;
  }
}

export default function Home() {
  const [obra, setObra] = useState(null);
  const [obrasRestantes, setObrasRestantes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false); // Estado para o popup

  useEffect(() => {
    let isActive = true;

    async function loadWork() {
      setLoading(true);
      try {
        const result = await fetchNextWork(); // A API agora retorna o objeto diretamente
        if (isActive) {
          console.log('Dados recebidos da API:', result);
          // A verificação agora é feita diretamente no objeto 'result'
          if (!result) {
            console.warn('Nenhum resultado recebido da API');
            setObra(null);
            setObrasRestantes(0);
          } else if (result.message) {
            // Caso não existam mais obras para avaliar
            console.log('Mensagem da API:', result.message);
            setObra(null);
            setObrasRestantes(result.count || 0);
          } else if (result.obra && result.count !== undefined) {
            // Caso normal com obra e count
            setObra(result.obra);
            setObrasRestantes(result.count);
          } else {
            console.warn('Dados da obra incompletos ou não recebidos da API', result);
            setObra(result.obra || null);
            setObrasRestantes(result.count || 0);
          }
        }
      } catch (error) {
        console.error('Falha ao carregar obra no useEffect:', error);
        if (isActive) {
          setObra(null);
          setObrasRestantes(0);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }
    loadWork();

    return () => {
      isActive = false;
    };
  }, []);

  const handlePopupClose = () => {
    setShowConfirmationPopup(false);
    window.location.reload(); // Recarrega a página
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
        <p className="text-xl font-bold text-gray-900">Não há mais obras para avaliar.</p>
      </div>
    );
  }

  if (!obra) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <p className="text-xl font-bold text-gray-700 mb-2">Não foi possível carregar a obra atual.</p>
        {obrasRestantes > 0 && <p className="text-md text-gray-600">Ainda há {obrasRestantes} obras para avaliar.</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full px-8 py-4 bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="w-auto h-12 flex items-center justify-center">
            <Image src="/clonex.jpeg" alt="Clonex Logo" width={128} height={48} className="object-contain h-full" priority />
          </div>
          <div className="w-auto h-12 flex items-center justify-center">
            <Image src="/axion.jpeg" alt="Axion Logo" width={128} height={48} className="object-contain h-full" priority />
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="text-lg font-semibold text-gray-800 mb-4">Obras restantes: {obrasRestantes}</div>
        <ObraDetalhes obra={obra} className="bg-white p-6 rounded-lg shadow-md" />
        <AvaliacaoForm obra={obra} setObrasRestantes={setObrasRestantes} setShowPopup={setShowConfirmationPopup} />
      </main>
      <ConfirmationPopup
        message={showConfirmationPopup ? "Avaliação processada com sucesso!" : null}
        onClose={handlePopupClose}
      />
    </div>
  );
} 
