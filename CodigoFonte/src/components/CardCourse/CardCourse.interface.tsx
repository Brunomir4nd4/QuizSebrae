/**
 * Props do componente CardCourse
 * 
 * Card para seleção e acesso a cursos/turmas específicos.
 */
export interface Props {
    /**
     * Nome do curso/turma
     */
    title: string,
    /**
     * Texto do botão de ação (ex: "Entrar")
     */
    text: string,
    /**
     * Função executada ao clicar no card
     */
    onClick: () => void;
    /**
     * URL da logo do curso
     */
    image: string;
    /**
     * Altura da imagem em pixels
     */
    height: number;
    /**
     * Largura da imagem em pixels
     */
    width: number;
    /**
     * Indica se este curso está atualmente selecionado/ativo
     */
    active?: boolean;
    /**
     * ID único do curso para identificação
     */
    classId: number
}