function Seeder (modelInstance) {
    if (!(this instanceof Seeder))
        return new Seeder(modelInstance);

    this.model = modelInstance;
}

Seeder.prototype = {
    call: async function (seederInstance) {
        console.log('Seeding:', seederInstance.constructor.name)
        await seederInstance.run()
        console.log('Seeded:', seederInstance.constructor.name)
    }
}

module.exports = Seeder
