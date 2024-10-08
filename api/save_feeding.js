import fs from 'fs';
import path from 'path';

// Usando o diretório temporário no Vercel
const dbFilePath = path.join('/tmp', 'db.txt');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { side, date } = req.body;

        if (!side || !date) {
            return res.status(400).json({ message: 'Dados incompletos' });
        }

        const lastFeeding = { side, date };

        // Salvar os dados no arquivo no diretório /tmp
        fs.writeFile(dbFilePath, JSON.stringify(lastFeeding), (err) => {
            if (err) {
                console.error("Erro ao escrever no arquivo:", err);
                return res.status(500).json({ message: 'Erro ao salvar os dados', error: err.message });
            }

            // Verifique se os dados foram realmente salvos
            fs.readFile(dbFilePath, 'utf8', (err, data) => {
                if (err) {
                    console.error("Erro ao ler o arquivo após salvar:", err);
                } else {
                    console.log("Conteúdo do arquivo salvo:", data); // Log para verificar o que foi salvo
                }
            });

            res.status(200).json({
                success: true,
                message: 'Registro salvo com sucesso',
                date: lastFeeding.date
            });
        });
    }
}
