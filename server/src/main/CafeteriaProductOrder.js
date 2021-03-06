const DataBase = require("./DataLayer/DBManager");
const ProductOrder = require("./ProductOrder");

class CafeteriaProductOrder extends ProductOrder {
    constructor(product, order, quantity) {
        super(order, quantity);
        this.product = product;
    }

    getOrderRemovingObject = () => ({
        name: DataBase._remove,
        model: "cafeteria_product_order",
        params: { where: { orderId: this.order.id } },
    });

    getProductOrderRemove = () => ({
        name: DataBase._remove,
        model: "cafeteria_product_order",
        params: {
            where: {
                orderId: this.order.id,
                productId: this.product.id,
            }
        },
    });


    remove() {
        this.product.removeOrder(this.order.id);
    }

    editCafeteriaProductOrder(actualQuantity) {
        this.actualQuantity = actualQuantity;
    }

    editCafeteriaProductOrderExpected(expectedQuantity) {
        this.expectedQuantity = expectedQuantity;
    }
    /**
     * Confirms the order and puts the quantity in stock
     * @param {string} addedQuantity The actual inventory that came in the order.
     * @returns {Array[object,object]} The action that the DB need to do for update the order
     **/
    getConfirmOrderDB(addedQuantity) {
        let orderAction = {
            name: DataBase._update,
            model: "cafeteria_product_order",
            params: {
                where: {
                    orderId: this.order.id,
                    productId: this.product.id,
                },
                element: {
                    actualQuantity: parseInt(addedQuantity),
                },
            },
        };
        return [orderAction, this.product.getConfirmOrderDB(addedQuantity)];
    }
    /**
     * Confirms the order and puts the quantity in stock
     * @param {string} addedQuantity The actual inventory that came in the order.
     * @returns {boolean} true for the updated success.
     **/
    confirmOrder(addedQuantity) {
        this.product.confirmOrder(addedQuantity);
        this.actualQuantity = addedQuantity;
        return true;
    }

    equals(toCompare) {
        return (
            toCompare.actualQuantity === this.actualQuantity &&
            toCompare.expectedQuantity === this.expectedQuantity &&
            toCompare.order.equals(this.order) &&
            toCompare.product.equals(this.product)
        );
    }
}
module.exports = CafeteriaProductOrder;