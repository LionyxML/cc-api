import { faker } from "@faker-js/faker";
import User from "../User";

import db from "../../loaders/sequelize";

beforeAll(async () => {
  await db();
});

// Since validations are not inside Models, but inside routes/controllers,
// this test is simplified.
describe("db: save", () => {
  it("should create an user", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const userName = faker.name.firstName();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const profilePic = faker.image.avatar();

    const before = Date.now();

    const user = new User({
      email,
      password,
      userName,
      firstName,
      lastName,
      profilePic,
    });
    await user.save();

    const after = Date.now();

    const fetched = await User.findByPk(user.id);

    expect(fetched).not.toBeNull();

    expect(fetched?.email).toBe(email);
    expect(fetched?.userName).toBe(userName);
    expect(fetched?.lastName).toBe(lastName);
    expect(fetched?.password).toBe(password); // This test saves raw password, encryption is made by controller

    expect(before).toBeLessThanOrEqual(fetched?.createdAt.getTime());
    expect(fetched?.createdAt.getTime()).toBeLessThanOrEqual(after);
  }),
    it("should not save user without email", async () => {
      const user1 = new User({
        password: faker.internet.password(),
        userName: faker.name.firstName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        profilePic: faker.image.avatar(),
      });
      await expect(user1.save()).rejects.toThrowError(
        /User.email cannot be null/
      );
    }),
    it("should not save user without password", async () => {
      const user1 = new User({
        email: faker.internet.email(),
        userName: faker.name.firstName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        profilePic: faker.image.avatar(),
      });
      await expect(user1.save()).rejects.toThrowError(
        /User.password cannot be null/
      );
    }),
    it("should not save user without userName", async () => {
      const user1 = new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        profilePic: faker.image.avatar(),
      });
      await expect(user1.save()).rejects.toThrowError(
        /User.userName cannot be null/
      );
    }),
    it("should not save user without firstName", async () => {
      const user1 = new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        userName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        profilePic: faker.image.avatar(),
      });
      await expect(user1.save()).rejects.toThrowError(
        /User.firstName cannot be null/
      );
    }),
    it("should not save user without lastName", async () => {
      const user1 = new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        userName: faker.name.firstName(),
        firstName: faker.name.firstName(),
        profilePic: faker.image.avatar(),
      });
      await expect(user1.save()).rejects.toThrowError(
        /User.lastName cannot be null/
      );
    }),
    it("should not save user without profilePic", async () => {
      const user1 = new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        userName: faker.name.firstName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      });
      await expect(user1.save()).rejects.toThrowError(
        /User.profilePic cannot be null/
      );
    }),
    it("should not save user with invalid email", async () => {
      const user1 = new User({
        email: "blablabla@blabla",
        password: faker.internet.password(),
        userName: faker.name.firstName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        profilePic: faker.image.avatar(),
      });
      await expect(user1.save()).rejects.toThrowError(
        /Validation isEmail on email failed/
      );
    }),
    it("should not save user with short password", async () => {
      const user1 = new User({
        email: faker.internet.email(),
        password: "123",
        userName: faker.name.firstName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        profilePic: faker.image.avatar(),
      });
      await expect(user1.save()).rejects.toThrowError(
        /Validation len on password failed/
      );
    }),
    it("should not save user with same username", async () => {
      const userName = faker.internet.userName();

      const user0 = new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        userName: userName,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        profilePic: faker.image.avatar(),
      });
      await user0.save();

      const user1 = new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        userName: userName,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        profilePic: faker.image.avatar(),
      });
      await expect(user1.save()).rejects.toThrowError(/Validation error/);
    }),
    it("should not save user with same email", async () => {
      const email = faker.internet.email();
      const user0 = new User({
        email: email,
        password: faker.internet.password(),
        userName: faker.internet.userName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        profilePic: faker.image.avatar(),
      });
      await user0.save();

      const user1 = new User({
        email: email,
        password: faker.internet.password(),
        userName: faker.internet.userName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        profilePic: faker.image.avatar(),
      });
      await expect(user1.save()).rejects.toThrowError(/Validation error/);
    });
});
