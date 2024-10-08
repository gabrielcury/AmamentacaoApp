import fs from 'fs';
import path from 'path';

// Usando o diretório temporário em Vercel ou outras plataformas com sistema de arquivos somente leitura
const dbFilePath = path.join('/tmp', 'db.txt');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { side, date } = req.body;

        if (!side || !date) {
            return res.status(400).json({ message: 'Dados incompletos' });
        }

        const lastFeeding = { side, date };

        // Log do caminho para depuração
        console.log("Salvando no caminho:", dbFilePath);

        // Escrever no arquivo no diretório /tmp
        fs.writeFile(dbFilePath, JSON.stringify(lastFeeding), (err) => {
            if (err) {
                console.error("Erro ao escrever no arquivo:", err);
                return res.status(500).json({ message: 'Erro ao salvar os dados', error: err.message });
            }

            res.status(200).json({
                success: true,
                message: 'Registro salvo com sucesso',
                date: lastFeeding.date
            });
        });
    }
}
