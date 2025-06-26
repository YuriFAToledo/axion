// Dados de exemplo para teste das diferentes fontes de obras

export const exemploObraIIR = {
  plataforma: 'iir',
  projectId: 'IIR123456',
  projectName: 'Expansão da Refinaria de Paulínia',
  projectName_pt: 'Expansão da Refinaria de Paulínia',
  projectTypeDesc: 'Refinery Expansion',
  projectTypeDesc_pt: 'Expansão de Refinaria',
  industryCodeDesc: 'Oil & Gas Refining',
  industryCodeDesc_pt: 'Refino de Petróleo e Gás',
  projectSicDesc: 'Petroleum Refining',
  projectSicDesc_pt: 'Refino de Petróleo',
  localTiv: 850000000,
  localCurrency: 'BRL',
  constructionDuration: 24,
  projectProbability: 'High',
  projectProbability_pt: 'Alta',
  releaseDate: '2024-01-15T00:00:00Z',
  liveDate: '2024-02-01T00:00:00Z',
  scope: 'Construction of new processing units and infrastructure upgrades',
  scope_pt: 'Construção de novas unidades de processamento e melhorias de infraestrutura',
  schedule: 'Project scheduled to begin Q2 2024 with completion by Q1 2026',
  schedule_pt: 'Projeto programado para iniciar no Q2 2024 com conclusão no Q1 2026',
  plantName: 'Refinaria de Paulínia',
  plantStatusDesc: 'Operating',
  plantStatusDesc_pt: 'Em Operação',
  plantOwnerName: 'Petrobras',
  plantParentName: 'Petróleo Brasileiro S.A.',
  plantPhysicalAddress: {
    addressLine1: 'Rodovia SP-332, km 131',
    city: 'Paulínia',
    stateName: 'São Paulo',
    countryName: 'Brazil',
    countryName_pt: 'Brasil',
    postalCode: '13140-000'
  },
  completionDate: '2026-03-01T00:00:00Z',
  afeYearMonth: 202405,
  bidDocYearMonth: 202407,
  rfqYearMonth: 202408,
  kickoffYearMonth: 202409,
  pecActivityDesc: 'Engineering & Construction',
  pecActivityDesc_pt: 'Engenharia e Construção',
  pecTiming: 'Current',
  projectCompanies: [
    {
      companyId: 'COMP001',
      companyName: 'Construções ABC Ltda',
      firmTypeDesc: 'General Contractor',
      firmTypeDesc_pt: 'Empreiteira Geral',
      physicalAddress: {
        addressLine1: 'Av. Paulista, 1000',
        city: 'São Paulo',
        stateName: 'São Paulo',
        countryName: 'Brazil',
        countryName_pt: 'Brasil',
        postalCode: '01310-100'
      },
      projectContact: {
        firstName: 'João',
        lastName: 'Silva',
        titleDesc: 'Project Manager',
        titleDesc_pt: 'Gerente de Projeto',
        emailAddress: 'joao.silva@construcoesabc.com.br',
        phone: {
          cc: '55',
          number: '11987654321',
          ext: '100'
        }
      }
    }
  ],
  buy: {
    electricity: 1,
    naturalGas: 1,
    steam: 0,
    water: 1
  },
  sell: {
    electricity: 0,
    naturalGas: 0,
    steam: 1,
    water: 0
  }
};

