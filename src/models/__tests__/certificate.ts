import { faker } from "@faker-js/faker";
import User from "../User";
import Certificate from "../Certificate";

import db from "../../loaders/sequelize";
import config from "../../config";

beforeAll(async () => {
  await db();
});

// Since not all validations are inside Models, but also inside routes/controllers,
// this tests are a bit simplified.
describe("db: save", () => {
  it("should create a certificate entry", async () => {
    const user = new User({
      email: faker.internet.email(),
      password: faker.internet.password(),
      userName: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      profilePic: faker.image.avatar(),
    });
    await user.save();

    const before = Date.now();

    const certificate = new Certificate({
      userId: user.id,
      fileName: faker.system.fileName(),
      certificate: faker.image.cats(),
    });
    await certificate.save();

    const after = Date.now();

    const fetched = await Certificate.findByPk(certificate.id);

    expect(fetched).not.toBeNull();

    expect(before).toBeLessThanOrEqual(fetched?.createdAt.getTime());

    expect(fetched?.createdAt.getTime()).toBeLessThanOrEqual(after);
  }),
    it("should not save a certificate with no fileName", async () => {
      const user = new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        userName: faker.internet.userName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        profilePic: faker.image.avatar(),
      });
      await user.save();

      const certificate = new Certificate({
        userId: user.id,
        certificate: faker.image.cats(),
      });

      await expect(certificate.save()).rejects.toThrowError(
        /fileName cannot be null/
      );
    });
  it("should not save a certificate with file name less then minimum length", async () => {
    const user = new User({
      email: faker.internet.email(),
      password: faker.internet.password(),
      userName: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      profilePic: faker.image.avatar(),
    });
    await user.save();

    const certificate = new Certificate({
      userId: user.id,
      fileName: "R".repeat(
        Number(config.minFileNameSize > 0 ? config.minFileNameSize : 1) - 1
      ),
      certificate: faker.image.cats(),
    });

    await expect(certificate.save()).rejects.toThrowError(
      /len on fileName failed/
    );
  });
  it("should not save a certificate with file name greater then minimum length", async () => {
    const user = new User({
      email: faker.internet.email(),
      password: faker.internet.password(),
      userName: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      profilePic: faker.image.avatar(),
    });
    await user.save();

    const certificate = new Certificate({
      userId: user.id,
      fileName: "R".repeat(Number(config.maxFileNameSize) + 1),
      certificate: faker.image.cats(),
    });

    await expect(certificate.save()).rejects.toThrowError(
      /len on fileName failed/
    );
  });

  // TODO: tests
  // X save with no filename
  // X save with less then minFileNameSize
  // X save with more then maxFileNameSize
  // - save with a missing field
  // - save two of the same entry for user
  // - save two equal filenames for user
  // - delete a file
  // - delete another user file ?
  // - delete inexistent file
});
