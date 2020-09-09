const Sequelize = require('sequelize')

const LoginModel = {
    name: 'SchemaLogin',
    schema:{
        id:{
            type:Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },   
        name:{
            type:Sequelize.STRING,
            required: true
        },
        username:{
            type:Sequelize.STRING,
            required:true
        },
        email:{
            type:Sequelize.STRING,
            required:true
        },
        token:{
            type:Sequelize.STRING,
            required:true
        }
    },
    options:{
        tableName:'tb_login',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = LoginModel