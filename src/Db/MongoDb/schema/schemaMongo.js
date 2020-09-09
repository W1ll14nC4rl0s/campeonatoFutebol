const Mongoose = require('mongoose')


const Schema = new Mongoose.Schema({
    Time:{
        type:String,
        required:true
    },
    victories:{
        type:Number,
        required:false 
    },
    balanceGoals:{
        type:Number,
        required:false 
    },
    drew:{
        type:Number,
        required:true
    },
    Defeat:{
        type:Number,
        required:true
    },
    insertedAt:{
        type:String,
        default: new Date().toISOString()
    }
})

module.exports = Mongoose.model('modelTournament', Schema)