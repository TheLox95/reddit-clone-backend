import { requestQuery, seedUsers, seedCommunities, logIn } from "./util";
import { PostSchema } from "../src/models/Post";

describe('community', () => {

  beforeEach(async () => {
    await requestQuery(`
      mutation{
          resetDB
        }
      `);
    await seedCommunities();
  });

  test('should return 10 posts by default', async () => {
    const { posts } = await requestQuery<{ posts: PostSchema[] }>(`{
          posts{
              title
              author{
                id
              }
              comments{
                id
              }
            }
          }
        `);
    expect(posts.length).toBe(10);
    expect(posts[0].author.id).toBeTruthy();
    expect(posts[0].comments[0].id).toBeTruthy();
  });

  test('should return one post', async () => {
    const { posts } = await requestQuery<{ posts: PostSchema[] }>(`{
      posts{ id }
    }`);
    const sessionToken = await logIn();
    const { post: postA } = await requestQuery<{ post: PostSchema }>(`{
      post(id: "${posts[0].id}"){
        title
        author{
          id
        }
        comments{
          id
        }
      }
    }`, { authorization: sessionToken });

    expect(postA.title).toBeTruthy();
    expect(postA.author.id).toBeTruthy();
    expect(postA.comments[0].id).toBeTruthy();

    const { post: postB } = await requestQuery<{ post: PostSchema }>(`{
      post(id: "${posts[0].id}"){
        title
        author{
          id
        }
        comments{
          id
        }
      }
    }`);

    expect(postB.title).toBeTruthy();
    expect(postB.author.id).toBeTruthy();
    expect(postB.comments[0].id).toBeTruthy();
  });

  test('should return 4 posts', async () => {
    const { posts } = await requestQuery<{ posts: PostSchema[] }>(`{
      posts(limit: 4){
              title
            }
          }
        `);
    expect(posts.length).toBe(4);
  });

  test('should return 6 post starting from Fifth user', async () => {
    const { posts } = await requestQuery<{ posts: PostSchema[] }>(`{
      posts(limit: 6, offset: 4){
        title
        author{
          id
        }
        comments{
          id
        }
      }
    }`);
    expect(posts.length).toBe(6);
    expect(posts[0].author.id).toBeTruthy();
    expect(posts[0].comments[0].id).toBeTruthy();
  });

  test('should return 6 post starting from Fifth user', async () => {
    const { posts } = await requestQuery<{ posts: PostSchema[] }>(`{
      posts(offset: 500){
        title
        author{
          id
        }
        comments{
          id
        }
      }
    }`);
    expect(posts.length).toBe(0);
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
      const token = await logIn();
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
    const token = await logIn();
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