import { requestQuery, seedUsers } from "./util";
import { UserSchema } from "../src/models/User";

beforeEach(async () => {
  await requestQuery(`
    mutation{
        resetDB
      }
    `);
});

describe('users', () => {

  beforeEach(async () => {
    await seedUsers();
  });

  test.skip('should fail if credentials does not exist', async () => {});

  test.skip('should fail if username is wrong', async () => {});

  test.skip('should fail if password is wrong', async () => {});

  test.skip('should return token if credentials are correct', async () => {});

});