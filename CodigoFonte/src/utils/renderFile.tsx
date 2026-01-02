import React from 'react';
import { Description } from '@mui/icons-material';
import { FileItem } from '@/components/EnvioDeAtividades/components/Upload.component';
import { ModalButton } from '@/components/NotifyModal/NotifyModal.styles';
import { getFileType } from '@/constants/fileTypes';
import WordIcon from '@/components/Icons/WordIcon';
import ImageIcon from '@/components/Icons/ImageIcon';
import VideoIcon from '@/components/Icons/VideoIcon';
import AudioIcon from '@/components/Icons/AudioIcon';
import PdfIcon from '@/components/Icons/PdfIcon';
import ExcelIcon from '@/components/Icons/ExcelIcon';
import TxtIcon from '@/components/Icons/TxtIcon';
import CsvIcon from '@/components/Icons/CsvIcon';
import DocumentIcon from '@/components/Icons/DocumentIcon';
import { downloadFile } from './downloadFile';

const handleExpand = (item: FileItem) => {
	if (item.url.startsWith('blob:')) {
		const link = document.createElement('a');
		link.href = item.url;
		link.download = item.name;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		return;
	}

	const cleanUrl = item.url.startsWith('/') ? item.url.slice(1) : item.url;

	const apiUrl = `/api/download?url=${encodeURIComponent(cleanUrl)}&name=${encodeURIComponent(item.name)}`;

	downloadFile(apiUrl, item.name);
};

export const renderFile = (item: FileItem): JSX.Element => {
	const type = getFileType(item);
	const fileName = item.file?.name || item.name;

	const imageUrl = item.url.startsWith('blob:')
		? item.url
		: `/api/submissions/files/${item.url.startsWith('/') ? item.url.slice(1) : item.url}`;

	const iconMap: Record<string, React.ElementType> = {
		heic: ImageIcon,
		heif: ImageIcon,
		word: WordIcon,
		video: VideoIcon,
		audio: AudioIcon,
		pdf: PdfIcon,
		excel: ExcelIcon,
		txt: TxtIcon,
		csv: CsvIcon,
		document: DocumentIcon,
		other: DocumentIcon,
	};

	const IconElement = iconMap[type] || DocumentIcon;

	switch (type) {
		case 'image':
			return (
				<div>
					<img
						src={imageUrl}
						alt={fileName}
						className='w-full h-full max-w-full object-contain'
					/>
				</div>
			);

		case 'heic':
		case 'heif':
		case 'document':
		case 'video':
		case 'audio':
		case 'pdf':
		case 'word':
		case 'excel':
		case 'txt':
		case 'csv':
			return (
				<div className='py-44 text-center flex flex-col items-center'>
					<div className='p-3 w-[60px] h-[60px] rounded-full bg-[#222325] text-green-light mx-auto'>
						<IconElement className='w-[32px] h-[32px]' />
					</div>
					<p className='text-lg text-[#222325] mb-2'>
						{type === 'document' ? 'Documento' : type.toUpperCase()}
					</p>
					<p className='text-2xl text-[#222325] mb-6'>{fileName}</p>
					<ModalButton sx={{ margin: 0 }} onClick={() => handleExpand(item)}>
						<div>
							<img src='/icon-download-preto.svg' alt='' className='w-[20px]' />
						</div>
						<p className='text-lg text-green-light font-bold'>Abrir arquivo</p>
					</ModalButton>
				</div>
			);

		default:
			return (
				<div className='py-44 text-center flex flex-col items-center'>
					<div className='p-3 w-[60px] h-[60px] rounded-full bg-[#222325] text-green-light mx-auto'>
						<Description fontSize='large' />
					</div>
					<p className='text-lg text-[#222325] mb-2'>Arquivo</p>
					<p className='text-2xl text-[#222325] mb-6'>{fileName}</p>
					<ModalButton>
						<a href={item.url} download target='_blank'>
							<div>
								<img
									src='/icon-download-preto.svg'
									alt=''
									className='w-[20px]'
								/>
							</div>
							<p className='text-lg text-green-light font-bold'>Excluir</p>
						</a>
					</ModalButton>
				</div>
			);
	}
};

export const renderFileThumbnail = (item: FileItem): JSX.Element => {
	const type = getFileType(item);

	const imageUrl = item.url.startsWith('blob:')
		? item.url
		: `/api/submissions/files/${item.url.startsWith('/') ? item.url.slice(1) : item.url}`;

	if (type === 'image') {
		return (
			<img
				src={imageUrl}
				alt={item.name}
				className='h-full w-full object-cover'
			/>
		);
	}

	const iconMap: Record<string, React.ElementType> = {
		heic: ImageIcon,
		heif: ImageIcon,
		word: WordIcon,
		video: VideoIcon,
		audio: AudioIcon,
		pdf: PdfIcon,
		excel: ExcelIcon,
		txt: TxtIcon,
		csv: CsvIcon,
		document: DocumentIcon,
		other: DocumentIcon,
	};

	const IconElement = iconMap[type] || DocumentIcon;

	return (
		<div className='text-center text-sm font-medium text-white flex flex-col items-center gap-2 p-2'>
			<IconElement />
			{item.name}
		</div>
	);
};
