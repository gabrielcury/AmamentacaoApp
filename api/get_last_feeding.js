import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY); // Add your Firebase service account key to environment variables

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://amamentacao.firebaseio.com', // Replace with your database URL
    });
}

const db = admin.firestore();
 
export default async function handler(req, res) {
    if (req.method === 'GET') {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Expires', '0');
        res.setHeader('Pragma', 'no-cache');

        try {
            const doc = await db.collection('feedings').doc('lastFeeding').get();
            if (!doc.exists) {
                console.log("No data found.");
                return res.status(200).json(null);
            }

            const lastFeeding = doc.data();
            console.log("Last feeding data:", lastFeeding);

            if (!lastFeeding.date) {
                console.log("No feeding date recorded.");
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
        } catch (error) {
            console.error("Error reading from Firestore:", error);
            return res.status(500).json({ message: 'Error reading from database', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
