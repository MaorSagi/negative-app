const CinemaSystem = require("./CinemaSystem");
const SystemInitializer = require("./SystemInitializer");
const logger = require("simple-node-logger").createSimpleLogger("project.log");

class ServiceLayer {
  constructor() {
    this.cinemaSystem = new CinemaSystem();
    this.users = new Map();
    this.userCounter = 0;
    this.suppliers = new Map();
    this.supplierCounter = 0;
    this.products = new Map();
    this.productsCounter = 0;
    this.categories = new Map();
    this.categoriesCounter = 0;
    this.orders = new Map();
    this.ordersCounter = 0;
  }

  async initSeviceLayer(dbName) {
    this.users.set("admin", this.userCounter);
    this.userCounter++;
    return SystemInitializer.initSystem(this, dbName);
  }

  isInputValid(param) {
    if (param === undefined || param === "") return false;
    return true;
  }

  async register(userName, password) {
    if (this.users.has(userName)) {
      logger.info(
        "ServiceLayer - The registration process failed - the " +
          userName +
          " exists on the system."
      );
      return "The user already Exist";
    } else {
      const result = await this.cinemaSystem.register(
        this.userCounter,
        userName,
        password,
        "EMPLOYEE"
      );
      if (result === "The user registered successfully.") {
        this.users.set(userName, this.userCounter);
        this.userCounter++;
      }
      return result;
    }
  }

  login(userName, password) {
    if (this.users.has(userName)) {
      return this.cinemaSystem.login(
        userName,
        password,
        this.users.get(userName)
      );
    }
    logger.info(
      "ServiceLayer - The login process failed - the " +
        userName +
        " isn't exists on the system."
    );
    return "Incorrect user name.";
  }

  // eslint-disable-next-line no-dupe-class-members
  isLoggedIn(userName) {
    if (this.users.has(userName)) {
      return this.cinemaSystem.isLoggedin(this.users.get(userName));
    }
  }

  logout(userName) {
    if (this.users.has(userName)) {
      return this.cinemaSystem.logout(this.users.get(userName));
    }
    logger.info(
      "ServiceLayer - The logout process failed - the " +
        userName +
        " isn't exists on the system."
    );
    return "Incorrect user name.";
  }

  printallUser() {
    this.users.forEach((value, key, map) => {
      console.log(`m[${key}] = ${value}`);
    });
  }

