import fs from 'fs';
import path from 'path';

// Usando o diretório temporário no Vercel ou outras plataformas com sistema de arquivos somente leitura
const dbFilePath = path.join('/tmp', 'db.txt');

export default function handler(req, res) {
    if (req.method === 'GET') {
        // Desativar o cache para garantir que sempre uma nova resposta seja enviada
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Expires', '0');
        res.setHeader('Pragma', 'no-cache');

        // Verifica se o arquivo db.txt existe
        if (!fs.existsSync(dbFilePath)) {
            console.log("Arquivo não encontrado:", dbFilePath);
            return res.status(200).json(null);
        }

        // Lê o arquivo db.txt
        fs.readFile(dbFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error("Erro ao ler o arquivo:", err);
                return res.status(500).json({ message: 'Erro ao ler o banco de dados', error: err.message });
            }

            // Parse o conteúdo do arquivo
            let lastFeeding;
            try {
                lastFeeding = JSON.parse(data);
            } catch (parseError) {
                console.error("Erro ao interpretar os dados do arquivo:", parseError);
                return res.status(500).json({ message: 'Erro ao interpretar os dados do arquivo', error: parseError.message });
            }

            // Verifica se há uma data de alimentação registrada
            if (!lastFeeding.date) {
                console.log("Nenhum registro de data encontrado.");
                return res.status(200).json(null);
            }

            // Calcula a diferença de tempo entre a última alimentação e o tempo atual
            const lastFeedingTime = new Date(lastFeeding.date);
            const currentTime = new Date();
            const timeDifference = (currentTime - lastFeedingTime) / 1000;

            // Calcula o tempo restante até a próxima alimentação (3 horas de intervalo)
            const remainingTime = Math.max(3 * 60 * 60 - timeDifference, 0);

            // Retorna os dados da última alimentação e o tempo restante
            res.status(200).json({
                lado: lastFeeding.side,
                date: lastFeeding.date,
                remaining_time: remainingTime
            });
        });
    } else {
        // Retorna erro 405 se o método não for GET
        res.status(405).json({ message: 'Método não permitido' });
    }
}
