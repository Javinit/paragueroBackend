import User from "../models/user.js";
import { generateHash, verifyPassword } from "../utils/bcrypt.js";
import { createJWT, verifyJWT } from "../utils/jwt.js";

export class usersController {
    static async login(req, res) {
        try {
            const { userEmail, password } = req.body
            console.log('REQ BODY', req.body);

            if (!userEmail || !password) return res.status(400).json({ error: `Completa todos los campos` })

            const user = await User.findOne({ userEmail: userEmail })

            if (!user) return res.status(400).json({ error: `No existe una cuenta con el email ${userEmail}` })

            if (!await verifyPassword(password, user.userPassword)) return res.status(400).json({ error: `Contraseña Incorrecta` })

            const initToken = await createJWT({ userName: user.userName, userEmail: user.userEmail })

            return res.send({ token: initToken, username: user.userName, userEmail: user.userEmail })
        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }

    static async createUser(req, res) {
        try {
            const { userName, password, userEmail } = req.body
            if (!userName || !password || !userEmail) return res.status(400).json({ error: 'Completa todos los campos' })

            const newHashPassword = await generateHash(password)

            // Realizar validaciones para username and password

            const newUser = new User({ userName: userName, userPassword: newHashPassword, userEmail: userEmail, userLevel: 2 })
            await newUser.save()

            const initToken = await createJWT({ userName: newUser.userName, userEmail: newUser.userEmail })
            return res.status(202).json({ token: initToken, userName: newUser.userName, userEmail: newUser.userEmail })

        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }

    static async verifyToken(req, res) {
        try {
            const { authorization } = req.headers
            if (!authorization) return res.json({ status: false })

            const infoUser = await verifyJWT(authorization)
            if (!infoUser || !infoUser.userEmail) return res.json({ status: false })

            const user = await User.findOne({ userEmail: infoUser.userEmail })
            if (!user) return res.json({ status: false })

            return res.json({ status: true })

        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }
}