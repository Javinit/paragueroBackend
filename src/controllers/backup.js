import { config } from '../config/index.js'
import { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } from 'mongodb-snapshot';
import { mongoose } from 'mongoose'


let id = 0
export class backupController {
    static async getBackup(req, res) {
        try {

            const mongo_connector = new MongoDBDuplexConnector({
                connection: {
                    uri: config.DBURI,
                    dbname: 'paraguero_server',
                },
            });

            const localfile_connector = new LocalFileSystemDuplexConnector({
                connection: {
                    path: `./src/public/backup${id}.tar`,
                },
            });

            const transferer = new MongoTransferer({
                source: mongo_connector,
                targets: [localfile_connector],
            });

            for await (const { total, write } of transferer) {
                console.log(`remaining bytes to write: ${total - write}`);
            }

            await backupController.restore()

            res.send({ status: true })


        } catch (error) {
            console.log('ERROR: ', error);
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }


    static async restore() {
        try {

            const dataBaseBackup = await mongoose.createConnection(config.DBURIBACKUP);
            const collections = await dataBaseBackup.listCollections();

            await collections.forEach(async collection => {
                console.log(`Dropping ${collection.name}`);
                await dataBaseBackup.collection(collection.name).drop();
            });

            const mongo_connector = new MongoDBDuplexConnector({
                connection: {
                    uri: config.DBURI,
                    dbname: 'paraguero_backup',
                },
            });

            const localfile_connector = new LocalFileSystemDuplexConnector({
                connection: {
                    path: `./src/public/backup${id}.tar`,
                },
            });

            const transferer = new MongoTransferer({
                source: localfile_connector,
                targets: [mongo_connector],
            });

            for await (const { total, write } of transferer) {
                console.log(`remaining bytes to write: ${total - write}`);
            }

            dataBaseBackup.close()

            return 0
        } catch (error) {
            console.log('ERROR: ', error);
            if (error.message) throw ({ error: error.message })
            throw ({ error })
        }
    }
}