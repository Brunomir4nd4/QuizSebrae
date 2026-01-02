export interface Props {
    /** Data e hora de início da consultoria (formato ISO) */
    start_datetime: string,
    /** Id da turma */
    classId: string | number,
    /** Indica se a consultoria é em grupo */
    is_group_meetings_enabled: boolean
    /** Id da reunião em grupo (opcional) */
    meeting_id?: string | number | null
}