  async addNewEmployee(
    userName,
    password,
    firstName,
    lastName,
    permissions,
    contactDetails,
    ActionIDofTheOperation,
    isPasswordHashed
  ) {
    if (this.users.has(userName)) {
      logger.info(
        "ServiceLayer - The addNewEmployee process failed - the " +
          userName +
          " exists on the system."
      );
      return "The user already exists";
    }
    if (!this.users.has(ActionIDofTheOperation)) {
      logger.info(
        "ServiceLayer - The addNewEmployee process failed - the " +
          ActionIDofTheOperation +
          " , who initiated the operation, does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.addNewEmployee(
      this.userCounter,
      userName,
      password,
      permissions,
      firstName,
      lastName,
      contactDetails,
      this.users.get(ActionIDofTheOperation),
      isPasswordHashed
    );
    if (result === "The employee added successfully.") {
      this.users.set(userName, this.userCounter);
      this.userCounter++;
    }
    return result;
  }

  async editEmployee(
    userName,
    password,
    permissions,
    firstName,
    lastName,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    if (!this.users.has(userName)) {
      logger.info(
        "ServiceLayer - editEmployee - The addNewEmployee process failed - the " +
          userName +
          " not exists on the system."
      );
      return "The employee does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer - The editEmployee process failed - the " +
          ActionIDOfTheOperation +
          " , who initiated the operation, does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    return await this.cinemaSystem.editEmployee(
      this.users.get(userName),
      password,
      permissions,
      firstName,
      lastName,
      contactDetails,
      this.users.get(ActionIDOfTheOperation)
    );
  }
  async deleteEmployee(userName, ActionIDOfTheOperation) {
    if (!this.users.has(userName)) {
      logger.info(
        "ServiceLayer - deleteEmployee - The deleteEmployee process failed - the " +
          userName +
          " not exists on the system."
      );
      return "The employee does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer - The deleteEmployee process failed - the " +
          ActionIDOfTheOperation +
          " , who initiated the operation, does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let res = await this.cinemaSystem.deleteEmployee(
      this.users.get(userName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (res === "Successfully deleted employee data deletion")
      this.users.delete(userName);
    return res;
  }

  async addMovie(movieName, category, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(movieName)
      ? "Movie Name is not valid"
      : !this.isInputValid(category)
      ? "Category is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- addMovie - ", validationResult);
      return validationResult;
    }

    if (this.products.has(movieName)) {
      logger.info(
        "ServiceLayer- addMovie - The movie " + movieName + " already exists"
      );
      return "The movie already exists";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- addMovie - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    if (!this.categories.has(category)) {
      logger.info(
        "ServiceLayer- addMovie - The category " + category + " does not exist"
      );
      return "The category does not exist";
    }
    let result = await this.cinemaSystem.addMovie(
      this.productsCounter,
      movieName,
      this.categories.get(category),
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The movie added successfully") {
      this.products.set(movieName, this.productsCounter);
      this.productsCounter++;
    }
    return result;
  }

  async editMovie(
    movieName,
    category,
    key,
    examinationRoom,
    ActionIDOfTheOperation
  ) {
    let validationResult = !this.isInputValid(movieName)
      ? "Movie Name is not valid"
      : !this.isInputValid(category)
      ? "Category is not valid"
      : !this.isInputValid(key)
      ? "Key is not valid"
      : !this.isInputValid(examinationRoom)
      ? "Examination Room is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- editMovie - ", validationResult);
      return validationResult;
    }

    if (!this.products.has(movieName)) {
      logger.info(
        "ServiceLayer- editMovie - The movie " + movieName + " does not exist"
      );
      return "The movie does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- editMovie - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    if (!this.categories.has(category)) {
      logger.info(
        "ServiceLayer- editMovie - The category " + category + " does not exist"
      );
      return "The category does not exist";
    }
    return await this.cinemaSystem.editMovie(
      this.products.get(movieName),
      this.categories.get(category),
      key,
      parseInt(examinationRoom),
      this.users.get(ActionIDOfTheOperation)
    );
  }

