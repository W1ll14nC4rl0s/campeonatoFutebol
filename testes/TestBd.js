const assert = require('assert')
const Context = require('../src/Db/Strategy/Base/ContextStrategy')
const Postgres = require('../src/Db/Postgres/Postgres')
const schemaP = require('../src/Db/Postgres/schema/schemaLogin')

const MongoDb = require('../src/Db/MongoDb/MongoDb') 
const schemaM = require('../src/Db/MongoDb/schema/schemaMongo')

let DbPostgres = {}
let DbMongo = {}

const user = {
    name: 'Willian',
    username: 'willianCarlos',
    email:'willian@carlos',
    token:'123' 
}

const userUpdate = {
   ...user,
   username: 'willianLindo',
}

const championship = {
    Time: 'Santos',
    goals: 2,
    drew:1,
    Defeat:1,
    victories:0
} 

const championshipUpdate = {
    Time: 'São Paulo',
    goals: 3
} 
//mocha --timeout 10000 --exit ./testes/*Test.js
describe('Bd test suite', function(){
    this.beforeAll(async()=>{
        
        const ConnM  = MongoDb.Connect()
        
        const ConnP  = Postgres.Connect()
        const modelP = await Postgres.defineModel(ConnP, schemaP)
        //console.log('CONNECTION', ConnM)
        DbPostgres = new Context( new Postgres(ConnP, modelP))
        DbMongo = new Context( new MongoDb(ConnM, schemaM))
        
    })

    it('Connection Db Postgres', async () =>{
        const result = await DbPostgres.isConnect() 
        assert.ok(result, true)
    })

    it('Connection Db MongoDb', async ()=>{
        const result = await DbMongo.isConnect()
        
        assert.deepEqual(result, 'connected')
    })

    it('Insert data in Postgres', async()=>{
        const { dataValues } = await DbPostgres.create(user)
        delete dataValues.id
        assert.deepEqual(dataValues, user)
    })

    it('Insert data in MongoDb', async()=>{
        const {Defeat, Time, draw, goals } = await DbMongo.create(championship)

        assert.deepEqual({Defeat, Time, draw, goals } ,championship)
    })

    it('Get data in Postgres', async()=>{
        const [result] = await DbPostgres.search({username: user.username})
        delete result.id
        assert.deepEqual(result, user)
    })

    it('Get data in MongoDb', async () =>{
        const [{Defeat, Time, draw, goals }] = await DbMongo.search({Time: championship.Time})
        
        assert.deepEqual({Defeat, Time, draw, goals }, championship)
    })

    it('Update data in Postgres', async () =>{
        const [getUser] = await DbPostgres.search({ username: user.username })
       
        const [result] = await DbPostgres.update(getUser.id, userUpdate)
        assert.deepEqual(result, 1)
    })

    it('Update data in MongoDb', async () =>{
        const [{ _id }] = await DbMongo.search({ Time: championship.Time })

        const { nModified } = await DbMongo.update(_id, championshipUpdate)
        assert.deepEqual(nModified, 1)
    })

    it('Delete data in Postgres', async () =>{
        const [ { id } ] = await DbPostgres.search({ email : userUpdate.email })

        const result = await DbPostgres.delete(id)
        assert.deepEqual(result, 1)
    })

    it('Delete data in MongoDb', async () =>{
        const [ { _id } ] = await DbMongo.search({ Time: championshipUpdate.Time})

        const { deletedCount } = await DbMongo.delete(_id)
        assert.deepEqual(deletedCount, 1)
    })
})