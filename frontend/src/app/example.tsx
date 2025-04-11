import React, { useState } from 'react';
import { Building2, CheckCircle, ChevronDown, PartyPopper } from 'lucide-react';

interface Work {
  id: string;
  nome: string;
  spe: string;
  tipo_de_obra: string;
  subsetor: string;
  categoria_de_uso: string;
  status: string;
  fase: string;
  etapa: string;
  padrao_de_acabamento: string;
  especificacao: string;
  tipo_de_investimento: string;
  valor_do_investimento: string;
  grandeza_do_investimento: string;
  area: string;
  numero_torres: number;
  numero_pisos: number;
  numero_salas: number;
  numero_apartamentos: number;
  numero_casas: number;
  numero_lojas: number;
  numero_unidades: number;
  cep: string;
  endereco: string;
  numero_endereco: string;
  complemento_endereco: string;
  bairro: string;
  regiao: string;
  estado: string;
  cidade: string;
  telefone_canteiro: string;
  data_cadastro: string;
  data_atualizacao: string;
  data_habilitacao: string;
  previsao_termino_fase_etapa: string;
  status_atualizacao: string;
  status_cadastro: string;
  previsao_entrega: string;
  empresas: string;
}

// Sample data
const works: Work[] = [
  {
    id: '1',
    nome: 'Obra A',
    spe: 'SPE Exemplo',
    tipo_de_obra: 'Residencial',
    subsetor: 'Construção',
    categoria_de_uso: 'Comercial',
    status: 'Em andamento',
    fase: 'Execução',
    etapa: 'Fundação',
    padrao_de_acabamento: 'Alto',
    especificacao: 'Detalhes da especificação',
    tipo_de_investimento: 'Privado',
    valor_do_investimento: '1.000.000',
    grandeza_do_investimento: 'Milhões',
    area: '500m²',
    numero_torres: 2,
    numero_pisos: 10,
    numero_salas: 100,
    numero_apartamentos: 50,
    numero_casas: 0,
    numero_lojas: 5,
    numero_unidades: 155,
    cep: '12345-678',
    endereco: 'Rua Exemplo',
    numero_endereco: '123',
    complemento_endereco: 'Apto 101',
    bairro: 'Centro',
    regiao: 'Sul',
    estado: 'SP',
    cidade: 'São Paulo',
    telefone_canteiro: '(11) 1234-5678',
    data_cadastro: '2023-01-01',
    data_atualizacao: '2023-06-01',
    data_habilitacao: '2023-02-01',
    previsao_termino_fase_etapa: '2023-12-01',
    status_atualizacao: 'Atualizado',
    status_cadastro: 'Completo',
    previsao_entrega: '2024-01-01',
    empresas: 'Empresa Exemplo',
  },
];

interface InfoGroupProps {
  title: string;
  children: React.ReactNode;
}

const InfoGroup: React.FC<InfoGroupProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-left"
      >
        <span className="font-medium text-gray-700">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="p-4 grid grid-cols-2 gap-4 bg-white">{children}</div>
      )}
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string | number;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-gray-900">{value}</p>
  </div>
);

