const SpellModel = require('./Spell')

const Spell = {
    listAll: async (req, res) => {
        const spells = await SpellModel.find()
        res.status(200).send(spells)
    },
    get: async (req, res) => {
        const { id } = req.params
        const spell = await SpellModel.findOne({ _id: id })
        res.status(200).send(spell)
    },
    create: async (req, res) => {
        const { body } = req
        console.log({body});
        const spell = new SpellModel(req.body)
        const savedSpell = await spell.save()
        res.status(201).send(savedSpell._id)
    },
    delete: async (req, res) => {
        const { id } = req.params
        await SpellModel.deleteOne({ _id: id })
        res.status(204)
    }
}

module.exports = Spell