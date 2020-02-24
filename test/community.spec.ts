import { requestQuery, logIn, seedCommunities } from "./util";
import { CommunitySchema } from "../src/models/Community";

describe('community', () => {

  beforeEach(async () => {
    await requestQuery(`
      mutation{
          resetDB
        }
      `);
    await seedCommunities();
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

  test('should return 10 communities by default', async () => {
    const { communities } = await requestQuery<{ communities: CommunitySchema[] }>(`{
      communities{
          title
          author{
            id
          }
          posts{
            id
          }
        }
      }
    `);
    expect(communities.length).toBe(10);
    expect(communities[0].author.id).toBeTruthy();
    expect(communities[0].posts[0].id).toBeTruthy();
  });

  test('should return one community', async () => {
    const sessionToken = await logIn();
    const { community: { title: titleA } } = await requestQuery<{ community: CommunitySchema }>(`{
      community(id: "5e4f2f3bd5d49e19968df7c7"){
        title
        author{
          id
        }
        posts{
          id
        }
      }
    }`, { authorization: sessionToken });

    expect(titleA).toBe('minim adipisicing');

    const { community: { title: titleB } } = await requestQuery<{ community: CommunitySchema }>(`{
      community(id: "5e4f2f3b9fb4c6240f8c240e"){
        title
        author{
          id
        }
        posts{
          id
        }
      }
    }`);

    expect(titleB).toBe('cupidatat id');
  });

  test('should return 4 communities', async () => {
    const { communities } = await requestQuery<{ communities: CommunitySchema[] }>(`{
            communities(limit: 4){
              title
            }
          }
        `);
    expect(communities.length).toBe(4);
  });

  test('should return 6 communities starting from Fifth user', async () => {
    const { communities  } = await requestQuery<{ communities: CommunitySchema[] }>(`{
      communities(limit: 6, offset: 4){
              title
            }
          }
        `);
    expect(communities.length).toBe(6);
    expect(communities[0].title).toBe('voluptate occaecat');
    expect(communities[communities.length - 1].title).toBe('aute labore');
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