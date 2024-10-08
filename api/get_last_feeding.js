import fs from 'fs';
import path from 'path';

const dbFilePath = path.join(process.cwd(), 'db.txt');

export default function handler(req, res) {
    if (req.method === 'GET') {
        // Verifica se o arquivo db.txt existe
        if (!fs.existsSync(dbFilePath)) {
            return res.status(200).json(null);
        }

        // Lê o arquivo db.txt
        fs.readFile(dbFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao ler o banco de dados' });
            }

            const lastFeeding = JSON.parse(data);

            if (!lastFeeding.date) {
                return res.status(200).json(null);
            }

            const lastFeedingTime = new Date(lastFeeding.date);
            const currentTime = new Date();
            const timeDifference = (currentTime - lastFeedingTime) / 1000;

            const remainingTime = Math.max(3 * 60 * 60 - timeDifference, 0);

            res.status(200).json({
                lado: lastFeeding.side,
                date: lastFeeding.date,
                remaining_time: remainingTime
            });
        });
    }
}
