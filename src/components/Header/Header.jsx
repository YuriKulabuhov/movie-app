import './Header.css';
import { Input, Menu, Alert } from 'antd';
import { Component } from 'react';
const _ = require('lodash');

export default class Header extends Component {
  state = {
    searchValue: '',
  };
  componentDidUpdate(prevProps, prevState) {
    const debounced = _.debounce(this.props.changeResults, 3000, {
      leading: false,
      trailing: true,
    });
    if (prevState !== this.state && this.state.searchValue.trim().length !== 0)
      debounced(this.state.searchValue);
  }
  changeSearching = (event) => {
    this.setState({
      searchValue: event.target.value,
    });
    this.props.handlerSearchValue(event.target.value);
  };
  render() {
    const menuItems = [
      {
        key: 'search',
        label: 'Search',
      },
      {
        key: 'rated',
        label: 'Rated',
      },
    ];
    return (
      <header className="header">
        <h1>Movie-App</h1>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['search']}
          items={menuItems}
          onSelect={({ key }) => this.props.changeTab(key)}
        ></Menu>
        {this.props.tabActive !== 'rated' ? (
          <Input
            placeholder="What are we going to watch?"
            size="large"
            value={this.state.searchValue}
            onChange={this.changeSearching}
          />
        ) : this.props.emptyRatedFilms ? (
          <Alert message="No results" banner={true} type="info" />
        ) : null}
      </header>
    );
  }
}
