export function downloadFile(apiUrl: string, fileName: string) {
	const now = new Date();
	const pad = (n: number) => n.toString().padStart(2, '0');

	const dateStr = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
	const timeStr = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
	const baseFileName = `${fileName}_${dateStr}_${timeStr}.zip`;

	const link = document.createElement('a');
	link.href = apiUrl;
	link.download = baseFileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
