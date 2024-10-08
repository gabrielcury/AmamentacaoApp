import fs from 'fs';
import path from 'path';

// Define o caminho do arquivo db.txt
const dbFilePath = path.join(process.cwd(), 'db.txt');

export default function handler(req, res) {
    if (req.method === 'GET') {
        // Verifica se o arquivo db.txt existe
        if (!fs.existsSync(dbFilePath)) {
            // Se o arquivo não existir, retorna null
            return res.status(200).json(null);
        }

        // Lê o arquivo db.txt
        fs.readFile(dbFilePath, 'utf8', (err, data) => {
            if (err) {
                // Erro ao ler o arquivo
                return res.status(500).json({ message: 'Erro ao ler o banco de dados', error: err.message });
            }

            // Parse o conteúdo do arquivo
            let lastFeeding;
            try {
                lastFeeding = JSON.parse(data);
            } catch (parseError) {
                // Erro ao fazer parse do JSON
                return res.status(500).json({ message: 'Erro ao interpretar os dados do arquivo', error: parseError.message });
            }

            // Verifica se há uma data de alimentação registrada
            if (!lastFeeding.date) {
                return res.status(200).json(null);
            }

            // Calcula a diferença de tempo entre a última alimentação e o tempo atual
            const lastFeedingTime = new Date(lastFeeding.date);
            const currentTime = new Date();
            const timeDiffere
