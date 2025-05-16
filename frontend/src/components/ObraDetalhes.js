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
  } catch (e) {
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

const renderAddress = (address) => {
  if (!address) return '-';
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.stateName,
    address.countyName,
    address.postalCode,
    address.countryName,
  ].filter(Boolean); // Remove partes vazias
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
  const activeNeeds = Object.entries(needs)
    .filter(([_, value]) => value === 1)
    .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())); // Formata CamelCase para Título

  if (activeNeeds.length === 0) return <InfoRow label={title} value="Nenhuma necessidade específica informada." />;

  return (
    <InfoRow
      label={title}
      value={
        <ul className="list-disc list-inside">
          {activeNeeds.map((need) => (
            <li key={need}>{need}</li>
          ))}
        </ul>
      }
    />
  );
};


const ContactCard = ({ contact, firmType }) => {
  if (!contact) return null;
  return (
    <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
      <p className="text-sm font-semibold">{contact.firstName} {contact.lastName} - {contact.titleDesc || 'N/A'}</p>
      {firmType && <p className="text-xs text-gray-600">Tipo na Obra: {firmType}</p>}
      {contact.emailAddress && <p className="text-xs">Email: <a href={`mailto:${contact.emailAddress}`} className="text-blue-600 hover:underline">{contact.emailAddress}</a></p>}
      {contact.phone && contact.phone.number && (
        <p className="text-xs">Telefone: +{contact.phone.cc} {contact.phone.number} {contact.phone.ext ? `Ramal ${contact.phone.ext}` : ''}</p>
      )}
      {contact.linkedInId && (
        <p className="text-xs">LinkedIn: <a href={`https://www.linkedin.com/in/${contact.linkedInId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Perfil</a></p>
      )}
       {contact.physicalAddress && (
         <p className="text-xs mt-1">Endereço: {renderAddress(contact.physicalAddress)}</p>
       )}
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
  
  // O payload do IIR é um array, pegamos o primeiro projeto.
  // Em page.js, já está sendo feito data[0], então 'obra' aqui é o objeto do projeto.
  const projeto = obra; 

  return (
    <div className={`${className || ''}`}>
      <Section title="Informações Gerais do Projeto">
        <InfoRow label="Nome do Projeto" value={projeto.projectName} />
        <InfoRow label="ID do Projeto" value={projeto.projectId} />
        <InfoRow label="Status" value={projeto.projectStatusDesc} />
        <InfoRow label="Tipo de Projeto" value={projeto.projectTypeDesc} />
        <InfoRow label="Setor Industrial" value={projeto.industryCodeDesc} />
        <InfoRow label="Descrição SIC do Projeto" value={projeto.projectSicDesc} />
        <InfoRow label="Descrição do Produto SIC" value={projeto.sicProductDesc} />
        <InfoRow label="Data de Publicação" value={formatDate(projeto.releaseDate)} />
        <InfoRow label="Data de Ativação (Live)" value={formatDate(projeto.liveDate)} />
      </Section>

      <Section title="Detalhes Financeiros e Probabilidade">
        <InfoRow label="Investimento Total (TIV)" value={formatCurrency(projeto.tiv, projeto.currency)} />
        <InfoRow label="Investimento Total (Local)" value={formatCurrency(projeto.localTiv, projeto.localCurrency)} />
        <InfoRow label="Probabilidade do Projeto" value={projeto.projectProbability} />
      </Section>

      <Section title="Escopo, Detalhes e Cronograma do Projeto">
        <Disclosure title="Escopo do Projeto (Scope)">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{projeto.scope || '-'}</p>
        </Disclosure>
        <Disclosure title="Detalhes Adicionais do Projeto">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{projeto.projectDetails || '-'}</p>
        </Disclosure>
        <Disclosure title="Cronograma (Schedule)">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{projeto.schedule || '-'}</p>
        </Disclosure>
      </Section>
      
      <Section title="Necessidades Chave do Projeto">
        <KeyNeedsList needs={projeto.engineeringKeyNeeds} title="Engenharia" />
        <KeyNeedsList needs={projeto.constructionKeyNeeds} title="Construção" />
        <KeyNeedsList needs={projeto.projectKeyNeeds} title="Geral do Projeto" />
      </Section>

      {projeto.plantName && (
        <Section title="Informações da Planta">
          <InfoRow label="Nome da Planta" value={projeto.plantName} />
          <InfoRow label="Status da Planta" value={projeto.plantStatusDesc} />
          <InfoRow label="Proprietário da Planta" value={projeto.plantOwnerName} />
          <InfoRow label="Controladora da Planta" value={projeto.plantParentName} />
          <InfoRow label="Endereço da Planta" value={renderAddress(projeto.plantPhysicalAddress)} />
          <InfoRow label="Telefone da Planta" value={projeto.plantPhone} />
          <InfoRow label="Longitude" value={projeto.plantLongitude} />
          <InfoRow label="Latitude" value={projeto.plantLatitude} />
        </Section>
      )}

      <Section title="Datas e Prazos do Projeto">
        <InfoRow label="Atividade PEC" value={`${projeto.pecActivityDesc} (${projeto.pecTiming || 'N/A'})`} />
        <InfoRow label="Data de Conclusão Estimada" value={formatDate(projeto.completionDate)} />
        <InfoRow label="Precisão da Data de Conclusão" value={projeto.completionDatePrecision} />
        <InfoRow label="Ano/Mês para AFE" value={projeto.afeYearMonth} />
        <InfoRow label="Ano/Mês para Documentos de Licitação" value={projeto.bidDocYearMonth} />
        <InfoRow label="Ano/Mês para RFQ" value={projeto.rfqYearMonth} />
        <InfoRow label="Ano/Mês para Início (Kick-off)" value={projeto.kickoffYearMonth} />
        <InfoRow label="Atraso no Início (meses)" value={projeto.kickoffSlippage} />
        <InfoRow label="Duração Total do Projeto" value={projeto.duration} />
        <InfoRow label="Duração da Construção" value={projeto.constructionDuration ? `${projeto.constructionDuration} meses` : '-'} />
      </Section>

      {projeto.projectCompanies && projeto.projectCompanies.length > 0 && (
        <Section title="Empresas e Contatos do Projeto">
          {projeto.projectCompanies.map((company) => (
            <Disclosure key={company.companyId} title={`${company.companyName} (${company.firmTypeDesc || 'N/A'})`}>
              <InfoRow label="ID da Empresa" value={company.companyId} />
              {company.physicalAddress && (
                <InfoRow label="Endereço" value={renderAddress(company.physicalAddress)} />
              )}
              {company.projectContact && (
                <ContactCard contact={company.projectContact} firmType={company.firmTypeDesc} />
              )}
              {!company.projectContact && <p className="text-xs text-gray-500 mt-1">Nenhum contato principal informado para esta empresa.</p>}
            </Disclosure>
          ))}
        </Section>
      )}
      
      <Section title="Informações Adicionais">
         {projeto.environmental && (
            <KeyNeedsList 
                needs={{
                    Ar: projeto.environmental.air,
                    Terra: projeto.environmental.land,
                    Água: projeto.environmental.water
                }} 
                title="Impactos Ambientais" 
            />
         )}
         {projeto.matterPhase && (
             <KeyNeedsList 
                needs={projeto.matterPhase}
                title="Fase da Matéria Envolvida"
             />
         )}
         {projeto.energyProcessKeyNeeds && (
             <KeyNeedsList
                needs={projeto.energyProcessKeyNeeds}
                title="Necessidades Chave de Processo de Energia"
             />
         )}
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
      </Section>

    </div>
  );
};

export default ObraDetalhes; 