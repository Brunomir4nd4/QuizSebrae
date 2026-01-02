'use client';
import { FunctionComponent } from 'react';
import Image from 'next/image';
import { allowedSubmitionTypes } from '@/constants/fileTypes';
import { FileItem } from './Upload.component';

interface ButtonProps {
	action: (e: React.ChangeEvent<HTMLInputElement>) => void;
	items: FileItem[];
}

const UploadButton: FunctionComponent<ButtonProps> = ({ action, items }) => {
	return (
		<div className='group relative inline-block'>
			<input
				type='file'
				multiple
				onChange={action}
				accept={allowedSubmitionTypes.join(',')}
				className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
			/>
			<button
				color='primary'
				className='w-[390px] !bg-white !text-[#222325] px-10 py-5 rounded-full shadow-md text-lg text-left relative'>
				{items.length === 0
					? 'Escolher arquivo(s)'
					: items.length + ' arquivos selecionados'}

				<span className='bg-[#222325] absolute top-0 right-0 rounded-tr-full rounded-br-full h-[100%] w-[80px] flex items-center justify-center'>
					<Image
						className='group-hover:scale-110 transition-all'
						src='./icon-upload.svg'
						width={36}
						height={36}
						alt=''
					/>
				</span>
			</button>
		</div>
	);
};

export default UploadButton;
