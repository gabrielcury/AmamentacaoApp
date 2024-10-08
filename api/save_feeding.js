let lastFeeding = {
    side: "Nenhum",
    date: null
};

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { side, date } = req.body;

        if (!side || !date) {
            return res.status(400).json({ message: 'Dados incompletos' });
        }

        lastFeeding = {
            side,
            date
        };

        res.status(200).json({
            success: true,
            message: 'Registro salvo com sucesso',
            date: lastFeeding.date
        });
    }
}
