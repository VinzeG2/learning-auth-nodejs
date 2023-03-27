const UserModel = require("./User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const express = require('express')

const validateJwt = expressJwt.expressjwt({ secret: process.env.SECRET, algorithms: ['HS256'] })

const findAndAssignUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.auth._id)
        if (!user) {
            return res.status(401).end()
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

const isAuthenticated = express.Router().use(validateJwt,findAndAssignUser)

const signToken = (_id) => jwt.sign({ _id }, process.env.SECRET)

const Auth = {
    login: async (req, res) => {
        const { body } = req
        try {
            const user = await UserModel.findOne({username: body.username})
            if (!user) {
                return res.status(401).send('Wrong username or password.')
            } else {
                const isMatch = await bcrypt.compare(body.password, user.password)
                if (isMatch) {
                    const signed = signToken(user._id)
                    res.status(200).send(signed)
                } else {
                    return res.status(401).send('Wrong username or password.')
                }
            }
        } catch (error) {
            res.send(error.message)
        }
    },
    register: async (req, res) => {
        const { body } = req
        try {
            const alreadyExist = await UserModel.findOne({username: body.username})
            if (alreadyExist) {
                return res.send("User already exist.")
            } else {
                const salt = await bcrypt.genSalt()
                const hashed = await bcrypt.hash(body.password, salt)
                const user = await UserModel.create({username: body.username, password: hashed, salt: salt})
                const signed = signToken(user._id)
                res.send(signed)
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
}

module.exports = { Auth, isAuthenticated }