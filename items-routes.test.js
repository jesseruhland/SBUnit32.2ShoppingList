process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let potatoes = { name: "potatoes", price: 3.5 };

beforeEach(function () {
  items.push(potatoes);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [potatoes] });
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${potatoes.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(potatoes);
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/pickles`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Creating a new item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "pickles", price: 5.95 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "pickles", price: 5.95 } });
  });
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  });
  test("Responds with 400 if price is missing", async () => {
    const res = await request(app).post("/items").send({ name: "cheese" });
    expect(res.statusCode).toBe(400);
  });
});

describe("/PATCH /items/:name", () => {
  test("Updating an items's details", async () => {
    const res = await request(app)
      .patch(`/items/${potatoes.name}`)
      .send({ name: "sweetPotatoes", price: 4.99 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: { name: "sweetPotatoes", price: 4.99 },
    });
  });
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app)
      .patch(`/items/cheese`)
      .send({ name: "pickles", price: 5.95 });
    expect(res.statusCode).toBe(404);
  });
});

describe("/DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/${potatoes.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 for deleting invalid item name", async () => {
    const res = await request(app).delete(`/items/cheese`);
    expect(res.statusCode).toBe(404);
  });
});
