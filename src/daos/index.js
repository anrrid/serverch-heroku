import messageDaoMongodb from '../daos/messages/messajes.js';
import userDaoFirebase from '../daos/users/users.js';

export const usersDao = new userDaoFirebase;
export const messageDao = new messageDaoMongodb;

