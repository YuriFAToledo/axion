-- Drop da tabela existente se ela já existir para uma recriação limpa
DROP TABLE IF EXISTS public.obras CASCADE; -- CASCADE remove objetos dependentes como triggers e índices

-- Tabela para armazenar os dados das obras importadas do IIR
CREATE TABLE public.obras (
    -- Campos do IIR
    "projectId" INTEGER PRIMARY KEY NOT NULL,
    "projectName" TEXT,
    "industryCode" TEXT,
    "industryCodeDesc" TEXT,
    "pecZone" TEXT, -- Baixa prioridade, manter ou remover conforme necessidade
    "tiv" NUMERIC,
    "currency" VARCHAR(10),
    "localTiv" NUMERIC,
    "localCurrency" VARCHAR(10),
    "offshore" BOOLEAN, -- Ou SMALLINT (0 ou 1)
    "releaseDate" TIMESTAMPTZ,
    "projectStatusId" VARCHAR(10),
    "projectStatusDesc" TEXT,
    "projectSicId" TEXT,
    "projectSicDesc" TEXT,
    "projectTypeId" INTEGER,
    "projectTypeDesc" TEXT,
    "projectOwnerId" INTEGER,
    "projectOwnerName" TEXT,
    "sicProductId" TEXT,
    "sicProductDesc" TEXT,
    "liveDate" TIMESTAMPTZ,
    "plantId" INTEGER,
    "plantName" TEXT,
    "plantStatusDesc" TEXT,
    "plantSicId" TEXT,
    "plantSicDesc" TEXT,
    "plantOwnerId" INTEGER,
    "plantOwnerName" TEXT,
    "plantParentId" INTEGER,
    "plantParentName" TEXT,
    "plantLongitude" NUMERIC(11, 8), -- Precisão para coordenadas
    "plantLatitude" NUMERIC(10, 8),  -- Precisão para coordenadas
    "plantPhysicalAddress" JSONB, -- Armazena o objeto de endereço da planta
    "plantPhone" TEXT,
    "tradingRegionId" INTEGER,
    "tradingRegionName" TEXT,
    "marketRegionId" TEXT,
    "marketRegionName" TEXT,
    "worldRegionId" INTEGER,
    "worldRegionName" TEXT,
    "pecTiming" TEXT,
    "pecActivityId" TEXT,
    "pecActivityDesc" TEXT,
    "projectProbability" TEXT,
    "scope" TEXT, -- Pode ser longo
    "projectDetails" TEXT, -- Pode ser longo
    "schedule" TEXT, -- Pode ser longo
    "afeYearMonth" INTEGER, -- Formato YYYYMM
    "bidDocYearMonth" INTEGER, -- Formato YYYYMM
    "completionDate" TIMESTAMPTZ,
    "completionDatePrecision" TEXT,
    "rfqYearMonth" INTEGER, -- Formato YYYYMM
    "kickoffYearMonth" INTEGER, -- Formato YYYYMM
    "kickoffSlippage" INTEGER, -- Em meses
    "duration" TEXT, -- Ex: "17 Months"
    "constructionDuration" INTEGER, -- Em meses
    
    "environmental" JSONB, -- { "air": 1, "land": 1, "water": 0 }
    "engineeringKeyNeeds" JSONB,
    "constructionKeyNeeds" JSONB,
    "projectKeyNeeds" JSONB,
    "matterPhase" JSONB,
    "energyProcessKeyNeeds" JSONB,
    "buyInfo" JSONB, -- Renomeado de "buy"
    "sellInfo" JSONB, -- Renomeado de "sell"
    "projectCompanies" JSONB, -- Array de objetos de empresas e contatos
    "unitIds" JSONB, -- Array de objetos { "unitId": ... }

    -- Campos de controle (mantidos do script original)
    "avaliado" BOOLEAN DEFAULT FALSE NOT NULL,
    "data_ultima_tentativa_n8n" TIMESTAMPTZ, -- Novo campo para controle de webhook
    "data_ultima_atualizacao_n8n" TIMESTAMPTZ, -- Novo campo para controle de webhook
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comentários sobre colunas importantes
COMMENT ON COLUMN public.obras."projectId" IS 'ID único do projeto do IIR (chave primária).';
COMMENT ON COLUMN public.obras."projectCompanies" IS 'Lista de empresas associadas ao projeto, incluindo contatos. Formato JSONB.';
COMMENT ON COLUMN public.obras."scope" IS 'Escopo detalhado do projeto.';
COMMENT ON COLUMN public.obras."engineeringKeyNeeds" IS 'Necessidades chave de engenharia. Formato JSONB.';
COMMENT ON COLUMN public.obras."constructionKeyNeeds" IS 'Necessidades chave de construção. Formato JSONB.';
COMMENT ON COLUMN public.obras."projectKeyNeeds" IS 'Necessidades chave gerais do projeto. Formato JSONB.';
COMMENT ON COLUMN public.obras."avaliado" IS 'Indica se a obra já foi avaliada (TRUE) ou não (FALSE).';
COMMENT ON COLUMN public.obras."data_ultima_tentativa_n8n" IS 'Data da última vez que o n8n tentou processar/enviar esta obra.';
COMMENT ON COLUMN public.obras."data_ultima_atualizacao_n8n" IS 'Data da última atualização bem-sucedida via n8n.';


-- Trigger para atualizar automaticamente a coluna updated_at (mantido do script original)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_obras -- Nome do trigger modificado para ser mais específico
BEFORE UPDATE ON public.obras
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Índices para otimizar consultas
CREATE INDEX IF NOT EXISTS idx_obras_avaliado ON public.obras ("avaliado");
CREATE INDEX IF NOT EXISTS idx_obras_projectStatusDesc ON public.obras ("projectStatusDesc");
CREATE INDEX IF NOT EXISTS idx_obras_industryCodeDesc ON public.obras ("industryCodeDesc");
CREATE INDEX IF NOT EXISTS idx_obras_projectOwnerName ON public.obras ("projectOwnerName");
CREATE INDEX IF NOT EXISTS idx_obras_completionDate ON public.obras ("completionDate");
CREATE INDEX IF NOT EXISTS idx_obras_localTiv ON public.obras ("localTiv");

-- Índice para consulta em campos JSONB (Exemplo para projectCompanies, se você for consultar por nome de empresa frequentemente)
-- CREATE INDEX IF NOT EXISTS idx_obras_projectCompanies_name ON public.obras USING GIN ((("projectCompanies" ->> 'companyName')));
-- Considere adicionar mais índices GIN/JSONB conforme suas necessidades de consulta em campos JSONB.

-- Adicionando de volta os campos de CEP, Endereco, Bairro, Cidade, Estado, Regiao para manter compatibilidade ou uso direto simplificado
-- Estes podem ser populados a partir do plantPhysicalAddress ou projectCompanies se necessário
ALTER TABLE public.obras ADD COLUMN IF NOT EXISTS "CEP" TEXT;
ALTER TABLE public.obras ADD COLUMN IF NOT EXISTS "Endereco" TEXT;
ALTER TABLE public.obras ADD COLUMN IF NOT EXISTS "Bairro" TEXT;
ALTER TABLE public.obras ADD COLUMN IF NOT EXISTS "Cidade" TEXT;
ALTER TABLE public.obras ADD COLUMN IF NOT EXISTS "Estado" TEXT;
ALTER TABLE public.obras ADD COLUMN IF NOT EXISTS "Regiao" TEXT;

COMMENT ON COLUMN public.obras."Cidade" IS 'Cidade principal do projeto, pode ser derivada de plantPhysicalAddress ou um campo de entrada.';
COMMENT ON COLUMN public.obras."Estado" IS 'Estado principal do projeto, pode ser derivado de plantPhysicalAddress ou um campo de entrada.';


GRANT SELECT, INSERT, UPDATE, DELETE ON public.obras TO service_role;
GRANT SELECT ON public.obras TO authenticated;
GRANT SELECT ON public.obras TO anon;

-- Nota: Se você tinha uma política de RLS (Row Level Security) na tabela antiga,
-- você precisará recriá-la para a nova tabela.
-- Exemplo de política (ajuste conforme sua necessidade):
-- CREATE POLICY "Enable read access for all users" ON public.obras
-- AS PERMISSIVE FOR SELECT
-- TO public
-- USING (true); 