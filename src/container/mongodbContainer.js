import config from "../utils/config.js";
import mongoose from "mongoose";
import { schema, normalize } from "normalizr";

const URL = config.mongodb.url;

mongoose.connect(URL)

class Modelo {

    constructor(collectionName, schema) {
        this.collection = mongoose.model(collectionName, schema);
    }

    async insertarArticulo(data) {
        try {
            const insert = await this.collection.create(data);
            return insert;
        }
        catch (error) {
            console.log(error);
        }
    }

    async listarTabla() {
        try {
            const list = await this.collection.find();
            const data = {
                id: 'mensajes',
                mensajes: list
            }

            const author = new schema.Entity("author", {}, { idAttribute: "email" });
            const post = new schema.Entity("post", { author: author }, { idAttribute: "id" });
            const posts = new schema.Entity("posts", { posts: [post] }, { idAttribute: "id" });
            const normalizedData = normalize(data, posts);

            return normalizedData
        }

        catch (error) {
            console.log(error);
        }
    }

    async
}

export default Modelo;

