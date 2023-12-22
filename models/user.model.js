const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 18
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    user.password = bcrypt.hashSync(user.password, 10);
    next();
});

UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };
