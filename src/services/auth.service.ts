import axios from "axios";

const API_URL = 'https://dev.api.newlifez.io/v1.0/api/auth/';

declare let window: any;

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "sign-in", {
        username,
        password
      })
      .then(response => {
        if (response.data.token.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("token", response.data.token.idToken);
        }

        return response.data;
      });
  }

  logout() {
    window.ethereum.disconnect();
    localStorage.removeItem("wallet");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  async connect() {
    const { coin98 } = window;
    const coin98IsInstalled = coin98;
    if (coin98IsInstalled) {
      const chainId = "serenity-testnet-001";
      coin98.connect(chainId).then((accounts : any) => {
        if (accounts && accounts[0]) {
          localStorage.setItem("wallet", accounts[0]);
        } else {
          localStorage.removeItem("wallet");
        }
        window.location.reload();
      }).catch((e: Error) => {
        window.location.reload();
      });
    }
  }
  register(username: string, email: string, password: string, wallet: string) {
    return axios.post(API_URL + "signup", {
      walletAddress: wallet,
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }

  getCurrentWallet() {
    const wallet = localStorage.getItem("wallet");

    if (wallet && window.ethereum.isConnected()) {
      return wallet.toString()
    } else {
      localStorage.removeItem("wallet");
    }

    return undefined;
  }
}

export default new AuthService();
