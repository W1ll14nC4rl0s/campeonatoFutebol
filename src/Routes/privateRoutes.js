const Joi = require('joi')
const Boom = require('boom')
const Base = require('./base/BaseRoute')
const teamRanking = require('../util/teamRanking')
const Header = Joi.object({
    authorization: Joi.string().required()
}).unknown()
const failAction = (request, header, error)=>{
    throw error
}

class PrivateRoutes extends Base{
    constructor(Db){
        super()
        this._dataBase = Db
    }

    list(){
        return{
            path:'/championship',
            method:'GET',
            config:{
                description: 'Championship results consultation service',
                notes:'Service lists championship data by team name, if you want to see the classification inform ALL in the team field',
                tags : ['api'],
                validate:{
                    failAction,
                    query: Joi.object({
                        Time: Joi.string().required()
                    })
                }
            },handler: async request =>{
                try {
                   const { Time } = request.query
                   
                   return this._dataBase.search({Time})
                } catch (error) {
                    console.log('Get Request failed', error)
                    return Boom.internal()
                }
            }
        }
    }
    create(){
        return{
            path:'/championship',
            method: 'POST',
            config:{
                description: 'Consultation service',
                notes:'Player list consultation service',
                tags : ['api'],
                validate:{
                    failAction,
                    payload: Joi.object({
                        Time: Joi.string().required(),
                        goals:  Joi.number().integer().default(0),
                        drew:   Joi.number().integer().min(0).max(3).default(0),
                        Defeat: Joi.number().integer().min(0).max(3).default(0)
                    })
                }
            },
            handler: async request =>{
                try {
                    const { Time, goals, drew, Defeat } = request.payload
                    const victories =0
                    const balanceGoals =0
                    const result  = await this._dataBase.create({ Time, goals, drew, Defeat, victories, balanceGoals})
        
                    return {
                        message: `${result.Time} successfully included`
                    }
                } catch (error) {
                    console.log('POST Request failed', error)
                    return Boom.internal()
                }
            }
        }
    }
    update(){
        return{
            path:'/championship/{id}',
            method: 'PATCH',
            config:{
                validate:{
                    failAction,
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        Time:  Joi.string(),
                        goals: Joi.number().integer(),
                        draw:  Joi.number().integer(),
                        Defeat:Joi.number().integer()
                    })
                }
            },
            handler: async request =>{
                try {
                   const { params } = request
                    
                   const { payload } = request 

                   const aux = JSON.stringify(payload)
                   const resultPayload = JSON.parse(aux)
                   
                   const result = await this._dataBase.update(params.id , resultPayload)
                   
                   return{
                       message: `successfully changed`,
                       nModified: result.nModified
                   }

                } catch (error) {
                    console.log('PATCH Request failed', error)
                    return Boom.internal()
                }
            }
        }
    }
    delete(){
        return{
            method:'DELETE',
            path:'/championship/{id}',
            config:{
                validate:{
                    failAction,
                    params: Joi.object({
                        id: Joi.string().required()
                    })
                }
            },
            handler: async request =>{
                try {
                    const { id } = request.params
                    const result = await this._dataBase.delete(id)
                    return{
                        message:`${id} deleted`
                    }
                } catch (error) {
                    console.log('DELETE Request failed', error)
                    return Boom.internal()
                }
            }
        }
    }deleteAll(){
        return{
            method:'DELETE',
            path:'/championship/deleteAll/{authorization}',
            config:{
                validate:{
                    failAction,
                    params: Joi.object({
                        authorization: Joi.boolean().required()
                    })
                },
                handler: async request =>{
                    try {
                        const { params } = request

                        if(params.authorization){
                            
                            const result = await this._dataBase.deleteAll()
                            
                            return{
                                message:'all data has been deleted'
                            }
                        } 
                    } catch (error) {
                        console.log('DELETE ALL Request failed', error)
                        return Boom.internal()
                    }
                }
            }
        }
    }
    getChampionship(){
        return{
            method:'GET',
            path:'/championship/classification/',
            config:{
                validate:{
                    failAction,
                }
            },
            handler: async request => {
                
                const Ligue =  await this._dataBase.search()
                
                const matches = teamRanking.generator(Ligue)
                const aux = JSON.stringify(matches)
                const dados = JSON.parse(aux)
                const result = teamRanking.TrateResult(dados)
                //console.log(matches)
                return {
                    body: Ligue
                }
                
            }
        }
    }

}

module.exports = PrivateRoutes