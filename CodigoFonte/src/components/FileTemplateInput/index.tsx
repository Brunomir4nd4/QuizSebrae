export type FileTemplateInputProps = {
	hasFile: boolean;

	/** Nome do arquivo (quando existir) */
	fileName?: string;

	/** Link para download (quando existir) */
	fileUrl?: string;

	/** Callback ao selecionar arquivo */
	onUpload?: (file: File) => void;

	/** Callback ao remover arquivo */
	onRemove?: () => void;
};

/**
 * **FileTemplateInput**
 *
 * ### 🧩 Funcionalidade
 * - Permite enviar um arquivo quando não há arquivo existente.
 * - Exibe arquivo existente com link de download.
 * - Permite remover o arquivo existente.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <FileTemplateInput
 *   hasFile={false}
 *   onUpload={(file) => console.log(file)}
 *   onRemove={() => console.log('removido')}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Layout flexível horizontal com gap.
 * - Botões e ícones interativos.
 * - Estado hover com underline e hover em botão de remover.
 *
 * @component
 */
export function FileTemplateInput({
	hasFile,
	fileName,
	fileUrl,
	onUpload,
	onRemove,
}: FileTemplateInputProps) {
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && onUpload) {
			onUpload(file);
		}
	};

	if (!hasFile) {
		return (
			<label
				htmlFor='file-upload'
				className='flex items-center gap-4 w-full rounded-xl border-gray-300 cursor-pointer'>
				<div className='bg-black rounded-full p-2'>
					<img src='icon-file-upload.svg' alt='Upload' className='w-6 h-6' />
				</div>

				<div className='flex flex-col'>
					<span className='text-gray-900'>Upload de template</span>
				</div>

				<input
					id='file-upload'
					type='file'
					className='hidden'
					onChange={handleFileChange}
				/>
			</label>
		);
	}

	return (
		<div className='flex items-center justify-between w-full rounded-xl'>
			<a
				href={fileUrl}
				target='_blank'
				rel='noopener noreferrer'
				className='flex items-center gap-3 hover:underline p-2'>
				<img src='icon-file-loaded.svg' alt='Arquivo' className='w-6 h-6' />
				<span className='text-gray-900'>{fileName}</span>
			</a>

			<button
				type='button'
				onClick={onRemove}
				className='p-2 rounded-full hover:bg-black/10 transition'>
				<img src='icon-close.svg' alt='Remover' className='w-5 h-5' />
			</button>
		</div>
	);
}
