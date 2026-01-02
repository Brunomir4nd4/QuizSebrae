interface NotifyDotProps {
	/**
	 * Posição do ponto de notificação na tela.
	 * Pode ser: 'top-right-sm', 'top-left-sm', 'top-right-lg' ou 'top-left-lg'.
	 */
	position?: 'top-right-sm' | 'top-left-sm' | 'top-right-lg' | 'top-left-lg';

	size?: 'sm' | 'lg';
}

/**
 * **NotifyDot**
 *
 * ### 🧩 Funcionalidade
 * - Exibe ponto de notificação visual em posição configurável.
 * - Usado para indicar novidades, alertas ou notificações.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <NotifyDot position="top-right-sm" />
 * ```
 *
 * ### 🎨 Estilização
 * - Span absoluto com gradiente rosa.
 * - Classes Tailwind para posicionamento.
 * - Tamanho responsivo (size-2 md:size-3).
 *
 * @component
 */
export default function NotifyDot({
	position = 'top-right-sm',
	size = 'sm',
}: NotifyDotProps) {
	const getPositionClasses = (
		position: NotifyDotProps['position'] = 'top-right-sm',
	) => {
		switch (position) {
			case 'top-right-sm':
				return 'top-2 right-2';
			case 'top-left-sm':
				return 'top-2 left-2';
			case 'top-right-lg':
				return 'top-4 right-4';
			case 'top-left-lg':
				return 'top-4 left-4';
			default:
				return 'top-2 right-2';
		}
	};

	const getSize = (size: NotifyDotProps['size'] = 'sm') => {
		switch (size) {
			case 'sm':
				return 'size-2 md:size-3';
			case 'lg':
				return 'size-4 md:size-6';
		}
	};

	return (
		<span
			className={`absolute inline-flex ${getSize(size)} rounded-full bg-gradient-to-br from-pink-dark to-pink-light shadow-md ${getPositionClasses(position)}`}></span>
	);
}