export const exemploObraObrasOnline = {
  Codigo: 137266,
  plataforma: "obrasonline",
  Nome: "Alça de acesso ao Rodoanel",
  SPE: "00.000.000/0000-00",
  Tipo_De_Obra: "Infraestrutura",
  Subsetor: "Transporte",
  Categoria_De_Uso: "Pontes / Viadutos / Túneis",
  Status: "Obra não Iniciada",
  Fase: "Projeto Executivo",
  Etapa: "",
  Padrao_De_Acabamento: "Em verificação",
  Especificacao: "Nova Construção",
  Tipo_De_Investimento: "Público",
  Valor_Do_Investimento: "160",
  Grandeza_Do_Investimento: "MI",
  Area: "0",
  Numero_Torres: "0",
  Numero_Pisos: "0",
  Numero_Salas: "0",
  Numero_Apartamentos: "0",
  Numero_Casas: "0",
  Numero_Lojas: "0",
  Numero_Unidades: "0",
  CEP: "",
  Endereco: "SUZANO - SP",
  Numero_Endereco: "S/Nº",
  Complemento_Endereco: "",
  Bairro: "Não definido",
  Regiao: "Sudeste",
  Estado: "São Paulo",
  Cidade: "Suzano",
  Telefone_Canteiro: "",
  Data_Cadastro: "05-01-2016 11:03",
  Data_Atualizacao: "15-06-2021 11:00",
  Data_Habilitacao: "05-01-2016 00:00",
  Previsao_Termino_Fase_Etapa: "30-10-2021",
  Status_Atualizacao: "Atualizada",
  Status_Cadastro: "Habilitado",
  Previsao_Entrega: null,
  Empresas: [
    {
      Codigo: 4656,
      Razao_Social: "Contern",
      Nome_Fantasia: "Contern",
      Reponsavel_Pela_Execucao: true,
      Empreendedor: false,
      CNPJ: "56.443.583/0001-80",
      Telefone: "(11) 3018-5800",
      Website: "http://www.contern.com.br/",
      CEP: "11.075-001",
      Endereco: "Avenida Senador Pinheiro Machado",
      Numero_Endereco: "379",
      Complemento_Endereco: "",
      Bairro: "Marapé",
      Estado: "São Paulo",
      Cidade: "Santos",
      Data_Atualizacao: null,
      Tipos: [
        "Construtor"
      ],
      Contatos: [
        {
          Codigo: 58554,
          Nome: "Ana Carolina Lima",
          Email: "carolina.lima@contern.com.br",
          Telefone: "(11) 3018-5800",
          Celular: "",
          CEP: "11.075-001",
          Endereco: "Avenida Senador Pinheiro Machado",
          Numero_Endereco: "",
          Complemento_Endereco: "",
          Bairro: "Marapé",
          Estado: "São Paulo",
          Cidade: "Santos",
          Data_Atualizacao: null,
          Cargos: [
            "Comprador (a)"
          ]
        }
      ]
    }
  ]
};

export const exemploObraObrasOnlineMinima = {
  Codigo: 456789,
  plataforma: "obrasonline",
  Nome: "Reforma da Escola Municipal Centro",
  SPE: "", // Teste do tratamento de SPE vazio
  Tipo_De_Obra: "Educação",
  Status: "Em Andamento",
  Fase: "Licitação",
  Etapa: "", // Teste de campo vazio
  Area: "0", // Teste de campo zero
  Valor_Do_Investimento: "2.5",
  Grandeza_Do_Investimento: "MI",
  Numero_Torres: "0",
  Numero_Pisos: "0", 
  Numero_Salas: "0",
  Numero_Apartamentos: "0",
  Numero_Casas: "0",
  Numero_Lojas: "0", 
  Numero_Unidades: "0",
  CEP: "", // Teste de CEP vazio
  Telefone_Canteiro: "", // Teste de telefone vazio
  Cidade: "Santos",
  Estado: "São Paulo",
  Regiao: "Sudeste",
  Bairro: "Não definido",
  Previsao_Entrega: null, // Teste de campo null
  Data_Cadastro: "01-12-2024 10:00",
  Data_Atualizacao: "10-12-2024 15:30",
  Empresas: [
    {
      Codigo: 9999,
      Razao_Social: "Prefeitura Municipal de Santos",
      Nome_Fantasia: "Prefeitura de Santos",
      Reponsavel_Pela_Execucao: true,
      Empreendedor: true,
      CNPJ: "46.522.302/0001-66",
      Telefone: "", // Teste de telefone vazio
      Website: "", // Teste de website vazio
      Data_Atualizacao: null, // Teste de data null
      Tipos: [], // Teste de array vazio
      Contatos: [
        {
          Codigo: 12345,
          Nome: "João Silva",
          Email: "", // Teste de email vazio
          Telefone: "",
          Celular: "",
          Cargos: [], // Teste de cargos vazio
          Data_Atualizacao: null
        }
      ]
    }
  ]
}; 