  async removeMovie(movieName, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(movieName)
      ? "Movie Name is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- removeMovie - ", validationResult);
      return validationResult;
    }

    if (!this.products.has(movieName)) {
      logger.info(
        "ServiceLayer- removeMovie - The movie " + movieName + " does not exist"
      );
      return "The movie does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- removeMovie - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let res = await this.cinemaSystem.removeMovie(
      this.products.get(movieName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (res === "The movie removed successfully") {
      this.products.delete(movieName);
    }
    return res;
  }

  async addNewSupplier(supplierName, contactDetails, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this.isInputValid(contactDetails)
      ? "Contact Details is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- addNewSupplier - ", validationResult);
      return validationResult;
    }

    if (this.suppliers.has(supplierName)) {
      logger.info(
        "ServiceLayer- addNewSupplier - The supplier " +
          supplierName +
          " already exists"
      );
      return "The supplier already exists";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- addNewSupplier - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.addNewSupplier(
      this.supplierCounter,
      supplierName,
      contactDetails,
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The supplier added successfully") {
      this.suppliers.set(supplierName, this.supplierCounter);
      this.supplierCounter++;
    }
    return result;
  }

  async editSupplier(supplierName, contactDetails, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this.isInputValid(contactDetails)
      ? "Contact Details is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") return validationResult;
    if (!this.suppliers.has(supplierName)) {
      return "The supplier does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    return this.cinemaSystem.editSupplier(
      this.suppliers.get(supplierName),
      supplierName,
      contactDetails,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  async removeSupplier(supplierName, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") return validationResult;

    if (!this.suppliers.has(supplierName)) {
      return "The supplier does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.removeSupplier(
      this.suppliers.get(supplierName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The supplier removed successfully") {
      this.suppliers.delete(supplierName);
    }
    return result;
  }

  async addNewProduct(
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
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    let validationResult = !this.isInputValid(productName)
      ? "Product name is not valid"
      : !this.isInputValid(productPrice)
      ? "Product price is not valid"
      : !this.isInputValid(productQuantity)
      ? "Product quantity is not valid"
      : !this.isInputValid(productCategory)
      ? "Product category is not valid"
      : "Valid";
    if (validationResult !== "Valid") return validationResult;
    if (!this.categories.has(productCategory))
      return "Product category does not exist";
    let result = await this.cinemaSystem.addCafeteriaProduct(
      this.productsCounter,
      productName,
      this.categories.get(productCategory),
      productPrice,
      productQuantity,
      maxQuantity,
      minQuantity,
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The product was successfully added to the system") {
      this.products.set(productName, this.productsCounter);
      this.productsCounter++;
    } else {
      logger.info("ServiceLayer- addNewProduct - " + result);
    }
    return result;
  }

  async editProduct(
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
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let categoryID;
    if (
      this.isInputValid(productCategory) &&
      !this.categories.has(productCategory)
    )
      return "Product category does not exist";
    else {
      categoryID = this.categories.get(productCategory);
    }
    return await this.cinemaSystem.editCafeteriaProduct(
      this.products.get(productName),
      categoryID,
      productPrice,
      productQuantity,
      maxQuantity,
      minQuantity,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  async removeProduct(productName, ActionIDOfTheOperation) {
    console.log("products:", this.products);
    console.log("productName:", productName);
    if (!this.products.has(productName)) {
      return "The product does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.removeCafeteriaProduct(
      this.products.get(productName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The product removed successfully") {
      this.products.delete(productName);
    } else {
      logger.info("ServiceLayer- removeProduct - " + result);
    }
    return result;
  }

  async addCategory(categoryName, ActionIDOfTheOperation, parentName) {
    if (this.categories.has(categoryName)) {
      logger.info("ServiceLayer- addCategory - ", "The category already exist");
      return "The category already exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- addCategory - " +
          "The user performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let parentId;
    if (
      typeof parentName !== "undefined" &&
      parentName !== null &&
      (typeof parentName !== "string" || parentName !== "" || parentName !== "")
    ) {
      if (this.categories.has(parentName))
        parentId = this.categories.get(parentName);
      else {
        logger.info(
          "ServiceLayer- addCategory - " +
            "The parent " +
            parentName +
            " does not exist"
        );
        return "The parent " + parentName + " does not exist";
      }
    }

    let result = await this.cinemaSystem.addCategory(
      this.categoriesCounter,
      categoryName,
      parentId,
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The category was successfully added to the system") {
      this.categories.set(categoryName, this.categoriesCounter);
      this.categoriesCounter++;
    }
    return result;
  }

  async editCategory(categoryName, ActionIDOfTheOperation, parentName) {
    if (!this.categories.has(categoryName)) {
      logger.info(
        "ServiceLayer- editCategory - ",
        "The category doesn't exist"
      );
      return "The category doesn't exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- editCategory - " +
          "The user performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let parentId;
    if (parentName !== undefined) {
      if (this.categories.has(parentName))
        parentId = this.categories.get(parentName);
      else {
        logger.info(
          "ServiceLayer- editCategory - " +
            "The parent " +
            parentName +
            " does not exist"
        );
        return "The parent " + parentName + " does not exist";
      }
    }
    return await this.cinemaSystem.editCategory(
      this.categories.get(categoryName),
      parentId,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  async removeCategory(categoryName, ActionIDOfTheOperation) {
    if (!this.categories.has(categoryName)) {
      logger.info(
        "ServiceLayer- editCategory - ",
        "The category doesn't exist"
      );
      return "The category doesn't exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- editCategory - " +
          "The user performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.removeCategory(
      this.categories.get(categoryName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The category was successfully removed") {
      this.categories.delete(categoryName);
    }
    return result;
  }

  async addMovieOrder(
    orderId,
    date,
    supplierName,
    moviesList,
    ActionIDOfTheOperation
  ) {
    let validationResult = !this.isInputValid(orderId)
      ? "Order ID is not valid"
      : !this.isInputValid(date)
      ? "Date is not valid"
      : !this.isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this.isInputValid(moviesList)
      ? "Movies List is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- addMovieOrder - ", validationResult);
      return validationResult;
    }
    if (this.orders.has(orderId)) {
      logger.info(
        "ServiceLayer- addMovieOrder - The order " + orderId + " already exists"
      );
      return "The order already exist";
    }
    if (!this.suppliers.has(supplierName)) {
      logger.info(
        "ServiceLayer- addMovieOrder - The supplier " +
          supplierName +
          " does not exist"
      );
      return "The supplier does not exist";
    }
    moviesList = JSON.parse(moviesList);
    for (let i in moviesList) {
      if (!this.products.has(moviesList[i])) {
        logger.info(
          "ServiceLayer- addMovieOrder - The movie " +
            moviesList[i] +
            " does not exist"
        );
        return "Movie does not exist";
      }
      moviesList[i] = this.products.get(moviesList[i]);
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- addMovieOrder - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.addMovieOrder(
      this.ordersCounter,
      date,
      this.suppliers.get(supplierName),
      moviesList,
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The order added successfully") {
      this.orders.set(orderId, this.ordersCounter);
      this.ordersCounter++;
    }
    return result;
  }

  async removeOrder(orderId, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(orderId)
      ? "Order ID is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- removeOrder - ", validationResult);
      return validationResult;
    }
    if (!this.orders.has(orderId)) {
      logger.info(
        "ServiceLayer- removeOrder - The order " + orderId + " does not exist"
      );
      return "The order does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- removeOrder - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.removeOrder(
      this.orders.get(orderId),
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The order removed successfully.")
      this.orders.delete(orderId);
    return result;
  }

  async addCafeteriaOrder(
    orderId,
    date,
    supplierName,
    productsList,
    ActionIDOfTheOperation
  ) {
    let validationResult = !this.isInputValid(orderId)
      ? "Order ID is not valid"
      : !this.isInputValid(date)
      ? "Date is not valid"
      : !this.isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this.isInputValid(productsList)
      ? "Products List is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- addCafeteriaOrder - ", validationResult);
      return validationResult;
    }
    if (this.orders.has(orderId)) {
      logger.info(
        "ServiceLayer- addCafeteriaOrder - The order " +
          orderId +
          " already exists"
      );
      return "The order already exist";
    }
    if (!this.suppliers.has(supplierName)) {
      logger.info(
        "ServiceLayer- addCafeteriaOrder - The supplier " +
          supplierName +
          " does not exist"
      );
      return "The supplier does not exist";
    }
    productsList = JSON.parse(productsList);
    for (let i = 0; i < productsList.length; i++) {
      if (!this.products.has(productsList[i].name)) {
        logger.info(
          "ServiceLayer- addCafeteriaOrder - The product " +
            productsList[i].name +
            " does not exist"
        );
        return "Product does not exist";
      }
      productsList[i].id = this.products.get(productsList[i].name);
      productsList[i].quantity = parseInt(productsList[i].quantity);
      delete productsList[i].name;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- addCafeteriaOrder - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.addCafeteriaOrder(
      this.ordersCounter,
      date,
      this.suppliers.get(supplierName),
      productsList,
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The order added successfully") {
      this.orders.set(orderId, this.ordersCounter);
      this.ordersCounter++;
    }
    return result;
  }

  editCafeteriaOrder(
    orderId,
    productsName,
    orderDate,
    productQuantity,
    ActionIDOfTheOperation
  ) {
    if (!this.orders.has(orderId)) {
      return "The order does not exist";
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let result = this.cinemaSystem.editCafeteriaOrder(
        this.ordersCounter,
        orderId,
        productsName,
        orderDate,
        productQuantity,
        this.users.get(ActionIDOfTheOperation)
      );
      return result;
    }
  }

  async removeFieldFromDailyReport(fieldToRemove, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(fieldToRemove)
      ? "Field is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info(
        "ServiceLayer- removeFieldFromDailyReport - ",
        validationResult
      );
      return validationResult;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- removeFieldFromDailyReport - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    return await this.cinemaSystem.removeFieldFromDailyReport(
      fieldToRemove,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  async addFieldToDailyReport(newField, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(newField)
      ? "Field is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- addFieldToDailyReport - ", validationResult);
      return validationResult;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- addFieldToDailyReport - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    return await this.cinemaSystem.addFieldToDailyReport(
      newField,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  async createDailyReport(type, records, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(type)
      ? "Type is not valid"
      : !this.isInputValid(records)
      ? "Records is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- createDailyReport - ", validationResult);
      return validationResult;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- createDailyReport - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    return await this.cinemaSystem.createDailyReport(
      type,
      JSON.parse(records),
      this.users.get(ActionIDOfTheOperation)
    );
  }

  async getReport(type, date, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(type)
      ? "Type is not valid"
      : !this.isInputValid(date)
      ? "Date is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- getReport - ", validationResult);
      return validationResult;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- getReport - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    return await this.cinemaSystem.getReport(
      type,
      new Date(date),
      this.users.get(ActionIDOfTheOperation)
    );
  }

  getMovies() {
    return this.cinemaSystem.getMovies();
  }

  getSuppliers() {
    return this.cinemaSystem.getSuppliers();
  }

  getSupplierDetails(supplierName) {
    if (!this.suppliers.has(supplierName)) {
      return "The supplier does not exist";
    }
    return this.cinemaSystem.getSupplierDetails(
      this.suppliers.get(supplierName)
    );
  }

  getCafeteriaOrders(startDate, endDate) {
    return this.cinemaSystem.getOrdersByDates(startDate, endDate);
  }
  getEmployees() {
    return this.cinemaSystem.getEmployees();
  }

  getEmployeeDetails(employeeName) {
    if (!this.users.has(employeeName)) {
      return "The employee does not exist";
    }
    return this.cinemaSystem.getEmployeeDetails(this.users.get(employeeName));
  }

  getCategories() {
    return this.cinemaSystem.getCategories();
  }

  getCafeteriaProducts() {
    return this.cinemaSystem.getCafeteriaProducts();
  }

  //   getCafeteriaOrders(startDate, endDate) {
  //     return this.cinemaSystem.getCafeteriaOrders(startDate, endDate);
  //   }

  getInventoryProducts() {
    return this.cinemaSystem.getInventoryProducts();
  }

  getOrderDetails(orderId) {
    if (!this.orders.has(orderId)) {
      return "The order does not exist";
    }
    return this.cinemaSystem.getOrderDetails(orderId);
  }

  getMovieDetails(movieName) {
    if (!this.movies.has(movieName)) {
      return "The movie does not exist";
    }
    return this.cinemaSystem.getMovieDetails(this.movies.get(movieName));
  }

  getProductsByOrder(orderName) {
    if (!this.orders.has(orderName)) {
      logger.info(
        "ServiceLayer- getProductsByOrder - The order " +
          orderName +
          " doesn't exists"
      );
      return { title: "The order " + orderName + " doesn't exists" };
    }
    return this.cinemaSystem.getProductsByOrder(this.orders.get(orderName));
  }

  getOrdersByDates(startDate, endDate) {
    return this.cinemaSystem.getOrdersByDates(startDate, endDate);
  }

  getProductsAndQuantityByOrder(orderName) {
    if (!this.orders.has(orderName)) {
      logger.info(
        "ServiceLayer- getProductsByOrder - The order " +
          orderName +
          " doesn't exists"
      );
      return { title: "The order " + orderName + " doesn't exists" };
    }
    return this.cinemaSystem.getProductsAndQuantityByOrder(
      this.orders.get(orderName)
    );
  }

  getProductDetails(productName) {
    if (!this.products.has(productName)) {
      logger.info(
        "ServiceLayer- getProductDetails - The product " +
          productName +
          " doesn't exists"
      );
      return "The product " + productName + " doesn't exists";
    }
    return this.cinemaSystem.getCafeteriaProductDetails(
      this.products.get(productName)
    );
  }

  getCategoryDetails(categoryName) {
    if (!this.categories.has(categoryName)) {
      logger.info(
        "ServiceLayer- getCategoryDetails - The category " +
          categoryName +
          " doesn't exists"
      );
      return "The product " + categoryName + " doesn't exists";
    }
    return this.cinemaSystem.getCategoryDetails(
      this.categories.get(categoryName)
    );
  }
}
module.exports = ServiceLayer;
