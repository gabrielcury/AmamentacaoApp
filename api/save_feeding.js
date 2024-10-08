import fs from 'fs';
import path from 'path';

const dbFilePath = path.join(process.cwd(), 'db.txt');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { side, date } = req.body;

        if (!side || !date) {
            return res.status(400).json({ message: 'Dados incompletos' });
        }

        const lastFeeding = { side, date };

        // Log do caminho para garantir que esteja correto
        console.log("Salvando no caminho:", dbFilePath);

        // Escrever no arquivo db.txt
        fs.writeFile(dbFilePath, JSON.stringify(lastFeeding), (err) => {
            if (err) {
                console.error("Erro ao escrever no arquivo:", err); // Log detalhado do erro
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
