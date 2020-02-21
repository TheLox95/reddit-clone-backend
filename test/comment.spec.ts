import { requestQuery, seedUsers, logIn, seedPosts, seedCommunities } from "./util";
import { CommentSchema } from "../src/models/Comment";

describe('community', () => {

  beforeEach(async () => {
    await requestQuery(`
      mutation{
          resetDB
        }
      `);
  });

  test('should fail to create comment if user is not logged', async () => {
    try {
      await requestQuery<{ commentCreateOne: CommentSchema[] }>(`
        mutation{
          commentCreateOne(body: "# interesting", postId: "5e4f2f3b3dd225ee0808615e"){
            body
          }
        }`);
    } catch (errors) {
      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe('Not authenticated.');
    }
  });

  test('should fail to create comment if post does not exist', async () => {
    try {
      await seedUsers();
      await seedPosts();
      const token = await logIn();

      await requestQuery<{ commentCreateOne: CommentSchema[] }>(`
        mutation{
          commentCreateOne(body: "# interesting", postId: "111f2f3b3dd225ee0808615e"){
            body
          }
        }`, { authorization: token });
    } catch (errors) {
      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe('Post does not exist.');
    }
  });

  test('should create a comment fine', async () => {
    await seedUsers();
    await seedCommunities();
    await seedPosts();
    const token = await logIn();

    const { commentCreateOne: { body, post, author: { id} } } = await requestQuery<{ commentCreateOne: CommentSchema }>(`
      mutation{
        commentCreateOne(body: "# interesting", postId: "5e502c15e40e3b343a93d0a3"){
          body
          author{
            id
            username
          }
          post
        }
      }`, { authorization: token });
      expect(body).toBe('# interesting');
      expect(id).toBe('5e4df9081e529ebd9207cddc');
      expect(post).toBe('5e502c15e40e3b343a93d0a3');
  });

});