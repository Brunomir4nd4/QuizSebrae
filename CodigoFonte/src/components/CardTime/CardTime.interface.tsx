export interface Props {
    /** Horário representado pelo card (ex: '14:00') */
    time: string,
    /** Indica se o horário está selecionado pelo usuário */
    active?: boolean,
    /** Indica se o horário está disponível para seleção */
    available?: boolean,
    /** Identificador único do card */
    id: string,
    /** Função chamada ao selecionar o horário */
    setStartTime: (startTime: string) => void;
    /** Variante de cor do card ('default' ou 'black') */
    variant?: 'default' | 'black'
    /** Quantidade de vagas já ocupadas no grupo (ou null) */
    group?: number | null
    /** Indica se o agendamento é em grupo */
    is_group_meetings_enabled: boolean
    /** Limite máximo de participantes no grupo */
    groupLimit?: number
}