import admin from 'firebase-admin'
import config from '../utils/config.js'

const privateKey = config.firebase.privateKey

try {
    admin.initializeApp({
        credential: admin.credential.cert(privateKey)
    })
} catch (error) {
    console.log(error)
} finally {
    console.log('Se inicializó Firebase')
}
const db = admin.firestore()

class firebaseContainer {
    constructor(collectionName) {
        this.collection = db.collection(collectionName)
    }

    async listAll() {
        try {
            const listAll = await this.collection.get()
            let docs = listAll.docs

            const response = docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })
            return response

        } catch (error) {
            console.log(error)
        }
    }

    async findById(id) {
        try {
            const findById = await this.collection.doc(id).get()
            return findById.data()
        } catch (error) {
            console.log(error)
        }
    }

    async listOne(id) {
        try {
            const listOne = await this.collection.doc(id).get()
            return listOne.data()
        } catch (error) {
            console.log(error)
        }
    }

    async insertOne(data, id) {
        try {
            const insertOne = await this.collection.doc(id).set(data)
            return insertOne
        } catch (error) {
            console.log(error)
        }
    }

    async updateOne(id, data) {
        try {
            const update = await this.collection.doc(id).update(data)
            return update
        } catch (error) {
            console.log(error)
        }
    }

    async deleteOne(id) {
        try {
            const deleteOne = await this.collection.doc(id).delete()
            return deleteOne
        } catch (error) {
            console.log(error)
        }
    }
}

export default firebaseContainer;


