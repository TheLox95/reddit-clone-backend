import axios from "axios";

export const requestQuery = <T = {}>(query: string, config?: { authorization?: string }): Promise<T> => axios({
  url: 'http://localhost:6060/graphql',
  method: 'post',
  data: { query },
  headers: config ? { authorization: config.authorization } : {}
}).then(r => {
  if (r.data.errors) throw { graphql: r.data.errors };
  return r.data.data as T;
})
  .catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else if (error.graphql) {
      // console.log(JSON.stringify(error.graphql));
      throw error.graphql;
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    throw error;
  });

export const seedUsers = (): Promise<boolean> => requestQuery(`mutation{
  seedUsers
}`);

export const seedCommunities = (): Promise<boolean> => requestQuery(`mutation{
  seedCommunities
}`);

export const seedPosts = (): Promise<boolean> => requestQuery(`mutation{
  seedPosts
}`);

export const seedComments = (): Promise<boolean> => requestQuery(`mutation{
  seedComments
}`);

export const logIn = async (): Promise<string> => {
  const { signIn: { token } } = await requestQuery<{ signIn: { token: string } }>(`
    mutation {
      signIn(login: "Georgina", password: "7baea3d8-ba31-482d-b9ad-42f1ea098850"){
        token
      }
    }`);
  return token;
};