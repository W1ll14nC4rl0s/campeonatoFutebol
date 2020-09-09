const Sequelize = require('sequelize');
const Crud = require('../Strategy/Interface/InterfaceCrud');

class Postgres extends Crud{
    
    constructor(conn, schema){
        super();
        this._connection = conn;
        this._model = schema;
    }

    static Connect(){
        return new Sequelize(
        'postgres://admin:admin@localhost/user',//process.env.POSTGRES_URL,
        {   
            host: 'localhost',
            dialect:'postgres',
            quoteIdentifiers: false,
            operatorsAliases: 0,
            logging: false,
            
        })
    }

    async isConnect(){
        try {
            
            await this._connection.authenticate()
            return true
        } catch (error) {
            console.log('Falha ao validar a conexão', error)
            return false
        }
    }

    static async defineModel(conn, structSchema){
        const model = conn.define(
            structSchema.nome,
            structSchema.schema,
            structSchema.options
        )

        await model.sync()

        return model;
    }

    create(item){
        return this._model.create(item)
    }

    search(query={}, limite=0, skip=0){
      
        if(!limite && !skip){
            return this._model.findAll(
            {
                where: query,
                raw:true
            })
        
        }else if (limite && skip){
            return this._model.findAll(
                {
                    where: query,
                    raw: true,
                    limit: limite,
                    offset: skip
                }
              
            ) 
        }else if(limite){
            
            return this._model.findAll(
                {
                    where: query,
                    raw: true,
                    limit: limite
                }
        
            )
        
        }else if (skip){
            
            return this._model.findAll(
                {
                    where: query,
                    raw: true,
                    offset: skip
                }
            ) 
        }
        
    }

    delete(id){
        const query = id ? {id} : {}
        return this._model.destroy({where:query})
    }

    

    async update(id, item){
        
        return this._model.update(item,{where: {id}})
    }
}

module.exports = Postgres