const DataBase = require("./DBManager");


class ReportController {


    static async init() {
        await DataBase.setDestroyTimer('general_purpose_daily_report', true, '1 YEAR', '1 DAY');
        await DataBase.setDestroyTimer('inventory_daily_report', true, '1 YEAR', '1 DAY');
        await DataBase.setDestroyTimer('movie_daily_report', true, '1 YEAR', '1 DAY');
        await DataBase.setDestroyTimer('incomes_daily_report', true, '1 YEAR', '1 DAY');
    }


    static async createDailyReport(type, records) {
        //validate type from enum of types
        for(let i in records){
            let result = await DataBase.add(type, records[i]);
            if(result == 'error'){
                return "The report can not be created"
            }
        }
        return "The report created successfully";
    
    }


    static async getReport(report, date) {
        return DataBase.getById(report, { date: date }).then((result) => {
            if (result == null)
                return "The report does not exist"
            return result;
        });
    }

    static exportMonthlyHoursReportPerEmployee(date, employeeToSearchID, employeeId) { }
    static exportDailyIncome(date) { }
    static exportDailyMovieReport(date) { }
    static exportDailyGeneralReport(date) { }
    static exportDailyReport(date) { }


    //general purpose fields - just from the list additionalProps[0] 
    static getDailyReoprtFormat() { }


    //TODO:: return msg of success/failure

    static async addFieldToDailyReport(newField) {
        await DataBase.findAll('general_purpose_daily_report', {}, { fn: 'max', fnField: 'date', fields: ['additionalProps'] })
            .then(async (result) => {
                //TODO:: return msg??
                /*
                if (result.length === 0) {
                    let date = new Date().toISOString().substring(0, 10);
                    await DataBase.add('general_purpose_daily_report', { date: new Date(date), additionalProps: [[newField], {}], creatorEmployeeId: null });
                }
                else {
                    */
                result[0].additionalProps[0] = result[0].additionalProps[0].concat(newField);
                try {
                    await DataBase.update('general_purpose_daily_report', { date: result[0].date }, { additionalProps: result[0].additionalProps });
                    console.log()

                } catch (e) {
                    console.log()

                }

                // }
            });

    }

    static async removeFieldFromDailyReport(fieldToRemove) {
        await DataBase.findAll('general_purpose_daily_report', {}, { fn: 'max', field: 'date' }).then(async (result) => {
            if (result.length !== 0) {
                let date = result[0].date;
                let newProps = result[0].additionalProps[0].filter((value) => (value === fieldToRemove));
                await DataBase.update('general_purpose_daily_report', { date: date }, newProps);
            }
        });

    }


}
module.exports = ReportController;
exports.DataBase = DataBase;