const UserModel = require("./User")
const bcrypt = require('bcrypt')


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
                    const signed = jsonwt
                }
            }
        } catch (error) {
            
        }
    },
    register: () => {},
}