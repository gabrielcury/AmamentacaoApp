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

        // Escrever no arquivo db.txt
        fs.writeFile(dbFilePath, JSON.stringify(lastFeeding), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao salvar os dados' });
            }

            res.status(200).json({
                success: true,
                message: 'Registro salvo com sucesso',
                date: lastFeeding.date
            });
        });
    }
}
