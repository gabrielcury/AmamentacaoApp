let lastFeeding = {
    side: "Esquerdo",  // Inicialize com valores simulados ou reais
    date: new Date().toISOString()  // Data da última amamentação
};

export default function handler(req, res) {
    if (req.method === 'GET') {
        if (!lastFeeding.date) {
            // Se não houver registro de amamentação, retorne um objeto padrão
            return res.status(200).json({
                lado: "Nenhum",
                date: null,
                remaining_time: 0
            });
        }

        const lastFeedingTime = new Date(lastFeeding.date);
        const currentTime = new Date();
        const timeDifference = (currentTime - lastFeedingTime) / 1000; // Diferença em segundos

        // Supondo que o intervalo entre amamentações seja de 3 horas (10800 segundos)
        const remainingTime = Math.max(10800 - timeDifference, 0); // Tempo restante em segundos

        res.status(200).json({
            lado: lastFeeding.side,
            date: lastFeeding.date,
            remaining_time: remainingTime
        });
    }
}
