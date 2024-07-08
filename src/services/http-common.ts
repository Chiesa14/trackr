import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import {useNavigation} from '@react-navigation/core';

export const domain = "https://wz2myhsz9d.execute-api.af-south-1.amazonaws.com/dev";
const navigation = useNavigation();

const http = axios.create({
  baseURL: `${domain}/api/v1`,
  headers: { 
    'Content-Type': 'application/json'
  },
});



http.interceptors.request.use(
  async function (config: any) {
    const { idToken } = (await fetchAuthSession()).tokens??{}
    if (idToken) config.headers.Authorization = `Bearer ${idToken.toString()}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  function (response) {
    return Promise.resolve(response)
  },
  function (error) {
    let res = error.response;
    if (res?.data && res.data.message === "Unauthorized")
      navigation.navigate('Login' as never);

    return Promise.reject(error);
  }
)

export default http;
