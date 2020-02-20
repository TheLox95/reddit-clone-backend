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

  test('should return one user', async () => {
    const { user } = await requestQuery<{ user: UserSchema }>(`{
            user(id: "5e4df908251bfa517ee0a5a6"){
              username
            }
          }
        `);
    expect(user.username).toBe('Kaufman');
  });

  test('should return 10 users', async () => {
    const { users } = await requestQuery<{ users: UserSchema[] }>(`{
            users{
              username
            }
          }
        `);
    expect(users.length).toBe(10);
  });

  test('should return 7 users', async () => {
    const { users } = await requestQuery<{ users: UserSchema[] }>(`{
            users(limit: 7){
              username
            }
          }
        `);
    expect(users.length).toBe(7);
  });

  test('should return 10 users starting from Fifth user', async () => {
    const { users } = await requestQuery<{ users: UserSchema[] }>(`{
            users(limit: 4, offset: 5){
              username
            }
          }
        `);
    expect(users.length).toBe(4);
    expect(users[0].username).toBe('Brewer');
    expect(users[users.length - 1].username).toBe('Kaufman');
  });

  test('should create a new user', async () => {
    const { userCreateOne } = await requestQuery<{ userCreateOne: UserSchema }>(`
    mutation {
      userCreateOne(username: "tony", password: "F.R.I.D.A.Y", email: "tony@mail.com"){
        username
        email
      }
    }
    `);
    expect(userCreateOne.username).toBe('tony');
    expect(userCreateOne.email).toBe('tony@mail.com');
  });
});