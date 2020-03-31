const CinemaSystem = require("./CinemaSystem");
const logger = require('simple-node-logger').createSimpleLogger('project.log');

class ServiceLayer {
    constructor() {
        this.cinemaSystem = new CinemaSystem();
        this.users = new Map();
        this.users.set("admin", 0);
        this.userCounter = 3;
        this.movies = new Map();
        this.movies.set("movie", 0);
        this.movieCounter = 1;
        this.suppliers = new Map();
        // just for example purposes
        this.suppliers.set("supplier", 0);
        this.supplierCounter = 1;
        this.products = new Map();
        this.products.set("product", 0);
        this.productsCounter = 1;
        this.categories = new Map();
        this.categories.set("category", 0);
        this.categoriesCounter = 1;
        this.orders = new Map();
        this.orders.set("order", 0);
        this.ordersCounter = 1;
    }

    register(userName, password) {
        if (this.users.has(userName)) {
            logger.info('ServiceLayer - The registration process failed - the ' + userName + ' exists on the system.')
            return "The user already Exist";
        } else {
            const result = this.cinemaSystem.register(this.userCounter, userName, password, 'EMPLOYEE');
            if (result === "The user registered successfully.") {
                this.users.set(userName, this.userCounter);
                this.userCounter++;
            }
            return result;
        }
    }

    login(userName, password) {
        if (this.users.has(userName)) {
            return this.cinemaSystem.login(userName, password, this.users.get(userName));
        }
        logger.info('ServiceLayer - The login process failed - the ' + userName + ' isn\'t exists on the system.');
        return "Incorrect user name.";
    }

    logout(userName) {
        if (this.users.has(userName)) {
            return this.cinemaSystem.logout(this.users.get(userName));
        }
        logger.info('ServiceLayer - The logout process failed - the ' + userName + ' isn\'t exists on the system.');
        return "Incorrect user name.";
    }

    printallUser() {
        this.users.forEach((value, key, map) => {
            console.log(`m[${key}] = ${value}`);
        });
    }
    addNewEmployee(userName, password, firstName, lastName, permissions, contactDetails, ActionIDofTheOperation) {
        if (this.users.has(userName)) {
            logger.info('ServiceLayer - The addNewEmployee process failed - the ' + userName + ' exists on the system.')
            return "The user already exist";
        } else {
            if (!this.users.has(ActionIDofTheOperation)) {
                logger.info('ServiceLayer - The addNewEmployee process failed - the ' + ActionIDofTheOperation + ' , who initiated the operation, does not exist in the system');
                return "The user performing the operation does not exist in the system";
            }
            let result = this.cinemaSystem.addNewEmployee(this.userCounter, userName, password, permissions, firstName, lastName, contactDetails, this.users.get(ActionIDofTheOperation));
            if (result === "The employee registered successfully.") {
                this.users.set(userName, this.userCounter);
                this.userCounter++;
            }
            return result;
        }
    }

    editEmployee(userName, password, permissions, firstName, lastName, contactDetails, ActionIDOfTheOperation) {
        if (!this.users.has(userName)) {
            logger.info('ServiceLayer - editEmployee - The addNewEmployee process failed - the ' + userName + ' not exists on the system.');
            return "The employee does not exist";
        }
        if (!this.users.has(ActionIDOfTheOperation)) {
            logger.info('ServiceLayer - The editEmployee process failed - the ' + ActionIDofTheOperation + ' , who initiated the operation, does not exist in the system');
            return "The user performing the operation does not exist in the system";
        }
        return this.cinemaSystem.editEmployee(this.users.get(userName), password, permissions, firstName, lastName, contactDetails, this.users.get(ActionIDOfTheOperation));
    }

    deleteEmployee(userName, ActionIDOfTheOperation) {
        if (!this.users.has(userName)) {
            logger.info('ServiceLayer - deleteEmployee - The deleteEmployee process failed - the ' + userName + ' not exists on the system.');
            return "The employee does not exist";
        }
        if (!this.users.has(ActionIDOfTheOperation)) {
            logger.info('ServiceLayer - The deleteEmployee process failed - the ' + ActionIDOfTheOperation + ' , who initiated the operation, does not exist in the system');
            return "The user performing the operation does not exist in the system";
        }
        let res = this.cinemaSystem.deleteEmployee(this.users.get(userName), this.users.get(ActionIDOfTheOperation));
        if (res === "Successfully deleted employee data deletion")
            this.users.delete(userName);
        return res;
    }

