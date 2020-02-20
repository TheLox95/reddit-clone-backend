import * as mongoose from 'mongoose';
import * as express from 'express';
import { server } from './Graphql';

export default class Server {
    private app = express()

    private preStart(): Promise<unknown> {
        const dbName = process.env.NODE_ENV === 'test' ? 'reddit-clone-test' : 'reddit-clone';
        return mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    }

    start(): Promise<unknown> {
        server.applyMiddleware({ app: this.app, path: '/graphql' });

        return this.preStart()
            .then(() => {
                this.app.listen(process.env.PORT || 3000, () => {
                    console.log(`listening on port ${process.env.PORT || 3000}`);
                });
            })
            .catch((err) => {
                console.log(err.toString());
                process.exit();
            });
    }
}