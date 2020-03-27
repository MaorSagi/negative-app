const { createConnection, connectAndCreate, dropAndClose } = require("./connectAndCreate");
const { addEmployee, removeEmployee } = require("./UserEmployeeTests.spec");
const { addIncomesDailyReport, addMoviesDailyReport, addGeneralPurposeDailyReport, addInventoryDailyReport } = require("./ReportsTests.spec");
const { addCategory, addMovieAfterCategory, addProductAfterCategory, removeMovie, removeProduct, removeCategoryBeforeUsed } = require("./ProductsTests.spec");
const { addSupplier, removeSupplier, addOrderAftereSupplierCreatorRecipient, addProductsOrder } = require("./OrdersTests.spec");
const DB = require("../../../server/src/main/DBManager");


async function getReport(model, where, isRecordExists, failMsg) {
  await DB.getById(model, where).then((result) => {
    let cond = isRecordExists ? result == null : result != null;
    if (cond)
      fail(failMsg);
  });
}

const getCreatedDeleteQuery = (table) => {
  return "CREATE EVENT IF NOT EXISTS delete_created_event " +
    "ON SCHEDULE " +
    "EVERY 1 SECOND " +
    "DO DELETE FROM " + table + " WHERE createdAt <= (CURRENT_TIMESTAMP - INTERVAL 3 SECOND);"
}

const getRemovedDeleteQuery = (table, prop) => {
  return "CREATE EVENT IF NOT EXISTS delete_after_removed_event " +
    "ON SCHEDULE " +
    "EVERY 1 SECOND " +
    "DO DELETE FROM " + table + " WHERE " + prop + " IS NOT NULL AND " + prop + " <= (CURRENT_TIMESTAMP - INTERVAL 3 SECOND);"
}


describe("DB Test - destroy timer", function () {

  let sequelize;

  beforeAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 12000;
  });

  beforeEach(async function () {
    //create connection & mydb
    var con = createConnection();
    await connectAndCreate(con);
    sequelize = await DB.initDB('mydbTest');
    let t = new Date()

  });

  afterEach(async function () {
    //create connection & drop mydb
    con = createConnection();
    await dropAndClose(con);
  });

  it("delete incomes reports after time test", async function (done) {
    await addIncomesDailyReport();
    await deleteModel('incomes_daily_report', 'incomes_daily_reports', getCreatedDeleteQuery,
     { date: new Date('2020-03-02 00:00:00') }, sequelize, 6000,done);
  });


  it("delete movies reports after time test", async function (done) {
    await addMoviesDailyReport();
    await deleteModel('movie_daily_report', 'movie_daily_reports', getCreatedDeleteQuery, 
    { date: new Date('2020-03-02 00:00:00') }, sequelize,6000, done);
  });


  it("delete general purpose reports after time test", async function (done) {
    await addGeneralPurposeDailyReport();
    await deleteModel('general_purpose_daily_report', 'general_purpose_daily_reports', getCreatedDeleteQuery, 
    { date: new Date('2020-03-02 00:00:00') }, sequelize, 6000,done);
  });

  it("delete inventory reports after time test", async function (done) {
    await addInventoryDailyReport();
    await deleteModel('inventory_daily_report', 'inventory_daily_reports', getCreatedDeleteQuery,
     { date: new Date('2020-03-02 00:00:00') }, sequelize, 6000,done);
  });

  it("delete user after time test", async function (done) {
    await DB.add('user', {
      id: 0,
      username: "admin",
      password: "admin",
      permissions: "ADMIN",
      isUserRemoved: new Date()
    });
    await deleteModel('user', 'users', (model) => getRemovedDeleteQuery(model, 'isUserRemoved'), { id: 0 }, 
    sequelize, 6000,done);
  });

  it("delete employee after time test", async function (done) {
    await removeEmployee(1);
    await deleteModel('employee', 'employees', (model) => getRemovedDeleteQuery(model, 'isEmployeeRemoved'), { id: 1 }, 
    sequelize, 6000,done);
  });

  it("delete category after time test", async function (done) {
    await addCategory(1, "testCategory");
    await removeCategoryBeforeUsed();
    await deleteModel('category', 'categories', (model) => getRemovedDeleteQuery(model, 'isCategoryRemoved'), { id: 1 }, 
    sequelize, 6000, done);
  });


  it("delete movie after time test", async function (done) {
    await addCategory(0, "testCategory");
    await addMovieAfterCategory();
    await removeMovie();
    await deleteModel('movie', 'movies', (model) => getRemovedDeleteQuery(model, 'isMovieRemoved'), { id: 0 },
     sequelize, 6000,done);
  });

  it("delete product after time test", async function (done) {
    await addCategory(0, "testCategory");
    await addProductAfterCategory();
    await removeProduct()
    await deleteModel('cafeteria_product', 'cafeteria_products', (model) => getRemovedDeleteQuery(model, 'isProductRemoved'),
     { id: 0 }, sequelize,6000, done);
  });

  it("delete supplier after time test", async function (done) {
    await addSupplier(0);
    await removeSupplier(0);
    await deleteModel('supplier', 'suppliers', (model) => getRemovedDeleteQuery(model, 'isSupplierRemoved'),
     { id: 0 }, sequelize,6000, done);
  });

  it("delete order after time test", async function (done) {
    await addSupplier(0);
    await addEmployee(0);
    await addOrderAftereSupplierCreatorRecipient();
    await deleteModel('order', 'orders', getCreatedDeleteQuery,
     { id: 0 }, sequelize,6000, done);
  });

  it("delete movie order after time test", async function (done) {
    await addSupplier(0);
    await addEmployee(0);
    await addCategory(0, "testCategory");
    await addMovieAfterCategory();
    await addOrderAftereSupplierCreatorRecipient();
    await DB.add('movie_order', {
      orderId: 0,
      movieId: 0,
      expectedQuantity: 1
    });
    await deleteModel('movie_order', 'movie_orders', getCreatedDeleteQuery,
     { orderId: 0, movieId: 0 }, sequelize,10000, done);
  });

  it("delete product order after time test", async function (done) {
    await addSupplier(0);
    await addEmployee(0);
    await addCategory(0, "testCategory");
    await addProductAfterCategory();
    await addOrderAftereSupplierCreatorRecipient();
    await DB.add('cafeteria_product_order', {
      orderId: 0,
      productId: 0,
      expectedQuantity: 2
    });
    await deleteModel('cafeteria_product_order', 'cafeteria_product_orders', getCreatedDeleteQuery,
     { orderId: 0, productId: 0 }, sequelize,10000, done);
  });

});
async function deleteModel(model, table, deleteQuery, where, sequelize,time, done) {
  setTimeout(done, time);
  await sequelize.query(deleteQuery(table));
  await getReport(model, where, true, table + " - before event failed").then(async () => {
    setTimeout(async function () {
      await getReport(model, where, false, table + " - after event failed");
    }, 4000);
  });

}

