import { requestQuery, seedUsers } from "./util";
import { UserSchema } from "../src/models/User";

describe('community', () => {

  beforeEach(async () => {
    await seedUsers();
  });

  test.skip('should fail to create post if user is not logged', async () => {});

  test.skip('should fail to create post if community does not exist', async () => {});


  test.skip('should create post with valid data', async () => {});


});