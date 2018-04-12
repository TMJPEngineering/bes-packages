class Seeder {
    constructor (modelInstance) {
        this.model = modelInstance
    }

    async call (seederInstance) {
        console.log(`Seeding ${seederInstance.constructor.name}`)
        await seederInstance.run()
        console.log(`Seeded: ${seederInstance.constructor.name}`)
    }
}

module.exports = Seeder
