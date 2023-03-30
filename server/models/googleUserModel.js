const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const googleUserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, required: true, unique: true },
    highscore: { type: Number, default: 0 },
});

const googleUser = mongoose.model("googleUser", googleUserSchema);
module.exports = googleUser;
