import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Spinner from "./components/Spinner";
import firebase from "./config/firebase";
import "semantic-ui-css/semantic.min.css";
import rootReducer from "./reducers";

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
  componentDidMount() {
    console.log(this.props.isLoading);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        this.props.setUser(user);
        this.props.history.push("/");
      } else {
        this.props.history.push("/login");
        this.props.clearUser();
      }
    });
  }

  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) =>
      dispatch({
        type: "SET_USER",
        payload: {
          currentUser: user,
        },
      }),
    clearUser: () =>
      dispatch({
        type: "CLEAR_USER",
        payload: {
          currentUser: null,
        },
      }),
  };
};

const mapStatetoProps = (state) => {
  return { isLoading: state.user.isLoading };
};

const RootWithRouter = withRouter(
  connect(mapStatetoProps, mapDispatchToProps)(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithRouter />
    </Router>
  </Provider>,
  document.getElementById("root")
);
