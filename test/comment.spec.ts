import { requestQuery, seedUsers, logIn, seedPosts, seedCommunities } from "./util";
import { CommentSchema } from "../src/models/Comment";
import { PostSchema } from "../src/models/Post";
import { CommunitySchema } from "../src/models/Community";

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
          commentCreateOne(body: "# interesting", postId: "5e4f2f3b3dd225ee0808615e", rootPostId: "5e502c15e40e3b343a93d0a3"){
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
      await seedCommunities();
      const token = await logIn();

      await requestQuery<{ commentCreateOne: CommentSchema[] }>(`
        mutation{
          commentCreateOne(body: "# interesting", postId: "111f2f3b3dd225ee0808615e", rootPostId: "5e502c15e40e3b343a93d0a3"){
            body
          }
        }`, { authorization: token });
    } catch (errors) {
      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe('Post does not exist.');
    }
  });

  test('should fail if postId and commentId are pass at the same time', async () => {
    try {
      await seedUsers();
      const token = await logIn();

      await requestQuery<{ commentCreateOne: CommentSchema[] }>(`
        mutation{
          commentCreateOne(body: "# interesting", postId: "111f2f3b3dd225ee0808615e", commentId: "55", rootPostId: "5e502c15e40e3b343a93d0a3"){
            body
          }
        }`, { authorization: token });
    } catch (errors) {
      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe('Cannot pass Post id and Comment ID at the same time.');
    }
  });

  test('should create a comment for a post fine', async () => {
    await seedCommunities();
    const token = await logIn();

    const { communities } = await requestQuery<{ communities: CommunitySchema[] }>(`{
      communities{ posts{id} }
    }`);

    const postToComment = communities[0].posts[0];

    const { commentCreateOne: { id: commentId, body, post, rootPost, author: { id } } } = await requestQuery<{ commentCreateOne: CommentSchema }>(`
      mutation{
        commentCreateOne(body: "# super interesting", postId: "${postToComment.id}", rootPostId: "${postToComment.id}"){
          body
          id
          post
          rootPost
          author{
            id
            username
          }
        }
      }`, { authorization: token });
    expect(body).toBe('# super interesting');
    expect(id).toBeTruthy();
    expect(post).toBe(postToComment.id);
    expect(rootPost).toBe(postToComment.id);

    const { post: commentedPost } = await requestQuery<{ post: PostSchema }>(`{
      post(id: "${postToComment.id}"){
        comments{
          id
          body
        }
      }
    }`);

    expect(commentedPost.comments.find(c => c.id === commentId).body).toBe('# super interesting');
  });

  test('should fail to create comment if comment does not exist', async () => {
    try {
      await seedUsers();
      const token = await logIn();

      await requestQuery<{ commentCreateOne: CommentSchema[] }>(`
        mutation{
          commentCreateOne(body: "# interesting", commentId: "5e50b1a262bdfd781c1f1537", rootPostId: "5e502c15e40e3b343a93d0a3"){
            body
          }
        }`, { authorization: token });
    } catch (errors) {
      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe('Comment does not exist.');
    }
  });

  test('should create a comment for another comment fine', async () => {
    await seedCommunities();
    const token = await logIn();

    const { communities } = await requestQuery<{ communities: CommunitySchema[] }>(`{
      communities{ posts{id comments {id} } }
    }`);

    const rootPost = communities[0].posts[0];

    const { commentCreateOne: { id: newCommentId, body, author: { id: authorId } } } = await requestQuery<{ commentCreateOne: CommentSchema }>(`
      mutation{
        commentCreateOne(body: "# more interesting", commentId: "${rootPost.comments[0].id}", rootPostId: "${rootPost.id}"){
          body
          id
          author{
            id
          }
          post
        }
      }`, { authorization: token });
    expect(body).toBe('# more interesting');
    expect(authorId).toBe('5e4df9081e529ebd9207cddc');

    const { post: { comments } } = await requestQuery<{ post: PostSchema }>(`{
        post(id: "${rootPost.id}"){
          comments{
            id
            comments{
              id
              body
            }
          }
        }
      }`);

    const rootComment = comments.find(c => c.id === rootPost.comments[0].id);
    expect(rootComment.comments.find(c => c.id === newCommentId).body).toBe("# more interesting");
  });

  test('should return sub comments for a comment', async () => {
    await seedCommunities();
    const sessionToken = await logIn();

    const { communities } = await requestQuery<{ communities: CommunitySchema[] }>(`{
      communities{
        posts{
          id,
          comments{
            id
            comments{
              id
            }
          }
        }
      }
    }`);

    const { comment } = await requestQuery<{ comment: CommentSchema }>(`{
        comment(id: "${communities[0].posts[0].comments.find(c => c.comments.length !== 0).id}"){
        body
        comments{
          id
        }
      }
    }`, { authorization: sessionToken });

    expect(comment.comments.length).toBeGreaterThan(0);

  });
});