    addMovie(movieName, category, ActionIDOfTheOperation) {
        if (this.movies.has(movieName)) {
            return "The movie already exists";
        }
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        if (!this.categories.has(category))
            return "The category does not exist";
        let result = this.cinemaSystem.addMovie(
            this.movieCounter,
            movieName,
            this.categories.get(category),
            this.users.get(ActionIDOfTheOperation)
        );
        if (result === "The movie was added successfully") {
            this.movies.set(movieName, this.movieCounter);
            this.movieCounter++;
        }
        return result;
    }

    editMovie(movieName, category, key, examinationRoom, ActionIDOfTheOperation) {
        if (!this.movies.has(movieName)) {
            return "The movie does not exist";
        }
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        if (!this.categories.has(category)) {
            return "The category does not exist";
        }
        return this.cinemaSystem.editMovie(
            this.movies.get(movieName),
            this.categories.get(category),
            key,
            parseInt(examinationRoom),
            this.users.get(ActionIDOfTheOperation)
        );
    }

    removeMovie(movieName, ActionIDOfTheOperation) {
        if (!this.movies.has(movieName)) {
            return "The movie does not exist";
        }
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        let res = this.cinemaSystem.removeMovie(
            this.movies.get(movieName),
            this.users.get(ActionIDOfTheOperation)
        );
        if (res === "The movie removed successfully") {
            this.movies.delete(movieName);
            this.movieCounter--;
        }
        return res;
    }

    addNewSupplier(supplierName, contactDetails, ActionIDOfTheOperation) {
        if (this.suppliers.has(supplierName)) {
            return "The supplier already exist";
        } else {
            if (!this.users.has(ActionIDOfTheOperation)) {
                return "The user performing the operation does not exist in the system";
            }
            let result = this.cinemaSystem.addNewSupplier(
                this.supplierCounter,
                supplierName,
                contactDetails,
                this.users.get(ActionIDOfTheOperation)
            );
            if (result === "The supplier added successfully.") {
                this.suppliers.set(supplierName, this.supplierCounter);
                this.suppliers++;
            }
            return result;
        }
    }

    editSupplier(supplierName, contactDetails, ActionIDOfTheOperation) {
        if (!this.suppliers.has(supplierName)) {
            return "The supplier does not exist";
        } else {
            if (!this.users.has(ActionIDOfTheOperation)) {
                return "The user performing the operation does not exist in the system";
            }
            let result = this.cinemaSystem.editSupplier(
                this.supplierCounter,
                supplierName,
                contactDetails,
                this.users.get(ActionIDOfTheOperation)
            );
            if (result === "The supplier edited successfully.") {
                this.suppliers.set(supplierName, this.supplierCounter);
            }
            return result;
        }
    }

    removeSupplier(supplierName, ActionIDOfTheOperation) {
        if (!this.suppliers.has(supplierName)) {
            return "The supplier does not exist";
        } else {
            if (!this.users.has(ActionIDOfTheOperation)) {
                return "The user performing the operation does not exist in the system";
            }
            let result = this.cinemaSystem.editSupplier(
                this.supplierCounter,
                supplierName,
                this.users.get(ActionIDOfTheOperation)
            );
            if (result === "The supplier removed successfully.") {
                this.suppliers.set(supplierName, this.userCounter);
            }
            return result;
        }
    }

    addNewProduct(
        productName,
        productPrice,
        productQuantity,
        minQuantity,
        maxQuantity,
        productCategory,
        ActionIDOfTheOperation
    ) {
        if (this.products.has(productName)) {
            return "The product already exist";
        } else {
            if (!this.users.has(ActionIDOfTheOperation)) {
                return "The user performing the operation does not exist in the system";
            }
            let result = this.cinemaSystem.addNewProduct(
                this.productsCounter,
                productName,
                productPrice,
                productQuantity,
                minQuantity,
                maxQuantity,
                productCategory,
                this.users.get(ActionIDOfTheOperation)
            );
            if (result === "The product added successfully.") {
                this.products.set(productName, this.productsCounter);
                this.products++;
            }
            return result;
        }
    }

    editProduct(
        productName,
        productPrice,
        productQuantity,
        minQuantity,
        maxQuantity,
        productCategory,
        ActionIDOfTheOperation
    ) {
        if (!this.products.has(productName)) {
            return "The product doesn't exist";
        } else {
            if (!this.users.has(ActionIDOfTheOperation)) {
                return "The user performing the operation does not exist in the system";
            }
            let result = this.cinemaSystem.editProduct(
                this.productsCounter,
                productName,
                productPrice,
                productQuantity,
                minQuantity,
                maxQuantity,
                productCategory,
                this.users.get(ActionIDOfTheOperation)
            );
            if (result === "The product edited successfully.") {
                this.products.set(productName, this.productsCounter);
            }
            return result;
        }
    }

