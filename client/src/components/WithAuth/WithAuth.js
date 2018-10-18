import React, { Component } from "react";
import AuthService from "../AuthService/AuthService";
import API from "../../utils/API";

export default function WithAuth(AuthComponent) {
  const Auth = new AuthService();
  return class AuthWrapped extends Component {
    constructor() {
      super();
      this.state = {
        user: null
      };
    }

    componentWillMount() {
      if (!Auth.loggedIn()) {
        this.props.history.replace("/login");
      } else {
        try {
          const profile = Auth.getProfile();

          API.getLocation()
            .then(response => {
              const location = {
                address: {
                  city: response.data.city,
                  state: response.data.region_name,
                  country: response.data.country_code
                },
                coords: {
                  latitude: response.data.latitude,
                  longitude: response.data.longitude
                }
              };
              profile.location = location;
              this.setState({ user: profile });
            })
            .catch(error => console.log(error));
        } catch (error) {
          Auth.logout();
          this.props.history.replace("/login");
        }
      }
    }

    render() {
      if (this.state.user) {
        return (
          <AuthComponent history={this.props.history} user={this.state.user} />
        );
      } else {
        return null;
      }
    }
  };
}
