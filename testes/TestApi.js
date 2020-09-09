const assert = require('assert')
const api = require('../api')

let app = {} 
const championship = {
    Time: 'Santos',
    drew:1,
    Defeat:0
}
const update = {
    Time: 'Santos'
}

describe('Api test Suite', function(){
    this.beforeAll( async ()=>{
        
        app = await api

    })

    it('Get championship', async ()=>{
        const NAME='Santos'
        const { statusCode, payload }  = await app.inject({
            method:'GET',
            url: `/championship?Time=${NAME}`
        })
        const result = JSON.parse(payload)
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(result))
        
    })

    it('POST championship', async () => {
        const { statusCode, payload } = await app.inject({
            method:'POST',
            url:'/championship',
            payload:championship
        })
        const result = JSON.parse(payload)
        console.log(result)
        assert.deepEqual(statusCode, 200)
        assert.deepEqual(result.message, `${championship.Time} successfully included`)
    })

    it('PATCH championship', async () =>{
        const { payload } = await app.inject({
            method: 'GET',
            url: `/championship?Time=${championship.Time}`
            
        })
        const [ getId ] = JSON.parse(payload)
       
        const result = await app.inject({
            method:'PATCH',
            url:`/championship/${getId._id}`,
            payload: JSON.stringify(update)
        })
        
        const resultTreated= JSON.parse(result.payload)
        
        assert.deepEqual(resultTreated.message, `successfully changed`)
        assert.deepEqual(resultTreated.nModified, 1)
        assert.deepEqual(result.statusCode, 200)
    })

    it('DELETE championship', async () =>{
        const { payload } = await app.inject({
            method:'GET',
            url:`/championship?Time=${update.Time}`
            
        })
        const [ getId ] = JSON.parse(payload) 

        const result = await app.inject({
            method:'DELETE',
            url:`/championship/${getId._id}`
        })
        const valid = JSON.parse(result.payload)
        assert.deepEqual(valid.message, `${getId._id} deleted`)
        assert.deepEqual(result.statusCode, 200)
    })
    it.only('Team Ranking', async () =>{
        const result = await app.inject({
            method:'GET',
            url: '/championship/classification/'
        })
       
    })
    it('DELETE ALL championship', async () =>{

        const result = await app.inject({
            method:'DELETE',
            url:`/championship/deleteAll/true`
        })
        assert.deepEqual(result.statusCode, 200)
        
    })
})