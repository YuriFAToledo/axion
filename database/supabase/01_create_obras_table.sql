-- Tabela para armazenar os dados das obras importadas
CREATE TABLE public.obras (
    -- Campos do JSON Obras Online
    "Codigo" INTEGER PRIMARY KEY NOT NULL,
    "Nome" TEXT,
    "SPE" TEXT,
    "Tipo_De_Obra" TEXT,
    "Subsetor" TEXT,
    "Categoria_De_Uso" TEXT,
    "Status" TEXT,
    "Fase" TEXT,
    "Etapa" TEXT,
    "Padrao_De_Acabamento" TEXT,
    "Especificacao" TEXT,
    "Tipo_De_Investimento" TEXT,
    "Valor_Do_Investimento" TEXT, -- Armazenado como texto devido à combinação com Grandeza
    "Grandeza_Do_Investimento" TEXT,
    "Area" TEXT, -- Pode ser texto ou numérico dependendo da fonte
    "Numero_Torres" INTEGER,
    "Numero_Pisos" INTEGER,
    "Numero_Salas" INTEGER,
    "Numero_Apartamentos" INTEGER,
    "Numero_Casas" INTEGER,
    "Numero_Lojas" INTEGER,
    "Numero_Unidades" INTEGER,
    "CEP" TEXT,
    "Endereco" TEXT,
    "Numero_Endereco" TEXT,
    "Complemento_Endereco" TEXT,
    "Bairro" TEXT,
    "Regiao" TEXT,
    "Estado" TEXT,
    "Cidade" TEXT,
    "Telefone_Canteiro" TEXT,
    "Data_Cadastro" TEXT, -- Armazenado como texto, conversão pode ser feita na aplicação ou em views
    "Data_Atualizacao" TEXT,
    "Data_Habilitacao" TEXT,
    "Previsao_Termino_Fase_Etapa" TEXT,
    "Status_Atualizacao" TEXT,
    "Status_Cadastro" TEXT,
    "Previsao_Entrega" TEXT,
    "Empresas" JSONB, -- Armazena o array de empresas como JSONB

    -- Campos adicionais para controle
    "avaliado" BOOLEAN DEFAULT FALSE NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comentários sobre colunas específicas
COMMENT ON COLUMN public.obras."Codigo" IS 'Código único da obra (chave primária).';
COMMENT ON COLUMN public.obras."Empresas" IS 'Array JSON contendo detalhes das empresas associadas.';
COMMENT ON COLUMN public.obras."avaliado" IS 'Indica se a obra já foi avaliada (TRUE) ou não (FALSE).';

-- Trigger para atualizar automaticamente a coluna updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.obras
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Índices para otimizar consultas (opcional, mas recomendado)
CREATE INDEX idx_obras_avaliado ON public.obras ("avaliado");
CREATE INDEX idx_obras_cidade ON public.obras ("Cidade");
CREATE INDEX idx_obras_estado ON public.obras ("Estado"); 