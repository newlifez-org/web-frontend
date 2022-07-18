import { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import IUser from './types/user.type';

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";

import EventBus from "./common/EventBus";

declare let window: any;

type Props = {};

type State = {
  walletAddress: String | undefined
  currentUser: IUser | undefined
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      walletAddress: undefined,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    let wallet = AuthService.getCurrentWallet();

    if (user && wallet && wallet !== undefined) {
      this.setState({
        walletAddress: wallet,
        currentUser: user,
      });
    }

    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
      walletAddress: undefined,
    });
  }
  connect() {
    AuthService.connect();
  }

  render() {

    const { currentUser, walletAddress } = this.state;

    return (
      <div id="home">
        <nav className="navbar navbar-expand navbar-light">
          <Link to={"/"} className="navbar-brand nav-logo">
            <img src="./assets/images/logo.png" />
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/"} className="nav-link">
                New Life Z
              </Link>
            </li>

          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link" id="address-wallet">
                  {walletAddress}
                </Link>
              </li>
              
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  Log out
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              {walletAddress && walletAddress !== 'undefined' ? (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/login"} className="nav-link">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={"/register"} className="nav-link">
                      Sign Up
                    </Link>
                  </li>
                </div>
              ) : (
                <li className="nav-item">
                  <button className="btn btn-outline-success" onClick={this.connect}>
                    Connect
                  </button>
                </li>
              )}
            </div>
          )}
          
        </nav>

        <div className="container">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
          </Switch>
        </div>

      </div>
    );
  }
}

export default App;
