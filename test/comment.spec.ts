import { requestQuery, seedUsers } from "./util";
import { UserSchema } from "../src/models/User";

describe('community', () => {

  beforeEach(async () => {
    await seedUsers();
  });

  test.skip('should fail to create comment if user is not logged', async () => {});
  
  test.skip('should fail to create comment if post does not exist', async () => {});


  test.skip('should create a community fine', async () => {});

});