// auth.js

/**
 * Required External Modules
 */
 import express from "express";
 import { usersDao } from "./src/daos/index.js"
 import path from 'path';
 import { fileURLToPath } from 'url';
 import passport from "passport";
 import { fork } from "child_process";
 import * as os from 'os';

//CONST
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);
 const router = express.Router();
 const CPUcores = os.cpus().length;
 
/**
 * Routes Definitions
 */

 router.get('/', (req, res) => {
    res.redirect('/login')
});

router.get('/login-error', (req, res) => {
    res.sendFile(__dirname + "/views/login-error.html");
});


router.get("/login", (req, res) => {
    res.sendFile(__dirname + "/views/login.html");
    req.isAuthenticated() ? res.redirect('/home') : console.log("No esta autenticado");
});

router.get("/register", (req, res) => {
    res.sendFile(__dirname + "/views/register.html");
});

router.post("/register", (req, res) => {
    const userData = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    }
    const id = req.body.email;

    id ? usersDao.findById(id).then(user => {
        if (user) {
            res.sendFile(__dirname + "/views/register-error.html");
        } else {
            usersDao.insertOne(userData, id).then(() => {
                console.log("Usuario creado");
                res.redirect("/login");
            });
        }
    }) : res.sendFile(__dirname + "/views/register-error.html");

});

router.get("/home", (req, res) => {
    if (req.isAuthenticated()) {
        res.render(__dirname + "/views/index.ejs", {
            name: req.user.displayName ? req.user.displayName : req.user.name,
            photo: req.user.photos ? req.user.photos[0].value : "https://fotos.perfil.com/2021/06/18/trim/900/900/sebastian-sosa-1192599.jpg",
            email: req.user.emails ? req.user.emails[0].value : req.user.email
        });
    } else {
        res.redirect("/login");
    }
});

router.post("/login", passport.authenticate('local',
    { successRedirect: '/home', failureRedirect: '/login-error' }),
);



router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

router.get("/info", (req, res) => {
    res.json({
        'Node version': process.version,
        'Operating system': process.platform,
        'Execution path': process.execPath,
        'Process id': process.pid,
        'Run file': process.cwd(),
        'Total reserved memory (rss)': process.memoryUsage().rss,
        'Input argument': process.argv,
        'Information about CPU cores': CPUcores,
    });
});

router.get("/api/randoms", async (req, res) => {
    const amount = req.query.cant || 100000000;
    const counter = fork(__dirname + "/src/utils/randomNumbers.js");
    counter.send(amount);
    counter.on("message", (numbers) => {
        res.json(numbers);
    })
})




/**
 * Module Exports
 */

 export default router;