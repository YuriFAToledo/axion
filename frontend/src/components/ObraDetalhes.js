"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';

// const InfoGroup = ({ title, children }) => {
//   const [isOpen, setIsOpen] = React.useState(true);

//   return (
//     <div className="border rounded-lg overflow-hidden">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full px-4 py-3 bg-gray-100 flex items-center justify-between text-left"
//       >
//         <span className="font-medium text-gray-900">{title}</span>
//         <ChevronDown
//           className={`w-5 h-5 text-gray-700 transition-transform ${
//             isOpen ? 'transform rotate-180' : ''
//           }`}
//         />
//       </button>
//       {isOpen && (
//         <div className="p-4 grid grid-cols-2 gap-4 bg-white">{children}</div>
//       )}
//     </div>
//   );
// };

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between py-2">
    <span className="font-semibold text-gray-900">{label}:</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

const ObraDetalhes = ({ obra }) => {
  if (!obra) return <div>Carregando...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 bg-gray-100 p-2 -mx-6 pl-6">Detalhes da Obra</h2>
      <InfoItem label="Nome" value={obra.Nome} />
      <InfoItem label="SPE" value={obra.SPE} />
      <InfoItem label="Tipo de Obra" value={obra.Tipo_De_Obra} />
      <InfoItem label="Status" value={obra.Status} />
      <InfoItem label="Fase" value={obra.Fase} />
      <InfoItem label="Padrao de Acabamento" value={obra.Padrao_De_Acabamento} />
      <InfoItem label="Especificacao" value={obra.Especificacao} />
      <InfoItem label="Tipo de Investimento" value={obra.Tipo_De_Investimento} />
      <InfoItem label="Valor do Investimento" value={`${obra.Valor_Do_Investimento} ${obra.Grandeza_Do_Investimento}`} />
      <InfoItem label="Area" value={`${obra.Area} m²`} />
      <InfoItem label="Numero de Lojas" value={obra.Numero_Lojas} />
      <InfoItem label="Endereco" value={`${obra.Endereco}, ${obra.Numero_Endereco}`} />
      <InfoItem label="Bairro" value={obra.Bairro} />
      <InfoItem label="Cidade" value={obra.Cidade} />
      <InfoItem label="Estado" value={obra.Estado} />
      <InfoItem label="Telefone Canteiro" value={obra.Telefone_Canteiro} />
      <h3 className="text-xl font-bold mt-6 mb-2 text-gray-900 bg-gray-100 p-2 -mx-6 pl-6">Empresas</h3>
      {obra.Empresas && obra.Empresas.map((empresa, index) => (
        <div key={index} className="mb-4">
          <InfoItem label="Razao Social" value={empresa.Razao_Social} />
          <InfoItem label="Nome Fantasia" value={empresa.Nome_Fantasia} />
          <InfoItem label="CNPJ" value={empresa.CNPJ} />
          <InfoItem label="Telefone" value={empresa.Telefone} />
          <h4 className="text-lg font-bold mt-4 mb-2 text-gray-900 bg-gray-100 p-2 -mx-6 pl-6">Contatos</h4>
          {empresa.Contatos.map((contato, idx) => (
            <div key={idx} className="mb-2">
              <InfoItem label="Nome" value={contato.Nome} />
              <InfoItem label="Email" value={contato.Email} />
              <InfoItem label="Celular" value={contato.Celular} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ObraDetalhes; 
