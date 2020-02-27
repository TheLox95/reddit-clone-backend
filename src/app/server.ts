import mongoose from 'mongoose';
import express from 'express';
import { server } from '../graphql/Graphql';

export default class Server {
    private app = express()

    private preStart(): Promise<unknown> {
        const dbName = process.env.NODE_ENV === 'test' ? 'reddit-clone-test' : 'reddit-clone';
        const opts: mongoose.ConnectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        };
        return mongoose.connect(`mongodb://localhost:27017/${dbName}`, opts);
    }

    start(): Promise<unknown> {
        server.applyMiddleware({ app: this.app, path: '/graphql' });

        return this.preStart()
            .then(() => {
                this.app.listen(process.env.PORT || 4000, () => {
                    console.log(`listening on port ${process.env.PORT || 4000}`);
                });
            })
            .catch((err) => {
                console.log(err.toString());
                process.exit();
            });
    }
}