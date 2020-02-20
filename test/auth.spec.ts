import { requestQuery, seedUsers } from "./util";
import { UserSchema } from "../src/models/User";

describe('auth', () => {

  beforeEach(async () => {
    await seedUsers();
  });

  test('should fail if username is wrong', async () => {
    const { errors } = await requestQuery<{ userCreateOne: UserSchema & { token: string } }>(`
      mutation {
        signIn(login: "Water", password: "3272b8c0-c6de-44f8-8295-bc58bf9e7a09"){
          token
        }
      }`);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('No user found with this login credentials.');
  });


  test('should fail if password is wrong', async () => {
    const { errors } = await requestQuery<{ userCreateOne: UserSchema & { token: string } }>(`
      mutation {
        signIn(login: "Waters", password: "3272b8c0-c6de-44XX-8295-bc58bf9e7a09"){
          token
        }
      }`);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('Username or password incorrect');
  });

  test('should return token if credentials are correct', async () => {
    const { data: { signIn: { token } } } = await requestQuery<{ signIn: { token: string } }>(`
    mutation {
      signIn(login: "Waters", password: "3272b8c0-c6de-44f8-8295-bc58bf9e7a09"){
        token
      }
    }`);
    expect(token.constructor.name ).toBe('String');
  });

});