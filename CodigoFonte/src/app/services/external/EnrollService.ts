
import { proxyRequest, wpRequest } from '../api';

/**
 * Obtém uma lista de todas as turmas.
 * @param token - O token de autenticação necessário para acessar os dados.
 * @returns Uma Promise que resolve em um array de objetos ClassResponse, representando as turmas.
 */
export const cancelEnroll = (
    enroll_id: string,
    reason: string,
    token: string
): Promise<any> => {
    return proxyRequest(`/enroll/cancel/${enroll_id}`, 'POST', {
        reason: reason
    });
};
