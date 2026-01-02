import { NotifyModal } from '@/components/NotifyModal';
import { ClassResponse } from '@/types/IClass';

/**
 * Função utilitária que retorna um componente `NotifyModal` com base nos dados da turma e no papel do usuário fornecidos.
 *
 * @param classData - O objeto de dados da turma contendo informações de status e código.
 * @param role - O papel do usuário, determinando qual variante do modal exibir.
 * @param whatsAppLink - O link do WhatsApp para suporte.
 * @param userName - O nome do usuário para personalizar a mensagem.
 *
 * @returns Um componente `NotifyModal` com base nos dados da turma e no papel fornecidos, ou `null` se nenhuma condição for atendida.
 */
export const getNotifyErrorModal = (
	classData: ClassResponse,
	role: boolean,
	whatsAppLink: string,
	userName: string,
) => {
	if (classData) {
		if (classData.status === 404) {
			if (classData?.code === 'cycle_not_found') {
				if (role) {
					return (
						<NotifyModal
							title='seus dados'
							highlight='Atualize'
							message='Não conseguimos obter suas informações. Não encontramos nenhuma turma no seu cadastro. <strong>Por favor, tente novamente.</strong>'
							logout={true}
							reload={true}
						/>
					);
				}
				return (
					<NotifyModal
						title='novamente!'
						highlight='Boas-vindas,'
						message='Ficamos felizes em te ver por aqui. A jornada do seu último curso já se encerrou. Caso esteja inscrito em uma nova turma, lembramos que seu acesso é liberado no primeiro dia de aula. <br><strong>Dúvidas? Entre em contato com nosso suporte agora mesmo.</strong>'
						logout={true}
						whats={true}
						whatsLink={whatsAppLink}
					/>
				);
			}

			if (classData?.code === 'classes_not_found') {
				return (
					<NotifyModal
						title='Atenção'
						message='Não conseguimos obter suas informações. Não encontramos nenhuma turma no seu cadastro. <strong>Por favor, tente novamente.</strong>'
						logout={true}
						reload={false}
					/>
				);
			}
		}
		if (classData.status === 403) {
			return (
				<NotifyModal
					title='A sua matrícula foi cancelada'
					message={`<strong>${userName}</strong>, isso aconteceu porque você não realizou as atividades mínimas, caracterizando abandono do curso <strong>${classData.course}</strong>. A partir de agora, não será possível realizar uma nova inscrição para o mesmo curso durante o período de 12 meses. <br><br><strong>Ficou alguma dúvida? Entre em contato agora mesmo.</strong>`}
					logout={true}
					whats={true}
					whatsLink={whatsAppLink}
				/>
			);
		}
	}

	return null; // Retorna null se nenhuma condição for atendida
};
