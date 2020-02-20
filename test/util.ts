import axios from "axios";

type Result<T> = { data: T | null; errors: { message: string }[]};

export const requestQuery = <T = {}>(query: string): Promise<Result<T>> => axios({
  url: 'http://localhost:6060/graphql',
  method: 'post',
  data: { query }
}).then(r => (r.data as Result<T>))
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
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    throw error;
  });

export const seedUsers = (): Promise<Result<boolean>> => requestQuery(`mutation{
        seedUsers
      }`);