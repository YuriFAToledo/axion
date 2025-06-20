"use client";

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'; // Exemplo, instale @heroicons/react

// --- Funções Auxiliares ---

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return dateString; // Retorna o original se não puder formatar
  }
};

const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(value);
};

const formatYearMonth = (yearMonth) => {
  if (!yearMonth) return '-';
  const s = String(yearMonth);
  if (s.length !== 6) return s; // Retorna o valor original se não tiver 6 dígitos
  return `${s.substring(0, 4)}/${s.substring(4, 6)}`;
};

const renderAddress = (address) => {
  if (!address) return '-';
  const parts = [
    address.addressLine1_pt || address.addressLine1,
    address.addressLine2,
    address.city,
    address.countyName_pt || address.countyName,
    address.stateName,
    address.postalCode,
    address.countryName_pt || address.countryName,
  ].filter(Boolean);
  return parts.join(', ');
};

// --- Componentes Internos ---

const InfoRow = ({ label, value, className = '' }) => (
  <div className={`py-2 sm:grid sm:grid-cols-3 sm:gap-4 ${className}`}>
    <dt className="text-sm font-medium text-gray-600">{label}:</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || '-'}</dd>
  </div>
);

const Disclosure = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-3 text-left text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        <span className="font-medium">{title}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="pb-4 px-1">{children}</div>}
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-6 bg-white p-4 sm:p-6 rounded-lg shadow">
    <h3 className="text-xl font-semibold leading-7 text-gray-900 border-b border-gray-200 pb-2 mb-4">
      {title}
    </h3>
    <dl className="divide-y divide-gray-200">{children}</dl>
  </div>
);

const KeyNeedsList = ({ needs, title }) => {
  if (!needs || typeof needs !== 'object') return <InfoRow label={title} value="Não informado" />;
  
  // Filtra as entradas onde o valor é 1, e depois mapeia para pegar a chave e formatá-la.
  const activeNeedNames = Object.entries(needs)
    .filter(([, value]) => value === 1) // Filtra por valor. O primeiro elemento (chave) é ignorado aqui.
    .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())); // Pega a chave do par filtrado e a formata.

  if (activeNeedNames.length === 0) return <InfoRow label={title} value="Nenhuma necessidade específica informada." />;

  return (
    <InfoRow
      label={title}
      value={
        <ul className="list-disc list-inside">
          {activeNeedNames.map((needName) => (
            <li key={needName}>{needName}</li>
          ))}
        </ul>
      }
    />
  );
};


