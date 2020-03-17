const Sequelize = require('sequelize');
const mysql = require('mysql2');
const { userSchema, employeeSchema } = require("./Models");

class DataBase {

    static testModeOn() {
        this.isTestMode=true;
    }
    static testModeOff() {
        this.isTestMode=false;

    }
    
    static initDB(dbName) {
        if(this.isTestMode)
            return;
        try {
            this.isTestMode = false;
            this.sequelize = new Sequelize(dbName, 'root', 'admin', {
                host: 'localhost',
                dialect: 'mysql'
            });

            this.User = this.sequelize.define('user', userSchema(), {});
            this.Employee = this.sequelize.define('employee', employeeSchema(this.User), {});
            this.models = { user: this.User, employee: this.Employee };
        } catch (error) {
            console.log(error);
        }
        return this.sequelize;
    }

    static init() {
        if(this.isTestMode)
            return;
        this.initDB('mydb');
    }

    static async connectAndCreate() {
        if(this.isTestMode)
            return;
        try {
            const con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "admin"
            });

            await con.connect(async function (err) {
                if (err) throw err;
                console.log("Connected!");
            });
            await con.promise().query("CREATE DATABASE mydb");
            console.log("Database created");
        } catch (error) {
            console.log(error);
        }
    }

    async close() {
        if(this.isTestMode)
            return;
        try {
            await this.sequelize.close();
        } catch (error) {
            console.log(error);
        }
    }

    static add(modelName, element) {
        if(this.isTestMode)
            return;
        const model = this.models[modelName];
        return model.sync().then(() => {
            try {
                return this.sequelize.transaction((t) => {
                    return model.create(element, { transaction: t });
                })
                    .catch((error => console.log(error)));

            } catch (error) {
                console.log(error);
            }
        });
    }

    static getById(modelName, id) {
        if(this.isTestMode)
            return;
        const model = this.models[modelName];
        return model.sync().then(() => {
            try {
                return this.sequelize.transaction((t) => {
                    let res = model.findByPk(id, { transaction: t });
                    return res;
                })
                    .catch((error => console.log(error)));
            } catch (error) {
                console.log(error);
            }
        });
    }

    static update(modelName, id, element) {
        if(this.isTestMode)
            return;
        const model = this.models[modelName];
        return model.sync().then(() => {
            try {
                return this.sequelize.transaction((t) => {
                    return model.update(element, { where: { id: id }, transaction: t });
                })
                    .catch((error => console.log(error)));
            } catch (error) {
                console.log(error);
            }
        });
    }


};

module.exports = DataBase;