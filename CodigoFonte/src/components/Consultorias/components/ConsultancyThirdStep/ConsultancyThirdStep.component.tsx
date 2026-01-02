"use client";
import { Grid } from "@mui/material";
import { FunctionComponent } from "react";
import React from "react";
import { Booking } from "@/types/ITurma";
import { StyledInput } from "@/components/StyledInput";
import { StyledSelect } from "@/components/StyledSelect";
import { Questions } from "@/components/Consultorias";

interface ConsultoriasProps {
  /** Objeto com as respostas do usuário para as perguntas da mentoria */
  questions: Questions
  /** Função para atualizar as respostas das perguntas */
  setQuestions: (value: React.SetStateAction<Questions>) => void
  /** Slug do curso, usado para buscar assuntos padrão */
  courseSlug: string
  /** Lista de assuntos customizados para o curso (opcional) */
  formSubjects?: string[]
  /** Exibe o componente em modo drawer (layout responsivo) */
  isDrawerView?: boolean
}

// TODO tornar dinâmico a coleta de assuntos da mentoria
const coursesSubjects: { [key: string]: string[] } = {
  "upmarketing": [
    "Jornada do consumidor: o que é e como fazer?",
    "Persona",
    "Tom e Voz",
    "Inbound e Outbound",
    "Redes sociais",
    "Google Perfil de Empresa",
    "CRM",
    "Landing pages",
    "Criação de conteúdo",
    "Estratégia digital",
    "Site da empresa, domínio e e-mail personalizado",
    "Marketplace x Loja Virtual",
  ],
  "upfinancas": [
    "O ambiente de negócios e a tecnologia",
    "Conceitos-chave de Gestão Financeira",
    "Fluxo de Caixa",
    "Ciclo Operacional, Financeiro e Econômico",
    "Ferramentas digitais",
    "Indicadores de desempenho financeiro",
    "Como precificar corretamente?",
    "Objetivos do crédito para MEIs e MPEs",
    "O que os bancos analisam em uma proposta de financiamento ou empréstimo?",
  ],
  "negociodelas": [
    "Análise de negociação",
    "Estratégias de negociação",
    "A comunicação não verbal e a sua influência",
    "Perfil de negociação",
    "As quatro fases da negociação",
    "Criação de propostas",
    "Matriz de objeções",
    "Tomada de decisão",
    "Tipos de negociação",
    "ZOPA",
    "MAPAN",
  ],
  "investimentodelas": [
    "Autocuidado financeiro e bem-estar",
    "Orçamento e planejamento financeiro",
    "Dívidas e crédito",
    "Perfil de investidora",
    "Tipos de investimento",
    "Detalhamento de metas SMART",
    "Fluxo de caixa",
    "Conciliação bancária",
    "Demonstração do Resultado do Exercício (DRE)",
    "Pró-labore",
    "MarketUP",
  ],
  "marcadelas": [
    "Quem sou eu e como me comunico",
    "Construindo minha história para o mundo",
    "Comunicação, apresentação pessoal e imagem profissional",
    "Estratégias de mídias sociais",
    "Pitch de sucesso",
    "Como dizer não de forma assertiva",
    "Uso da linguagem corporal",
  ],
  generic: [
    "Outro",
  ],
};

/**
 * **ConsultancyThirdStep**
 *
 * Exibe o terceiro passo do fluxo de agendamento de consultorias, coletando informações adicionais do usuário: @ de redes sociais, assunto principal e dúvidas específicas.
 * Permite seleção dinâmica de assuntos conforme o curso e adapta o layout para modo drawer ou tela cheia.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Campos para @ redes sociais, assunto e dúvidas.
 * - Seleção de assuntos dinâmicos por curso.
 * - Suporte a modo drawer (layout responsivo).
 * - Validação e atualização de perguntas.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ConsultancyThirdStep
 *   courseSlug="upmarketing"
 *   questions={questions}
 *   setQuestions={setQuestions}
 *   isDrawerView={false}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (usa Material-UI Grid).
 *
 * ---
 *
 * @component
 */
export const ConsultancyThirdStep: FunctionComponent<ConsultoriasProps> = ({
  courseSlug,
  formSubjects,
  questions,
  setQuestions,
  isDrawerView
}) => {
  const handleQuestionsInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setQuestions((prevQuestions) => ({
      ...prevQuestions,
      [name]: value,
    }));
  };

  const subjects: string[] = formSubjects ?? coursesSubjects[courseSlug];
  const borderColor = isDrawerView ? '#000000' : '#D0D1D4'

  return (
    <>
      <Grid item xs={12} md={isDrawerView ? 12 : 6} className="border-[#000000]">
        <div className={`rounded-[20px] border border-[${borderColor}] py-[25px] px-[30px]`}>
          <p className="text-lg md:xl 3xl:text-2xl text-[#070D26] font-bold mb-3">
            Informe seu @ nas redes sociais.
          </p>
          <StyledInput
            name="social_network"
            setValue={(e) => handleQuestionsInput(e)}
            value={questions.social_network}
            placeholder="Seu @"
          />
        </div>
      </Grid>
      <Grid item xs={12} md={isDrawerView ? 12 : 6}>
        <div className={`rounded-[20px] border border-[${borderColor}] p-[25px] `}>
          <p className="text-lg md:xl 3xl:text-2xl text-[#070D26] font-bold mb-3">
            Qual o principal assunto?
          </p>
          {subjects && <StyledSelect
            name="main_topic"
            setValue={(e) => handleQuestionsInput(e)}
            value={questions.main_topic}
            placeholder="Escolha o principal assunto"
            items={subjects}
          />}
        </div>
      </Grid>
      <Grid item xs={12} md={isDrawerView ? 12 : 6}>
        <div className={`rounded-[20px] border border-[${borderColor}] p-[25px]`}>
          <p className="text-lg md:xl 3xl:text-2xl text-[#070D26] font-bold mb-3">
            Tem alguma dúvida específica ou complemento?
          </p>
          <StyledInput
            name="specific_questions"
            setValue={(e) => handleQuestionsInput(e)}
            value={questions.specific_questions}
            placeholder="Escreva a sua dúvida"
          />
        </div>
      </Grid>
    </>
  );
};
