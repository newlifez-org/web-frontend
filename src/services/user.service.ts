import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://dev.api.newlifez.io/v1.0/api/user/';

class UserService {
  getUserProfile() {
    return axios.get(API_URL + "token", { headers: authHeader() });
  }

  getNFTDetail(url: string) {
    return axios.get(url);
  }
}

export default new UserService();
