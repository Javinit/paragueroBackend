import Course from '../models/courses.js'
import { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } from 'mongodb-snapshot';

export class backupController {
    static async getBackup(req, res) {
        try {
            const mongo_connector = new MongoDBDuplexConnector({
                connection: {
                    uri: `mongodb://127.0.0.1/paraguero_server?directConnection=true`,
                    dbname: 'paraguero_server',
                },
            });

            const localfile_connector = new LocalFileSystemDuplexConnector({
                connection: {
                    path: './src/public/backup.tar',
                },
            });

            const transferer = new MongoTransferer({
                source: mongo_connector,
                targets: [localfile_connector],
            });

            for await (const { total, write } of transferer) {
                console.log(`remaining bytes to write: ${total - write}`);
            }

            res.send({ status: true })


        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }


    static async restore(req, res) {
        try {
            const mongo_connector = new MongoDBDuplexConnector({
                connection: {
                    uri: `mongodb://127.0.0.1/paraguero_server?directConnection=true`,
                    dbname: 'paraguero_server',
                },
            });

            const localfile_connector = new LocalFileSystemDuplexConnector({
                connection: {
                    path: './backup.tar',
                },
            });

            const transferer = new MongoTransferer({
                source: localfile_connector,
                targets: [mongo_connector],
            });

            for await (const { total, write } of transferer) {
                console.log(`remaining bytes to write: ${total - write}`);
            }
        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }
}