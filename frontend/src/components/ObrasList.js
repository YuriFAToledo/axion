import React from 'react';

const ObrasList = () => {
  // Dados de exemplo
  const obras = [
    { id: 1, nome: 'Obra A', status: 'Em andamento', descricao: 'Descrição da Obra A' },
    { id: 2, nome: 'Obra B', status: 'Concluída', descricao: 'Descrição da Obra B' },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Lista de Obras</h2>
      <ul className="space-y-4">
        {obras.map((obra) => (
          <li key={obra.id} className="border p-4 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold">{obra.nome}</h3>
            <p className="text-gray-600">Status: {obra.status}</p>
            <p className="text-gray-700 mt-2">{obra.descricao}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ObrasList; 