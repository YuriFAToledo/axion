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

// --- Template para obras do IIR ---
const IIRTemplate = ({ projeto }) => {
  // Cálculo do Faturamento Estimado Mensal
  let faturamentoEstimadoMensal = '-';
  if (projeto.localTiv && projeto.constructionDuration && projeto.constructionDuration > 0) {
    const faturamentoCalculado = parseFloat(projeto.localTiv) / parseInt(projeto.constructionDuration, 10);
    if (!isNaN(faturamentoCalculado)) {
      faturamentoEstimadoMensal = formatCurrency(faturamentoCalculado, projeto.localCurrency || 'BRL');
    }
  }

  return (
    <>
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
    </>
  );
};

// --- Template para obras do ObrasOnline ---
const ObrasOnlineTemplate = ({ projeto }) => {
  // Formatar valor do investimento
  const formatInvestment = () => {
    if (!projeto.valor_do_investimento) return '-';
    const valor = parseFloat(projeto.valor_do_investimento);
    const grandeza = projeto.grandeza_do_investimento;
    
    if (grandeza === 'MI') {
      return formatCurrency(valor * 1000000, 'BRL');
    } else if (grandeza === 'BI') {
      return formatCurrency(valor * 1000000000, 'BRL');
    } else if (grandeza === 'MIL') {
      return formatCurrency(valor * 1000, 'BRL');
    }
    return formatCurrency(valor, 'BRL');
  };

  // Formatar endereço completo
  const formatAddress = () => {
    const parts = [
      projeto.endereco && projeto.endereco !== 'Não informado' ? projeto.endereco : null,
      projeto.numero_endereco && projeto.numero_endereco !== 'S/Nº' && projeto.numero_endereco !== '0' ? projeto.numero_endereco : null,
      projeto.complemento_endereco,
      projeto.bairro && projeto.bairro !== 'Não definido' ? projeto.bairro : null,
      projeto.cidade,
      projeto.estado,
      projeto.cep
    ].filter(Boolean);
    return parts.join(', ') || '-';
  };

  // Formatar data brasileira
  // const formatBrazilianDate = (dateString) => {
  //   if (!dateString) return '-';
  //   try {
  //     // Formato esperado: "05-01-2016 11:03" ou "30-10-2021"
  //     const [datePart] = dateString.split(' ');
  //     const [day, month, year] = datePart.split('-');
  //     return `${day}/${month}/${year}`;
  //   } catch (error) {
  //     return dateString;
  //   }
  // };

  return (
    <>
      <Section title="Informações Básicas da Obra">
        <InfoRow label="Nome da Obra" value={projeto.nome} />
        <InfoRow label="Código" value={projeto.codigo} />
        <InfoRow label="Tipo de Obra" value={projeto.tipo_de_obra} />
        <InfoRow label="Subsetor" value={projeto.subsetor} />
        <InfoRow label="Categoria de Uso" value={projeto.categoria_de_uso} />
        <InfoRow label="Status" value={projeto.status} />
        <InfoRow label="Fase" value={projeto.fase} />
        <InfoRow label="Etapa" value={projeto.etapa || 'Etapa não informada'} />
      </Section>

      <Section title="Especificações Técnicas">
        <InfoRow label="Especificação" value={projeto.especificacao} />
        <InfoRow label="Padrão de Acabamento" value={projeto.padrao_de_acabamento || 'Padrão não informado'} />
        <InfoRow label="Tipo de Investimento" value={projeto.tipo_de_investimento} />
        <InfoRow label="SPE" value={
          !projeto.spe || projeto.spe === "00.000.000/0000-00" || projeto.spe === "" 
            ? "SPE não informado" 
            : projeto.spe
        } />
        <InfoRow label="Área (m²)" value={
          !projeto.area || projeto.area === 0 || projeto.area === "" 
            ? "Área não informada" 
            : projeto.area
        } />
      </Section>

      <Section title="Informações Financeiras">
        <InfoRow label="Valor do Investimento" value={formatInvestment()} />
        <InfoRow label="Grandeza" value={projeto.grandeza_do_investimento} />
      </Section>

      <Section title="Localização">
        <InfoRow label="Endereço Completo" value={formatAddress()} />
        <InfoRow label="Cidade" value={projeto.cidade} />
        <InfoRow label="Estado" value={projeto.estado} />
        <InfoRow label="Região" value={projeto.regiao} />
        <InfoRow label="Bairro" value={projeto.bairro !== 'Não definido' && projeto.bairro ? projeto.bairro : 'Bairro não informado'} />
        <InfoRow label="CEP" value={projeto.cep || 'CEP não informado'} />
        <InfoRow label="Telefone do Canteiro" value={projeto.telefone_canteiro || 'Telefone não informado'} />
      </Section>

      <Section title="Cronograma e Datas">
        <InfoRow label="Data de Cadastro" value={formatDate(projeto.data_cadastro)} />
        <InfoRow label="Data de Habilitação" value={formatDate(projeto.data_habilitacao)} />
        <InfoRow label="Data de Atualização" value={formatDate(projeto.data_atualizacao)} />
        <InfoRow label="Previsão Início Fase/Etapa" value={formatDate(projeto.previsao_inicio_fase_etapa)} />
        <InfoRow label="Previsão Término Fase/Etapa" value={formatDate(projeto.previsao_termino_fase_etapa)} />
        <InfoRow label="Previsão de Entrega" value={
          projeto.previsao_entrega ? formatDate(projeto.previsao_entrega) : 'Previsão de entrega não informada'
        } />
        <InfoRow label="Status de Atualização" value={projeto.status_atualizacao} />
        <InfoRow label="Status de Cadastro" value={projeto.status_cadastro} />
        {projeto.data_desabilitacao && <InfoRow label="Data de Desabilitação" value={formatDate(projeto.data_desabilitacao)} />}
      </Section>

      {/* Dados quantitativos (sempre exibidos) */}
      <Section title="Dados Quantitativos">
        <InfoRow label="Número de Torres" value={
          projeto.numero_torres && projeto.numero_torres !== 0 ? projeto.numero_torres : "Não informado"
        } />
        <InfoRow label="Número de Pisos" value={
          projeto.numero_pisos && projeto.numero_pisos !== 0 ? projeto.numero_pisos : "Não informado"
        } />
        <InfoRow label="Número de Salas" value={
          projeto.numero_salas && projeto.numero_salas !== 0 ? projeto.numero_salas : "Não informado"
        } />
        <InfoRow label="Número de Apartamentos" value={
          projeto.numero_apartamentos && projeto.numero_apartamentos !== 0 ? projeto.numero_apartamentos : "Não informado"
        } />
        <InfoRow label="Número de Casas" value={
          projeto.numero_casas && projeto.numero_casas !== 0 ? projeto.numero_casas : "Não informado"
        } />
        <InfoRow label="Número de Lojas" value={
          projeto.numero_lojas && projeto.numero_lojas !== 0 ? projeto.numero_lojas : "Não informado"
        } />
        <InfoRow label="Número de Unidades" value={
          projeto.numero_unidades && projeto.numero_unidades !== 0 ? projeto.numero_unidades : "Não informado"
        } />
        <InfoRow label="Número de Banheiros" value={
          projeto.numero_banheiros && projeto.numero_banheiros !== 0 ? projeto.numero_banheiros : "Não informado"
        } />
      </Section>

            {/* Empresas envolvidas */}
      {projeto.empresas && projeto.empresas.length > 0 && (
        <Section title="Empresas Envolvidas">
          {projeto.empresas.map((empresa, index) => (
            <Disclosure key={empresa.Codigo || index} title={`${empresa.Razao_Social} ${empresa.Nome_Fantasia ? `(${empresa.Nome_Fantasia})` : ''}`}>
              <InfoRow label="Código da Empresa" value={empresa.Codigo} />
              <InfoRow label="CNPJ" value={empresa.CNPJ || 'CNPJ não informado'} />
              <InfoRow label="Email" value={empresa.Email || 'Email não informado'} />
              <InfoRow label="Telefone" value={empresa.Telefone || 'Telefone não informado'} />
              <InfoRow label="Website" value={
                empresa.Website ? <a href={empresa.Website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{empresa.Website}</a> : 'Website não informado'
              } />
              <InfoRow label="Responsável pela Execução" value={empresa.Reponsavel_Pela_Execucao ? 'Sim' : 'Não'} />
              <InfoRow label="Empreendedor" value={empresa.Empreendedor ? 'Sim' : 'Não'} />
              
              <InfoRow label="Tipos" value={
                empresa.Tipos && empresa.Tipos.length > 0 ? empresa.Tipos.join(', ') : 'Tipos não informados'
              } />
              
              {/* Endereço da empresa */}
              <InfoRow label="Endereço da Empresa" value={
                [
                  empresa.Endereco,
                  empresa.Numero_Endereco,
                  empresa.Complemento_Endereco,
                  empresa.Bairro,
                  empresa.Cidade,
                  empresa.Estado,
                  empresa.CEP
                ].filter(Boolean).join(', ')
              } />

                            {/* Contatos da empresa */}
              {empresa.Contatos && empresa.Contatos.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">Contatos:</p>
                  {empresa.Contatos.map((contato, contatoIndex) => (
                    <div key={contato.Codigo || contatoIndex} className="ml-4 p-3 border border-gray-200 rounded-md bg-gray-50 mb-2">
                      <p className="text-sm font-semibold text-black">{contato.Nome} {contato.Codigo && <span className="text-xs text-gray-500">(ID: {contato.Codigo})</span>}</p>
                      <p className="text-xs text-black">Cargo: {
                        contato.Cargos && contato.Cargos.length > 0 ? contato.Cargos.join(', ') : 'Cargo não informado'
                      }</p>
                      <p className="text-xs text-black">Email: {
                        contato.Email ? <a href={`mailto:${contato.Email}`} className="text-blue-600 hover:underline">{contato.Email}</a> : 'Email não informado'
                      }</p>
                      <p className="text-xs text-black">Telefone: {contato.Telefone || 'Telefone não informado'}</p>
                      <p className="text-xs text-black">Telefone 2: {contato.Telefone2 || 'Telefone 2 não informado'}</p>
                      <p className="text-xs text-black">Celular: {contato.Celular || 'Celular não informado'}</p>
                      <p className="text-xs text-black">DDR: {contato.DDR || 'DDR não informado'}</p>
                      <p className="text-xs text-black">Ramal: {contato.RamalTelefone && contato.RamalTelefone.trim() !== '    ' ? contato.RamalTelefone : 'Ramal não informado'}</p>
                      {/* Endereço do contato se diferente da empresa */}
                      {(contato.Endereco || contato.CEP) && (
                        <p className="text-xs text-black">Endereço do Contato: {[
                          contato.Endereco,
                          contato.Numero_Endereco,
                          contato.Complemento_Endereco,
                          contato.Bairro,
                          contato.Cidade,
                          contato.Estado,
                          contato.CEP
                        ].filter(Boolean).join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Disclosure>
          ))}
        </Section>
      )}

      {/* Informações Adicionais */}
      {(projeto.site || projeto.avaliado !== undefined) && (
        <Section title="Informações Adicionais">
          {projeto.site && <InfoRow label="Site de Referência" value={
            <a href={projeto.site} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{projeto.site}</a>
          } />}
          <InfoRow label="Status de Avaliação" value={projeto.avaliado ? 'Já avaliado' : 'Não avaliado'} />
        </Section>
      )}
    </>
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
  
  // Determinar se é obra do IIR ou ObrasOnline
  const isIIR = projeto.plataforma === 'iir' || projeto.projectId || projeto.projectName || projeto.industryCodeDesc;
  // const isObrasOnline = projeto.plataforma === 'obrasonline' || projeto.codigo || projeto.nome;

  return (
    <div className={`${className || ''}`}>
      {/* Badge indicando a fonte - apenas para IIR */}
      {isIIR && (
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Industrial Info Research
          </span>
        </div>
      )}
      
      {/* Renderização condicional baseada na fonte */}
      {isIIR ? (
        <IIRTemplate projeto={projeto} />
      ) : (
        <ObrasOnlineTemplate projeto={projeto} />
      )}
    </div>
  );
};

export default ObraDetalhes; 
