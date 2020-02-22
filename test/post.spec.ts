import { requestQuery, seedUsers, seedCommunities, logIn } from "./util";
import { PostSchema } from "../src/models/Post";

describe('community', () => {

  beforeEach(async () => {
    await requestQuery(`
      mutation{
          resetDB
        }
      `);
    await seedUsers();
    await seedCommunities();
  });

  test('should fail to create post if user is not logged', async () => {
    try {
      await requestQuery<{ commentCreateOne: PostSchema[] }>(`
        mutation{
          postCreateOne(title: "I draw today!", body: "Post your draw here", communityId: "5e4f2f3b00943506b5030f13"){
            body
          }
        }`);
    } catch (errors) {
      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe('Not authenticated.');
    }
  });

  test('should fail to create post if community does not exist', async () => {
    try {
      const token =  await logIn();
      await requestQuery<{ commentCreateOne: PostSchema[] }>(`
        mutation{
          postCreateOne(title: "I draw today!", body: "Post your draw here", communityId: "004f2f3b00943506b5030f13"){
            body
          }
        }`, { authorization: token });
    } catch (errors) {
      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe('Community does not exist.');
    }
  });


  test('should create post with valid data', async () => {
    const token =  await logIn();
      const { postCreateOne: { body, community, author: { id } } } = await requestQuery<{ postCreateOne: PostSchema }>(`
        mutation{
          postCreateOne(title: "I draw today!", body: "Post your draw here", communityId: "5e4f2f3b00943506b5030f13"){
            body
            author{
              id
            }
            community
          }
        }`, { authorization: token });
      
      expect(body).toBe("Post your draw here");
      expect(community).toBe("5e4f2f3b00943506b5030f13");
      expect(id).toBe("5e4df9081e529ebd9207cddc");
  });


});