"use client";

import React from 'react';
// import { ChevronDown } from 'lucide-react';

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
    <span className="text-gray-800">{value || '-'}</span>
  </div>
);

const formatArrayField = (value) => {
  if (!value) return '-';
  try {
    const array = JSON.parse(value);
    return Array.isArray(array) ? array.join(', ') : value;
  } catch {
    return value;
  }
};

const formatPrevisaoEntrega = (value) => {
  if (!value) return '-';
  try {
    const previsao = JSON.parse(value);
    return previsao.Texto || previsao.Data || '-';
  } catch {
    return value;
  }
};

const ObraDetalhes = ({ obra, className }) => {
  if (!obra) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className || ''}`}>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 bg-gray-100 p-2 -mx-6 pl-6">Detalhes da Obra</h2>
      <InfoItem label="Nome" value={obra.Nome} />
      <InfoItem label="SPE" value={obra.SPE} />
      <InfoItem label="Tipo de Obra" value={obra.Tipo_De_Obra} />
      <InfoItem label="Subsetor" value={obra.Subsetor} />
      <InfoItem label="Categoria de Uso" value={obra.Categoria_De_Uso} />
      <InfoItem label="Status" value={obra.Status} />
      <InfoItem label="Fase" value={obra.Fase} />
      <InfoItem label="Etapa" value={obra.Etapa} />
      <InfoItem label="Padrao de Acabamento" value={obra.Padrao_De_Acabamento} />
      <InfoItem label="Especificacao" value={obra.Especificacao} />
      <InfoItem label="Tipo de Investimento" value={obra.Tipo_De_Investimento} />
      <InfoItem label="Valor do Investimento" value={`${obra.Valor_Do_Investimento} ${obra.Grandeza_Do_Investimento}`} />
      <InfoItem label="Area" value={`${obra.Area} m²`} />
      <InfoItem label="Numero de Torres" value={obra.Numero_Torres} />
      <InfoItem label="Numero de Pisos" value={obra.Numero_Pisos} />
      <InfoItem label="Numero de Salas" value={obra.Numero_Salas} />
      <InfoItem label="Numero de Apartamentos" value={obra.Numero_Apartamentos} />
      <InfoItem label="Numero de Casas" value={obra.Numero_Casas} />
      <InfoItem label="Numero de Lojas" value={obra.Numero_Lojas} />
      <InfoItem label="Numero de Unidades" value={obra.Numero_Unidades} />
      <InfoItem label="CEP" value={obra.CEP} />
      <InfoItem label="Endereco" value={`${obra.Endereco}, ${obra.Numero_Endereco}`} />
      <InfoItem label="Complemento" value={obra.Complemento_Endereco} />
      <InfoItem label="Bairro" value={obra.Bairro} />
      <InfoItem label="Cidade" value={obra.Cidade} />
      <InfoItem label="Estado" value={obra.Estado} />
      <InfoItem label="Região" value={obra.Regiao} />
      <InfoItem label="Telefone Canteiro" value={obra.Telefone_Canteiro} />
      <InfoItem label="Data de Cadastro" value={obra.Data_Cadastro} />
      <InfoItem label="Data de Atualização" value={obra.Data_Atualizacao} />
      <InfoItem label="Data de Habilitação" value={obra.Data_Habilitacao} />
      <InfoItem label="Previsão de Término Fase/Etapa" value={obra.Previsao_Termino_Fase_Etapa} />
      <InfoItem label="Previsão de Entrega" value={formatPrevisaoEntrega(obra.Previsao_Entrega)} />
      <InfoItem label="Status de Atualização" value={obra.Status_Atualizacao} />
      <InfoItem label="Status de Cadastro" value={obra.Status_Cadastro} />

      <h3 className="text-xl font-bold mt-6 mb-2 text-gray-900 bg-gray-100 p-2 -mx-6 pl-6">Empresa</h3>
      <InfoItem label="Razão Social" value={obra.Empresa_Razao_Social} />
      <InfoItem label="Nome Fantasia" value={obra.Empresa_Nome_Fantasia} />
      <InfoItem label="CNPJ" value={obra.Empresa_CNPJ} />
      <InfoItem label="Tipos" value={formatArrayField(obra.Empresa_Tipos)} />
      <InfoItem label="Telefone" value={obra.Empresa_Telefone} />
      <InfoItem label="Endereco" value={`${obra.Empresa_Endereco}, ${obra.Empresa_Numero_Endereco}`} />
      <InfoItem label="Complemento" value={obra.Empresa_Complemento_Endereco} />
      <InfoItem label="Bairro" value={obra.Empresa_Bairro} />
      <InfoItem label="Cidade" value={obra.Empresa_Cidade} />
      <InfoItem label="Estado" value={obra.Empresa_Estado} />
      <InfoItem label="CEP" value={obra.Empresa_CEP} />
      <InfoItem label="Website" value={obra.Empresa_Website} />
      <InfoItem label="Empreendedor" value={obra.Empresa_Empreendedor === 'true' ? 'Sim' : 'Não'} />
      <InfoItem label="Responsável pela Execução" value={obra.Empresa_Reponsavel_Pela_Execucao === 'true' ? 'Sim' : 'Não'} />

      <h4 className="text-lg font-bold mt-4 mb-2 text-gray-900 bg-gray-100 p-2 -mx-6 pl-6">Contato</h4>
      <InfoItem label="Nome" value={obra.Contato_Nome} />
      <InfoItem label="Email" value={obra.Contato_Email} />
      <InfoItem label="Cargos" value={formatArrayField(obra.Contato_Cargos)} />
      <InfoItem label="Celular" value={obra.Contato_Celular} />
      <InfoItem label="Telefone" value={obra.Contato_Telefone} />
      <InfoItem label="Endereco" value={obra.Contato_Endereco ? `${obra.Contato_Endereco}, ${obra.Contato_Numero_Endereco}` : '-'} />
      <InfoItem label="Complemento" value={obra.Contato_Complemento_Endereco} />
      <InfoItem label="Bairro" value={obra.Contato_Bairro} />
      <InfoItem label="Cidade" value={obra.Contato_Cidade} />
      <InfoItem label="Estado" value={obra.Contato_Estado} />
      <InfoItem label="CEP" value={obra.Contato_CEP} />
      <InfoItem label="Data de Atualização" value={obra.Contato_Data_Atualizacao} />
    </div>
  );
};



export default ObraDetalhes; 