const ContactCard = ({ contact, firmType, firmType_pt }) => {
  if (!contact) return null;
  return (
    <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
      <p className="text-sm font-semibold text-black">{contact.firstName} {contact.lastName} - {contact.titleDesc_pt || contact.titleDesc || 'N/A'}</p>
      {firmType && <p className="text-xs text-black">Tipo na Obra: {firmType_pt || firmType}</p>}
      {contact.emailAddress && <p className="text-xs text-black">Email: <a href={`mailto:${contact.emailAddress}`} className="text-blue-600 hover:underline">{contact.emailAddress}</a></p>}
      {contact.phone && contact.phone.number && (
        <p className="text-xs text-black">Telefone: +{contact.phone.cc} {contact.phone.number} {contact.phone.ext ? `Ramal ${contact.phone.ext}` : ''}</p>
      )}
      {contact.linkedInId && (
        <p className="text-xs text-black">LinkedIn: <a href={`https://www.linkedin.com/in/${contact.linkedInId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Perfil</a></p>
      )}
       {contact.physicalAddress && (
         <p className="text-xs mt-1 text-black">Endereço: {renderAddress(contact.physicalAddress)}</p>
       )}
      {!contact && <p className="text-xs text-gray-500 mt-1">Nenhum contato principal informado para esta empresa.</p>}
    </div>
  );
};

// --- Componente Principal ---

const ObraDetalhes = ({ obra, className }) => {
  if (!obra) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-md ${className || ''} text-center`}>
        <p className="text-xl font-bold text-gray-900">Carregando detalhes da obra...</p>
      </div>
    );
  }
  
  const projeto = obra; 

  // Cálculo do Faturamento Estimado Mensal
  let faturamentoEstimadoMensal = '-';
  if (projeto.localTiv && projeto.constructionDuration && projeto.constructionDuration > 0) {
    const faturamentoCalculado = parseFloat(projeto.localTiv) / parseInt(projeto.constructionDuration, 10);
    if (!isNaN(faturamentoCalculado)) {
      faturamentoEstimadoMensal = formatCurrency(faturamentoCalculado, projeto.localCurrency || 'BRL');
    }
  }

  return (
    <div className={`${className || ''}`}>
      <Section title="Informações Gerais do Projeto">
        <InfoRow label="Nome do Projeto" value={projeto.projectName_pt || projeto.projectName} />
        <InfoRow label="ID Industrial" value={projeto.projectId} />
        <InfoRow label="Tipo de Projeto" value={projeto.projectTypeDesc_pt || projeto.projectTypeDesc} />
        <InfoRow label="Setor Industrial" value={projeto.industryCodeDesc_pt || projeto.industryCodeDesc} />
        <InfoRow label="Descrição SIC do Projeto" value={projeto.projectSicDesc_pt || projeto.projectSicDesc} />
        <InfoRow label="Data de Publicação" value={formatDate(projeto.releaseDate)} />
        <InfoRow label="Data de Ativação (Live)" value={formatDate(projeto.liveDate)} />
      </Section>

      <Section title="Detalhes Financeiros e Probabilidade">
        <InfoRow label="Investimento Total (BRL)" value={formatCurrency(projeto.localTiv, projeto.localCurrency)} />
        <InfoRow label="Probabilidade do Projeto" value={`${projeto.projectProbability_pt || projeto.projectProbability} (Fonte: Industrial Info Research)`} />
        <InfoRow label="Faturamento Estimado Mensal (BRL)" value={faturamentoEstimadoMensal} />
      </Section>

      <Section title="Detalhes da Construção e Escopo">
        <Disclosure title="Escopo do Projeto">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{projeto.scope_pt || projeto.scope || '-'}</p>
        </Disclosure>
        <Disclosure title="Detalhes Adicionais do Projeto">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{projeto.projectDetails || '-'}</p>
        </Disclosure>
        <Disclosure title="Cronograma">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{projeto.schedule_pt || projeto.schedule || '-'}</p>
        </Disclosure>
      </Section>

      {projeto.plantName && (
        <Section title="Informações da Planta">
          <InfoRow label="Nome da Planta" value={projeto.plantName} />
          <InfoRow label="Status da Planta" value={projeto.plantStatusDesc_pt || projeto.plantStatusDesc} />
          <InfoRow label="Proprietário da Planta" value={projeto.plantOwnerName} />
          <InfoRow label="Controladora da Planta" value={projeto.plantParentName} />
          <InfoRow label="Endereço da Planta" value={renderAddress(projeto.plantPhysicalAddress)} />
        </Section>
      )}

      <Section title="Datas e Prazos do Projeto">
        <InfoRow label="Atividade PEC" value={`${projeto.pecActivityDesc_pt || projeto.pecActivityDesc} (${projeto.pecTiming || 'N/A'})`} />
        <InfoRow label="Data de Conclusão Estimada" value={formatDate(projeto.completionDate)} />
        <InfoRow label="Precisão da Data de Conclusão" value={projeto.completionDatePrecision} />
        <InfoRow label="Ano/Mês para AFE" value={formatYearMonth(projeto.afeYearMonth)} />
        <InfoRow label="Ano/Mês para Documentos de Licitação" value={formatYearMonth(projeto.bidDocYearMonth)} />
        <InfoRow label="Ano/Mês para RFQ" value={formatYearMonth(projeto.rfqYearMonth)} />
        <InfoRow label="Ano/Mês para Início (Kick-off)" value={formatYearMonth(projeto.kickoffYearMonth)} />
        <InfoRow label="Atraso no Início (meses)" value={projeto.kickoffSlippage} />
        <InfoRow label="Duração da Construção" value={projeto.constructionDuration ? `${projeto.constructionDuration} meses` : '-'} />
      </Section>

      {projeto.projectCompanies && projeto.projectCompanies.length > 0 && (
        <Section title="Empresas e Contatos do Projeto">
          {projeto.projectCompanies.map((company) => (
            <Disclosure key={company.companyId} title={`${company.companyName} (${company.firmTypeDesc_pt || company.firmTypeDesc || 'N/A'})`}>
              <InfoRow label="ID da Empresa" value={company.companyId} />
              {company.physicalAddress && (
                <InfoRow label="Endereço" value={renderAddress(company.physicalAddress)} />
              )}
              {company.projectContact && (
                <ContactCard contact={company.projectContact} firmType={company.firmTypeDesc} firmType_pt={company.firmTypeDesc_pt} />
              )}
              {!company.projectContact && <p className="text-xs text-gray-500 mt-1">Nenhum contato principal informado para esta empresa.</p>}
            </Disclosure>
          ))}
        </Section>
      )}
      
      <Section title="Informações Adicionais">
         {projeto.buy && (
             <KeyNeedsList
                needs={projeto.buy}
                title="Necessidades de Compra (Energia/Utilidades)"
             />
         )}
         {projeto.sell && (
             <KeyNeedsList
                needs={projeto.sell}
                title="Potencial de Venda (Energia/Utilidades)"
             />
         )}
         {(!projeto.buy && !projeto.sell) && (
            <p className="text-sm text-gray-500">Nenhuma informação adicional relevante para construção civil disponível.</p>
         )}
      </Section>

    </div>
  );
};

export default ObraDetalhes; 
