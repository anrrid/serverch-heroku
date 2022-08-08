/**
 * Required External Modules
 */
import 'dotenv/config'
import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { messageDao, usersDao } from "./src/daos/index.js"
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import config from "./src/utils/config.js";
import passport from "passport";
import { Strategy } from "passport-local";
import router from "./auth.js"
import cluster from 'cluster';
import * as os from 'os';

const clusterMode = process.argv[3] == 'CLUSTER';

if (clusterMode && cluster.isPrimary) {
    const CPUcores = os.cpus().length;
    console.log(`Primary cluster setting up ${CPUcores} workers`);

    for (let i = 0; i < CPUcores; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else{
    const app = express();
    const PORT = process.env.PORT || 8080;
    const httpServer = new HttpServer(app);
    const io = new IOServer(httpServer);
    const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }; 

    try {
        
        const LocalStrategy = Strategy;
        passport.use(new LocalStrategy(
            { usernameField: "email", passwordField: "password" },
            (email, password, done) => {
                usersDao.findById(email)
                    .then(user => {
                        if (!user) {
                            return done(null, false, { message: "Incorrect email." });
                        }
                        if (user.password !== password) {
                            return done(null, false, { message: "Incorrect password." });
                        }
                        return done(null, user);
                    })
                    .catch(err => done(err));
            }
        ));

        passport.serializeUser(function (user, done) {
            done(null, user);
        });
        
        passport.deserializeUser(function (user, done) {
            done(null, user);
        });
    } catch (error) {
        console.log(error);
    }

    app.use(session({
        store: MongoStore.create({ mongoUrl: config.mongodb.url, mongoOptions: advancedOptions }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: { maxAge: 60000 * 10 }
    }));

    /**
 *  App Configuration
 */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());

io.on("connection", async (socket) => {
    console.log("Usuario conectado con id: " + socket.id);

    socket.emit("messages", await messageDao.listarTabla());
    console.log(await messageDao.listarTabla());
    socket.on("new-message", async (message) => {

        await messageDao.insertarArticulo(message, "messages");
        socket.emit("messages", await messageDao.listarTabla());
    });
});

// Router mounting
app.use("/", router);

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor activado en el Puerto ${PORT}`);
});

server.on("error", (error) => {
    console.log(error);
});

}