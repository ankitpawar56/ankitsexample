import { Component } from "react";
import { render } from "react-dom";
import "./styles.css";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      data: [],
      orgData: []
    };
  }
  componentDidMount() {}
  getAuth = async () => {
    console.log("password", this.state.username, this.state.password);
    let resp = await fetch(
      "https://asia-south1-cc-dev-sandbox-20200619.cloudfunctions.net/get_login_token",
      {
        method: "post",
        headers: new Headers({
          Authorization:
            "Basic " + btoa(`${this.state.username}:${this.state.password}`),
          "Content-Type": "application/x-www-form-urlencoded"
        }),
        body: "A=1&B=2"
      }
    );
    let token = await resp.json();
    this.setState({ token: token.token }, () => this.getOrg());
  };

  getOrg = async () => {
    console.log("token", this.state.token);
    let resp = await fetch(
      "https://asia-south1-cc-dev-sandbox-20200619.cloudfunctions.net/get_quote_summary",
      { headers: new Headers({ Authorization: `Bearer ${this.state.token}` }) }
    );

    this.setState({ data: await resp.json() });
  };
  getOrgData = async (el) => {
    let postData = { orgs: [el] };
    let resp = await fetch(
      "https://asia-south1-cc-dev-sandbox-20200619.cloudfunctions.net/get_quote_summary",
      {
        method: "post",
        headers: new Headers({
          Authorization: `Bearer ${this.state.token}`,
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(postData)
      }
    );
    let orgData = await resp.json();
    let temp = orgData[el].quoteSummary.result;
    this.setState({ orgData: temp });
  };
  render() {
    return (
      <div className="App">
        {this.state.data.length == 0 && (
          <div>
            Username :
            <input
              type="text"
              onChange={(e) => this.setState({ username: e.target.value })}
              value={this.state.username}
            ></input>
            <div>
              password :
              <input
                type="password"
                onChange={(e) => this.setState({ password: e.target.value })}
                value={this.state.password}
              ></input>
              <button onClick={this.getAuth}>Login</button>
            </div>
          </div>
        )}
        {this.state.orgData.length == 0 &&
          this.state.data?.Listed_Orgnisations?.map((el) => (
            <div onClick={() => this.getOrgData(el)}>{el}</div>
          ))}
        {this.state.orgData?.map((res) => (
          <div>{res.price.exchangeName}</div>
        ))}
      </div>
    );
  }
}
