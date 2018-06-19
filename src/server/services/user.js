// Just as a mongoose
// reminder, .exec() on find
// returns a Promise instead
// of the default callback.

import User from '../models/User';

export function getUser(username) {
    return User.find({}).exec();
}
