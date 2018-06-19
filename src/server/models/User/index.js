import { validateUsername } from './validate';

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        validate: [{ validator: validateUsername, msg: 'Invalid username' }],
    },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

export default User;
