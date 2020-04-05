const DB = require("../../../server/src/main/DBManager");
const CafeteriaProduct = require("../../../server/src/main/CafeteriaProduct");
const CafeteriaProductOrder = require("../../../server/src/main/CafeteriaProductOrder");
const Order = require("../../../server/src/main/Order");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const InventoryManagement = require("../../../server/src/main/InventoryManagement");
const { validate , testCinemaFunctions } = require("./MovieOperationsTests.spec")




describe("CafeteriaProductOrder Operations Tests", () => {

    beforeAll(() => {
        DB.testModeOn();
    });


    it('UnitTest addCafeteriaOrder  - Service Layer', () => {
        let serviceLayer = new ServiceLayer();
        //Input validation
        validate(serviceLayer, serviceLayer.addCafeteriaOrder, { 'Order ID ': 'Order', 'Date ': 'date','Supplier Name ':'Supplier','Products List ':'[{"name":"Product","quantity":"3"}]', 'Username ': 'User' })
        
        serviceLayer.orders.set("Order", 1);
        let result = serviceLayer.addCafeteriaOrder('Order','date','Supplier', '[{"name":"Product","quantity":"3"}]', 'User');
        expect(result).toBe("The order already exist");
        serviceLayer.orders=new Map();
        result = serviceLayer.addCafeteriaOrder('Order','date','Supplier', '[{"name":"Product","quantity":"3"}]', 'User');
        expect(result).toBe("The supplier does not exist");
        serviceLayer.suppliers.set("Supplier", 1);
        result = serviceLayer.addCafeteriaOrder('Order','date','Supplier', '[{"name":"Product","quantity":"3"}]', 'User');
        expect(result).toBe("Product does not exist");
        serviceLayer.products.set("Product", 1);
        result = serviceLayer.addCafeteriaOrder('Order','date','Supplier', '[{"name":"Product","quantity":"3"}]', 'User');
        expect(result).toBe("The user performing the operation does not exist in the system");
    });


    it('UnitTest addCafeteriaOrder - Cinema System', () => {
        let cinemaSystem = new CinemaSystem();
        testCinemaFunctions(cinemaSystem, () => cinemaSystem.addCafeteriaOrder(1,'',1,[{"id":1,"quantity":3}],1));
    });



    it('UnitTest addCafeteriaOrder - Inventory Management', () => {
        let inventoryManagement = new InventoryManagement();
        let todayDate = new Date();
        inventoryManagement.orders.set(1, null);
        let result = inventoryManagement.addCafeteriaOrder(1);
        expect(result).toBe("This order already exists");
        inventoryManagement.orders = new Map();
        result = inventoryManagement.addCafeteriaOrder(1,'test', 1);
        expect(result).toBe("The supplier does not exist");
        inventoryManagement.suppliers.set(1, null);
        result = inventoryManagement.addCafeteriaOrder(1,'test',1,[{"id":1,"quantity":3}]);
        expect(result).toBe("Product does not exist");
        let product = new CafeteriaProduct(1);
        inventoryManagement.products.set(1, product);
        result = inventoryManagement.addCafeteriaOrder(1,'test',1,[{"id":1,"quantity":3}]);
        expect(result).toBe("The order date is invalid");
        result = inventoryManagement.addCafeteriaOrder(1,todayDate.toISOString(),1,[{"id":1,"quantity":3}],1);
        expect(result).toBe("The order added successfully");
        let actualOrder = inventoryManagement.orders.get(1);
        let expectedOrder = new Order(1,1,todayDate,1);
        let expectedProduct = new CafeteriaProduct(1);
        let expectedCafeteriaProductOrder = new CafeteriaProductOrder(expectedProduct,expectedOrder,3);
        expectedProduct.productOrders.set(1,expectedCafeteriaProductOrder);
        expectedOrder.productOrders.set(1,expectedCafeteriaProductOrder);
        expect(expectedOrder.equals(actualOrder)).toBe(true);

    });



    it('Integration addCafeteriaOrder', () => {
        let serviceLayer = new ServiceLayer();
        let todayDate = new Date();
        serviceLayer.users.set("User", 1);
        serviceLayer.suppliers.set("Supplier", 1);
        serviceLayer.products.set("Product", 1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.addCafeteriaOrder('Order','date','Supplier', '[{"name":"Product","quantity":"3"}]', 'User'));
        let user = { isLoggedin: () => true, permissionCheck: () => true }
        serviceLayer.cinemaSystem.users.set(1, user);


        serviceLayer.cinemaSystem.inventoryManagement.orders.set(1, null);
        let result = serviceLayer.addCafeteriaOrder('Order','date','Supplier', '[{"name":"Product","quantity":"3"}]', 'User');
        expect(result).toBe("This order already exists");
        serviceLayer.cinemaSystem.inventoryManagement.orders = new Map();
        result = serviceLayer.addCafeteriaOrder('Order','date','Supplier', '[{"name":"Product","quantity":"3"}]', 'User');
        expect(result).toBe("The supplier does not exist");
        serviceLayer.cinemaSystem.inventoryManagement.suppliers.set(1, null);
        result = serviceLayer.addCafeteriaOrder('Order','date','Supplier', '[{"name":"Product","quantity":"3"}]', 'User');
        expect(result).toBe("Product does not exist");
        let product = new CafeteriaProduct(1);
        serviceLayer.cinemaSystem.inventoryManagement.products.set(1,product);
        result = serviceLayer.addCafeteriaOrder('Order','date','Supplier', '[{"name":"Product","quantity":"3"}]', 'User');
        expect(result).toBe("The order date is invalid");
        result = serviceLayer.addCafeteriaOrder('Order',todayDate.toISOString(),'Supplier', '[{"name":"Product","quantity":"3"}]', 'User');
        expect(result).toBe("The order added successfully");
        let actualOrder = serviceLayer.cinemaSystem.inventoryManagement.orders.get(1);
        let expectedOrder = new Order(1,1,todayDate,1);
        let expectedProduct = new CafeteriaProduct(1);
        let expectedCafeteriaProductOrder = new CafeteriaProductOrder(expectedProduct,expectedOrder,3);
        expectedProduct.productOrders.set(1,expectedCafeteriaProductOrder);
        expectedOrder.productOrders.set(1,expectedCafeteriaProductOrder);
        expect(expectedOrder.equals(actualOrder)).toBe(true);

    });





});



