import { requestQuery, seedUsers } from "./util";
import { UserSchema } from "../src/models/User";

describe('community', () => {

  beforeEach(async () => {
    await seedUsers();
  });

  test.skip('should fail to create community if user is not logged', async () => {});


  test.skip('should create a community fine', async () => {});

});