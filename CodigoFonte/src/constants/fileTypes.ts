import { FileItem } from '@/components/EnvioDeAtividades/components/Upload.component';

export const allowedSubmitionTypes = [
	// Imagens
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/svg+xml',
	'image/heic',
	'image/heif',

	// Vídeos
	'video/mp4',
	'video/quicktime',
	'video/x-matroska',
	'video/x-msvideo',
	'video/webm',
	'video/x-flv',
	'video/3gpp',

	// Áudios
	'audio/mpeg',
	'audio/aac',
	'audio/mp4',
	'audio/ogg',
	'audio/opus',
	'audio/flac',
	'audio/alac',
	'audio/wav',
	'audio/x-wav',
	'audio/aiff',
	'audio/amr',

	// Documentos
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.oasis.opendocument.text',
	'text/plain',
	'application/rtf',
	'application/x-iwork-pages-sffpages',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.oasis.opendocument.spreadsheet',
	'text/csv',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/vnd.oasis.opendocument.presentation',
	'application/vnd.apple.keynote',
];

export const getFileType = (
	item: FileItem,
):
	| 'image'
	| 'pdf'
	| 'document'
	| 'video'
	| 'audio'
	| 'word'
	| 'excel'
	| 'txt'
	| 'csv'
	| 'heic'
	| 'heif'
	| 'other' => {
	const type = item.file?.type || item.type;

	if (!type) return 'other';

	if (type.startsWith('image/')) {
		if (type === 'image/heic') return 'heic';
		if (type === 'image/heif') return 'heif';
		return 'image';
	}
	if (type.startsWith('video/')) return 'video';
	if (type.startsWith('audio/')) return 'audio';
	if (type === 'application/pdf') return 'pdf';

	if (
		type === 'application/msword' ||
		type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
		type === 'application/vnd.oasis.opendocument.text' ||
		type === 'application/rtf' ||
		type === 'application/x-iwork-pages-sffpages'
	) {
		return 'word';
	}

	if (
		type === 'application/vnd.ms-excel' ||
		type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
		type === 'application/vnd.oasis.opendocument.spreadsheet'
	) {
		return 'excel';
	}

	if (type === 'text/csv') return 'csv';
	if (type === 'text/plain') return 'txt';

	if (
		type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
		type === 'application/vnd.oasis.opendocument.presentation' ||
		type === 'application/vnd.apple.keynote'
	) {
		return 'document';
	}

	return 'other';
};