    removeProduct(productName, ActionIDOfTheOperation) {
        if (!this.products.has(productName)) {
            return "The product does not exist";
        } else {
            if (!this.users.has(ActionIDOfTheOperation)) {
                return "The user performing the operation does not exist in the system";
            }
            let result = this.cinemaSystem.removeProduct(
                this.productsCounter,
                this.products.get(productName),
                this.users.get(ActionIDOfTheOperation)
            );
            if (result === "The product removed successfully.") {
                this.products.delete(productName);
            }
            return result;
        }
    }

    addCategory(categoryName, ActionIDOfTheOperation) {
        if (this.categories.has(categoryName)) {
            return "The category already exist";
        } else {
            if (!this.users.has(ActionIDOfTheOperation)) {
                return "The user performing the operation does not exist in the system";
            }
            let result = this.cinemaSystem.addCategory(
                this.categoriesCounter,
                categoryName,
                this.users.get(ActionIDOfTheOperation)
            );
            if (result === "The category added successfully.") {
                this.categories.set(categoryName, this.productsCounter);
                this.categories++;
            }
            return result;
        }
    }

    removeCategory(categoryName, ActionIDOfTheOperation) {
        if (!this.categories.has(categoryName)) {
            return "The category does not exist";
        } else {
            if (!this.users.has(ActionIDOfTheOperation)) {
                return "The user performing the operation does not exist in the system";
            }
            let result = this.cinemaSystem.removeCategory(
                this.categoriesCounter,
                this.categories.get(categoryName),
                this.users.get(ActionIDOfTheOperation)
            );
            if (result === "The category added successfully.") {
                this.categories.delete(categoryName);
            }
            return result;
        }
    }

    addCafetriaOrder(
        productName,
        supplierName,
        orderDate,
        productPrice,
        productQuantity,
        ActionIDOfTheOperation
    ) {
        if (this.orders.has(productName)) {
            return "The order already exist";
        } else {
            if (!this.users.has(ActionIDOfTheOperation)) {
                return "The user performing the operation does not exist in the system";
            }
            let result = this.cinemaSystem.addCafetriaOrder(
                this.ordersCounter,
                productName,
                supplierName,
                orderDate,
                productPrice,
                productQuantity,
                this.users.get(ActionIDOfTheOperation)
            );
            if (result === "The category added successfully.") {
                this.orders.delete(productName);
            }
            return result;
        }
    }

    removeCafetriaOrder(orderId, ActionIDOfTheOperation) {
        if (!this.orders.has(orderId)) {
            return "The order does not exist";
        } else {
            if (!this.users.has(ActionIDOfTheOperation)) {
                return "The user performing the operation does not exist in the system";
            }
            let result = this.cinemaSystem.removeCafetriaOrder(
                orderId,
                this.users.get(ActionIDOfTheOperation)
            );
            if (result === "The category added successfully.") {
                this.orders.delete(orderId);
            }
            return result;
        }
    }

    getMovies(ActionIDOfTheOperation) {
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        return this.cinemaSystem.getSuppliers();
    }

    getSuppliers(ActionIDOfTheOperation) {
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        return this.cinemaSystem.getSuppliers();
    }

    getSupplierDetails(supplierName, ActionIDOfTheOperation) {
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        if (!this.suppliers.has(supplierName)) {
            return "The supplier does not exist";
        }
        return this.cinemaSystem.getSupplierDetails(
            this.suppliers.get(supplierName)
        );
    }

    getEmployees(ActionIDOfTheOperation) {
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        return this.cinemaSystem.getEmployees();
    }

    getEmployeeDetails(employeeName, ActionIDOfTheOperation) {
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        if (!this.users.has(employeeName)) {
            return "The employee does not exist";
        }
        return this.cinemaSystem.getEmployeeDetails(this.users.get(employeeName));
    }

    getCategories(ActionIDOfTheOperation) {
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        return this.cinemaSystem.getCategories();
    }

    getCafeteriaProducts(ActionIDOfTheOperation) {
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        return this.cinemaSystem.getCafeteriaProducts();
    }

    getCafeteriaOrders(ActionIDOfTheOperation) {
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        return this.cinemaSystem.getCafeteriaOrders();
    }

    getInventoryProducts(ActionIDOfTheOperation) {
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        return this.cinemaSystem.getInventoryProducts();
    }

    convertPermissions(permissions) {
        switch (permissions) {
            case "User":
                return [1];
            case "Shift Manager":
                return [1, 2];
            case "Deputy Director":
                return [1, 2, 3];
            case "Director":
                return [1, 2, 3, 4];
            case "admin":
                return [1, 2, 3, 4, 5];
            default:
                return undefined;
        }
    }
}
module.exports = ServiceLayer;