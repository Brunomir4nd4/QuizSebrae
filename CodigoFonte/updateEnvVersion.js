const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env'); // Ajuste para o caminho correto do seu arquivo .env
const packageJsonPath = path.join(__dirname, 'package.json');

// Lê a versão do package.json
const version = require(packageJsonPath).version;
const versionLine = `NEXT_PUBLIC_APP_VERSION=${version}\n`;

// Lê o conteúdo atual do arquivo .env
fs.readFile(envPath, 'utf8', (err, data) => {
	if (err) {
		console.error('Erro ao ler o arquivo .env:', err);
		process.exit(1);
	}

	const lines = data.split('\n');

	// Procura pela linha com NEXT_PUBLIC_APP_VERSION e atualiza ou adiciona a versão
	const updatedLines = lines
		.map((line) =>
			line.startsWith('NEXT_PUBLIC_APP_VERSION=') ? versionLine.trim() : line,
		)
		.filter(Boolean);

	if (
		!updatedLines.some((line) => line.startsWith('NEXT_PUBLIC_APP_VERSION='))
	) {
		updatedLines.push(versionLine.trim()); // Adiciona a versão se não existir
	}

	// Escreve o arquivo .env atualizado
	fs.writeFile(envPath, updatedLines.join('\n') + '\n', (err) => {
		if (err) {
			console.error('Erro ao escrever no arquivo .env:', err);
			process.exit(1);
		} else {
			console.log('Versão atualizada no arquivo .env:', version);
			process.exit(0);
		}
	});
});
