const DataBase = require("./DataLayer/DBManager");
const _ = require('lodash');



class Order {

    constructor(id, supplierId, date, creatorEmployeeId) {
        this.id = id;
        this.date = date;
        this.creatorEmployeeId = creatorEmployeeId;
        this.recipientEmployeeId = null;
        this.supplierId = supplierId;
        this.productOrders = new Map();
    }

<<<<<<< HEAD
=======
    async initOrder(){
        return await DataBase.singleAdd('order', { id: this.id, date: this.date, creatorEmployeeId: this.creatorEmployeeId, supplierId: this.supplierId });
    }
>>>>>>> master

    async removeOrder(){
        await DataBase.remove('order', { id: this.id });
        for(let i in this.productOrders)
            this.productOrders[i].remove();
    }

    addProductOrder(id, productOrder) {
        this.productOrders.set(id, productOrder);
    }

    equals(toCompare) {
        return (
            toCompare.id === this.id &&
            toCompare.date.toISOString() === this.date.toISOString() &&
            toCompare.creatorEmployeeId === this.creatorEmployeeId &&
            toCompare.recipientEmployeeId === this.recipientEmployeeId &&
            toCompare.supplierId === this.supplierId &&
            _.isEqualWith(toCompare.productOrders, this.productOrders, function (val1, val2) {
                if (_.isFunction(val1) && _.isFunction(val2)) {
                    return val1.toString() === val2.toString();
                } 
            }));
    }
}
module.exports = Order;