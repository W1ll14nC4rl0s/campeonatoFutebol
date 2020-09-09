const Hapi = require('@hapi/hapi')
const HapiSwagger = require('hapi-swagger')
// const Hapijwt = require('hapi-auth-jwt2')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')

const Context = require('./src/Db/Strategy/Base/ContextStrategy')
const Postgres = require('./src/Db/Postgres/Postgres')
const schemLogin = require('./src/Db/Postgres/schema/schemaLogin')

const MongoDb = require('./src/Db/MongoDb/MongoDb')
const schemaTimes = require('./src/Db/MongoDb/schema/schemaMongo')

const privateRoutes = require('./src/Routes/privateRoutes')
//const publicRoutes = require('./src/Routes/PublicRoutes')

function mapMethods(instance, methods) {
   
    return methods.map(metodo=>instance[metodo]())
}

const KEY = process.env.KEY 

const init = async ()=>{


    const conn = await Postgres.Connect()
    const connTimes = await MongoDb.Connect()

    const modelLogin = await Postgres.defineModel(conn, schemLogin)

    const DbPostgresLogin = new Context( new Postgres(conn, modelLogin))
    const DbMongo = new Context( new MongoDb(connTimes, schemaTimes))
    
   
    const Server = Hapi.Server({
        port: process.env.PORT || 6000    
    })

    const Swagger = {
        info:{
            title: 'Api de Usuários',
            version: 'v1.0'
        }
    }

    await Server.register([
        //Hapijwt,
        Inert,
        Vision,
        {
            
            plugin: HapiSwagger,
            options:Swagger
            
        }
    ])

    // Server.auth.strategy(
    //     'jwt',
    //     'jwt',
    //     {
    //       key: KEY,
    //       validate: async (dados, request)=>{
    //         //console.log('REQUEST', dados)
    //          const result = await DbPostgres.search({
    //             email : dados.email,
    //             id : dados.id
    //          })
    //         //console.log('RESULT', result)
    //         if(!result)return{isValid : false}

    //         return{
    //              isValid : true
    //         }
    //       }  
    //     }
    // )
    
    // Server.auth.default('jwt')

    await Server.start();

    Server.route([
        ...mapMethods(new privateRoutes(DbMongo), privateRoutes.methods()),
        //...mapMethods(new publicRoutes(DbPostgresLogin, KEY), publicRoutes.methods())
    ])
    
    console.log('Servidor está em execução', Server.info)

    return Server
  
}

process.on('unhandledRejeiction', (error)=>{
    console.log('Error', error)
    process.exit(1)
})

module.exports = init()