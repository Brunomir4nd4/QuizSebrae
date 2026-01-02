import * as React from 'react';
import type { FunctionComponent } from 'react';
import { Content, ImageCover, Label, Section } from './Maintenance.styles';

import Image from 'next/image';

interface MaintenanceProps {
	/**
	 * Caminho da imagem de banner exibida no topo.
	 */
	banner: string;
	/**
	 * Título principal da página de manutenção.
	 */
	title?: string;
	/**
	 * Mensagem de destaque exibida ao usuário.
	 */
	message?: string;
	/**
	 * Descrição complementar sobre a manutenção.
	 */
	description?: string;
}

/**
 * **Maintenance**
 *
 * ### 🧩 Funcionalidade
 * - Exibe página de manutenção personalizada com banner, título, mensagem e descrição.
 * - Informa usuário sobre indisponibilidade temporária.
 * - Mostra marca parceira (Sebrae) se aplicável.
 * - Usa dados do projeto via env.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <Maintenance
 *   banner="/path/to/banner.jpg"
 *   title="Em Manutenção"
 *   message="Voltamos em breve!"
 *   description="Estamos melhorando o sistema."
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Layout similar ao Login com ImageCover e Content.
 * - Tipografia responsiva, ícone de construção.
 * - Marca parceira no rodapé.
 *
 * @component
 */
export const Maintenance: FunctionComponent<MaintenanceProps> = ({
	banner,
	title,
	message,
	description,
}) => {
	const projectName = process.env.PROJECT_NAME;

	return (
		<Section>
			<ImageCover>
				{banner && (
					<Image src={banner} width='1394' height='1080' alt='Background' />
				)}
			</ImageCover>

			<Content>
				<Label>
					<span>
						<Image src='/icon-construction.svg' width='14' height={16} alt='' />
					</span>
					<h3>{title}</h3>
				</Label>

				<>
					<h1 className='text-[#070D26] font-bold text-5xl 3xl:text-57 leading-[1.1] mt-[50px] 3xl:mt-[83px]'>
						{message}
					</h1>
					<h2 className='text-[#6E707A] font-light text-xl md:text-2xl mt-[16px] mb-[38px]'>
						{description}
					</h2>
				</>
				<div className='marca-parceiro'>
					{projectName === 'sebrae' && (
						<Image src='/sebrae.svg' width='80' alt='' height={40} />
					)}
				</div>
			</Content>
		</Section>
	);
};
