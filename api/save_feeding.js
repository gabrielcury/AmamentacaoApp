import admin from 'firebase-admin';

// Parse the service account key from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { side, date } = req.body;

        if (!side || !date) {
            return res.status(400).json({ message: 'Incomplete data' });
        }

        const lastFeeding = { side, date };

        try {
            await db.collection('feedings').doc('lastFeeding').set(lastFeeding);
            res.status(200).json({
                success: true,
                message: 'Record saved successfully',
                date: lastFeeding.date
            });
        } catch (error) {
            console.error("Error writing to Firestore:", error);
            return res.status(500).json({ message: 'Error saving data', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