function App() {
  const [currentWorkIndex, setCurrentWorkIndex] = useState(0);
  const [rating, setRating] = useState<number | null>(null);
  const [justification, setJustification] = useState('');
  const [evaluatedWorks, setEvaluatedWorks] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentWork = works[currentWorkIndex];
  const remainingWorks = works.length - evaluatedWorks.length;
  const progress = (evaluatedWorks.length / works.length) * 100;

  const handleSubmit = () => {
    if (rating !== null && justification.trim() !== '') {
      // Show success message
      setShowSuccess(true);

      // Add celebration effect
      const confetti = document.createElement('div');
      confetti.className = 'fixed inset-0 pointer-events-none z-50';
      document.body.appendChild(confetti);

      // Remove confetti after animation
      setTimeout(() => {
        document.body.removeChild(confetti);
      }, 2000);

      // Update evaluated works
      setEvaluatedWorks([...evaluatedWorks, currentWork.id]);

      // Wait for success message, then move to next work
      setTimeout(() => {
        setShowSuccess(false);
        if (currentWorkIndex < works.length - 1) {
          setCurrentWorkIndex(currentWorkIndex + 1);
          setRating(null);
          setJustification('');
          const element = document.getElementById('evaluation-card');
          element?.classList.add('scale-0');
          setTimeout(() => {
            element?.classList.remove('scale-0');
          }, 300);
        }
      }, 1500);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success overlay */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center animate-bounce">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-xl font-semibold text-gray-900">Avaliação concluída!</p>
            <p className="text-gray-500 mt-2">Próxima obra em breve...</p>
          </div>
        </div>
      )}

      {/* Header with logos */}
      <header className="w-full px-8 py-4 bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="w-32 h-12 bg-gray-50 flex items-center justify-center">
            <span className="text-gray-400">Your Logo</span>
          </div>
          <div className="w-32 h-12 bg-gray-50 flex items-center justify-center">
            <span className="text-gray-400">Client Logo</span>
          </div>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="max-w-6xl mx-auto mt-8 px-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Building2 className="text-blue-500" />
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Obras avaliadas</span>
                <span className="text-sm font-medium">
                  {evaluatedWorks.length}/{works.length}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Faltam {remainingWorks} {remainingWorks === 1 ? 'obra' : 'obras'} para
            avaliar
          </p>
        </div>
      </div>

      {/* Evaluation card */}
      <div className="max-w-4xl mx-auto mt-8 px-8 pb-16">
        <div
          id="evaluation-card"
          className="bg-white rounded-xl shadow-sm transition-transform duration-300"
        >
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-900">
              {currentWork.nome}
            </h2>
            <p className="text-gray-500 mt-1">{currentWork.spe}</p>
          </div>

          <div className="p-6 space-y-6">
            <InfoGroup title="Informações Gerais">
              <InfoItem label="Tipo de Obra" value={currentWork.tipo_de_obra} />
              <InfoItem label="Subsetor" value={currentWork.subsetor} />
              <InfoItem
                label="Categoria de Uso"
                value={currentWork.categoria_de_uso}
              />
              <InfoItem label="Status" value={currentWork.status} />
              <InfoItem label="Fase" value={currentWork.fase} />
              <InfoItem label="Etapa" value={currentWork.etapa} />
              <InfoItem
                label="Padrão de Acabamento"
                value={currentWork.padrao_de_acabamento}
              />
              <InfoItem label="Especificação" value={currentWork.especificacao} />
            </InfoGroup>

            <InfoGroup title="Investimento e Dimensões">
              <InfoItem
                label="Tipo de Investimento"
                value={currentWork.tipo_de_investimento}
              />
              <InfoItem
                label="Valor do Investimento"
                value={`${currentWork.valor_do_investimento} ${currentWork.grandeza_do_investimento}`}
              />
              <InfoItem label="Área" value={currentWork.area} />
              <InfoItem
                label="Número de Torres"
                value={currentWork.numero_torres}
              />
              <InfoItem label="Número de Pisos" value={currentWork.numero_pisos} />
              <InfoItem label="Número de Salas" value={currentWork.numero_salas} />
              <InfoItem
                label="Número de Apartamentos"
                value={currentWork.numero_apartamentos}
              />
              <InfoItem label="Número de Casas" value={currentWork.numero_casas} />
              <InfoItem label="Número de Lojas" value={currentWork.numero_lojas} />
              <InfoItem
                label="Total de Unidades"
                value={currentWork.numero_unidades}
              />
            </InfoGroup>

            <InfoGroup title="Localização">
              <InfoItem label="CEP" value={currentWork.cep} />
              <InfoItem
                label="Endereço"
                value={`${currentWork.endereco}, ${currentWork.numero_endereco}`}
              />
              <InfoItem
                label="Complemento"
                value={currentWork.complemento_endereco}
              />
              <InfoItem label="Bairro" value={currentWork.bairro} />
              <InfoItem label="Região" value={currentWork.regiao} />
              <InfoItem
                label="Cidade/Estado"
                value={`${currentWork.cidade}/${currentWork.estado}`}
              />
              <InfoItem
                label="Telefone Canteiro"
                value={currentWork.telefone_canteiro}
              />
            </InfoGroup>

            <InfoGroup title="Datas e Status">
              <InfoItem
                label="Data de Cadastro"
                value={formatDate(currentWork.data_cadastro)}
              />
              <InfoItem
                label="Data de Atualização"
                value={formatDate(currentWork.data_atualizacao)}
              />
              <InfoItem
                label="Data de Habilitação"
                value={formatDate(currentWork.data_habilitacao)}
              />
              <InfoItem
                label="Previsão de Término"
                value={formatDate(currentWork.previsao_termino_fase_etapa)}
              />
              <InfoItem
                label="Status de Atualização"
                value={currentWork.status_atualizacao}
              />
              <InfoItem
                label="Status de Cadastro"
                value={currentWork.status_cadastro}
              />
              <InfoItem
                label="Previsão de Entrega"
                value={formatDate(currentWork.previsao_entrega)}
              />
              <InfoItem label="Empresas" value={currentWork.empresas} />
            </InfoGroup>

            {/* Rating */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-500 mb-3">Avaliação</p>
              <div className="flex gap-2 flex-wrap">
                {[...Array(11)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setRating(i)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                      ${
                        rating === i
                          ? 'bg-blue-500 text-white'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                  >
                    {i}
                  </button>
                ))}
              </div>

              {/* Justification */}
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-3">Justificativa</p>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="w-full h-32 p-3 bg-white border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explique sua avaliação..."
                />
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={rating === null || justification.trim() === ''}
                className={`w-full py-3 rounded-lg mt-6 flex items-center justify-center gap-2 transition-colors duration-200
                  ${
                    rating !== null && justification.trim() !== ''
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <CheckCircle size={20} />
                Enviar avaliação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;