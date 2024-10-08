let lastFeeding = {
    side: "Nenhum",
    date: null
};

export default function handler(req, res) {
    if (req.method === 'GET') {
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
    }
}
