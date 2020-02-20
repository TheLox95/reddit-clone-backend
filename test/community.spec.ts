import { requestQuery, logIn, seedUsers } from "./util";
import { CommunitySchema } from "../src/models/Community";

describe('community', () => {

  beforeEach(async () => {
    await requestQuery(`
      mutation{
          resetDB
        }
      `);
    await seedUsers();
  });

  test('should fail to create community if user is not logged', async () => {
    try {
      await requestQuery<{ userCreateOne: CommunitySchema }>(`
      mutation {
        communityCreateOne(title: "Memes"){
          title
        }
      }`);
    } catch (errors) {
      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe('Not authenticated.');
    }
  });


  test('should create a community fine', async () => {
    const sessionToken = await logIn();
    const { communityCreateOne: { title, id, posts, author } } = await requestQuery<{ communityCreateOne: CommunitySchema }>(`
    mutation {
      communityCreateOne(title: "Memes"){
        id
        title
        posts {
          id
        }
        author {
          username
        }
      }
    }`, { authorization: sessionToken });
    expect(title).toBe('Memes');
    expect(id).toBeDefined();
    expect(Array.isArray(posts)).toBe(true);
    expect(author.username).toBe('Georgina');
  });

});