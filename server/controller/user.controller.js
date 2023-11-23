const userModel = require('../model/user_model');
const bcrypt = require('bcrypt');
const Express = require('express');

module.exports = {
    /**
     * creates new user account
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    async registerUser(req, res) {
        try {
            let { name, email, password, confirm_password } = req.body;
            if (!name || !email || !password || !confirm_password)
                throw "All fields needed!"
            if (password != confirm_password)
                throw "Passwords miss-match"

            password = await bcrypt.hash(password, 10)

            const user = new userModel({ name, email, password });
            await user.save();
            return res.status(201).json({ message: "Successfully registered the user!" })

        } catch (e) {
            return res.status(500).json({ message: "Failed to register user!", err: e })
        }
    },

    /**
     * login into account
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    async login(req, res) {
        try {
            let { email, password } = req.body;
            if (!email || !password)
                throw "All fields needed!"

            const user = await userModel.findOne({ email });
            if (!user) {
                throw "User not found!";
            }

            const isSamePassword = await bcrypt.compare(password, user.password);
            if (!isSamePassword)
                throw "Wrong credentials!"

            res.status(200).json({
                message: "Successfully logged in!",
                name: user.name
            })

        } catch (e) {
            return res.status(500).json({ message: "Failed to login!", err: e.toString() })
        }
    }
}