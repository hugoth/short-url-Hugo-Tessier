import React, { Component, createContext } from "react";
import axios from "axios";

const { Consumer, Provider } = createContext();

class ContextUrl extends Component {
  state = {
    urls: null,
    url: "",
    result: null
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({
      url: e.target.value
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    await axios
      .post("http://localhost:3003/url/create", {
        url: this.state.url
      })
      .then(response => {
        const listUrl = [...this.state.urls];
        const newUrl = {
          original: response.data.original,
          shorten: response.data.shorten,
          visits: 0
        };
        listUrl.push(newUrl);
        this.setState({ urls: listUrl, result: 200 });
      })
      .catch(error => {
        this.setState({ result: error.response.status });
      });
  };

  render() {
    return (
      <Provider
        value={{
          urls: this.state.urls,
          handleChange: this.handleChange,
          handleSubmit: this.handleSubmit,
          result: this.state.result
        }}
      >
        {this.props.children}
      </Provider>
    );
  }

  async componentDidMount() {
    const response = await axios.get("http://localhost:3003/url");
    this.setState({ urls: response.data });
  }
}
export default {
  Provider: ContextUrl,
  Consumer
};
