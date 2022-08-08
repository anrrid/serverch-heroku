import mongodbContainer from '../../container/mongodbContainer.js'

class messageDaoMongodb extends mongodbContainer {
    constructor() {
        super('messages', {
            author: {
                id: String,
                name: String,
                surname: String,
                age: Number,
                alias: String,
                avatar: String
            },
            text: String,
            date: String
        }, { versionKey: false });
    }
}

export default messageDaoMongodb;