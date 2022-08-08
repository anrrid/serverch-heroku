# DESAFIO SERVIDOR CON BALANCE DE CARGA 

## A fin de iniciar el servidor, ingresar el siguiente comando:  
```
npm run start
```

## Instalar dependencias

·Instalar las dependencias:
```
npm i ejs express knex mysql nodemon socket.io sqlite3 connect-mongo cookie-parser firebase firebase-admin jsonwebtoken mongoose normalizr passport passport-local router dotenv
```

## CLUSTER / FORK
A fin de iniciar servidor en modo cluster o fork usar SCRIPT en package.json:
"start-cluster"
"start-fork"
## FOREVER
Instalar 
```
npm i -g forever
```
Ejecutar SCRIPT en package.json:
"start-forever"

## PM2
Instalar 
```
npm i -g pm2
```
## PM2 (CLUSTER)
```sh
pm2 start server.js --name="Server2" --watch -i max -- [PUERTO]
```
## PM2 (FORK)

```sh
pm2 start server.js --name="Server2" --watch -- [PUERTO]
```
# LISTAR APP QUE SE EJECUTAN CON PM2
```
$ pm2 list
```