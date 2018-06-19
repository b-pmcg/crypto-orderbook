import { serviceFunction } from service / user.js

export async function getUser(username) {
    const user = await findUserByUsername();
    const chat = await getChat(user);
    const somethingElse = doSomethingElse(chat);
    return somethingElse;
}

// import User from '../models/User';
// import { getUser as getUserService } from '../services/user';

// function getUser(req, res, next) {
//     const username = req.params.username;
//     if (username === '') {
//         return res.status(500).json({ error: 'Username can\'t be blank' });
//     }
//     try {
//         const user = await User.find({ username }).exec();
//         return res.status(200).json(user);
//     } catch (error) {
//         return res.status(500).json(error);
//     }
// }

// socket.on('RequestUser', (data, ack) => {
//     const username = data.username;
//     if (username === '') {
//         ack({ error: 'Username can\'t be blank' });
//     }
//     try {
//         const user = User.find({ username }).exec();
//         return ack(user);
//     } catch (error) {
//         return ack(error);
//     }
// });
