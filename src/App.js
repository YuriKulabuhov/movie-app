import './App.css';

import Header from './components/Header/Header';

import MovieList from './components/MovieList/MovieList';

import { Component } from 'react';

import { Spin, Alert, Pagination } from 'antd';

import NetworkDetector from './components/Hoc/NetworkDetector';

import { SwapiServiceProvider } from './context/swapi-servers-context';

import {
  GET_GENRE_ID,
  GET_RATED_MOVIES,
  GET_SEARCH_START,
  START_GUESTSESSION,
} from './services/index';

class App extends Component {
  state = {
    searchValue: 'return',

    guestSessionId: null,

    tabActive: 'search',

    films: [],

    ratedFilms: [],

    genresId: [],

    numberPage: 1,

    totalPages: 1,

    isLoaded: true,

    error: false,
  };

  componentDidMount() {
    GET_GENRE_ID().then(
      (body) => {
        this.setState({
          genresId: body.genres,
        });
      },

      (error) => {
        this.setState({
          error,
        });
      }
    );

    GET_SEARCH_START(this.state.searchValue, this.state.numberPage).then(
      (body) => {
        this.setState({
          films: body.results,

          isLoaded: false,

          totalPages: body.total_pages,
        });
      },

      (error) => {
        this.setState({
          isLoaded: false,

          error,
        });
      }
    );

    START_GUESTSESSION().then(
      (result) => {
        this.setState({
          guestSessionId: result.guest_session_id,
        });
      },

      (error) => {
        this.setState({
          error,
        });
      }
    );
  }

  changeTab = (key) => {
    switch (key) {
      case 'rated':
        GET_RATED_MOVIES(this.state.guestSessionId).then((result) =>
          this.setState({
            ratedFilms: result.results,

            tabActive: 'rated',
          })
        );

        return false;

      case 'search':
        this.setState({
          tabActive: 'search',
        });

        return true;

      default:
        break;
    }
  };

  changeResults = (searchText, numberPage = 1) => {
    this.setState({
      isLoaded: true,

      numberPage,
    });

    GET_SEARCH_START(searchText, numberPage).then(
      (result) => {
        this.setState({
          films: result.results,

          isLoaded: false,

          totalPages: result.total_pages,
        });
      },

      (error) => {
        this.setState({
          isLoaded: false,

          error,
        });
      }
    );
  };

  selectNumberPage = (page) => {
    this.setState({
      numberPage: page,

      isLoaded: true,
    });

    GET_SEARCH_START(this.state.searchValue, page).then(
      (result) => {
        this.setState({
          films: result.results,

          isLoaded: false,
        });
      },

      (error) => {
        this.setState({
          isLoaded: false,

          error,
        });
      }
    );
  };

  handlerSearchValue = (currentValue) => {
    this.setState({
      searchValue: currentValue,
    });
  };

  render() {
    return (
      <SwapiServiceProvider value={this.state.genresId}>
        <div className="App">
          {this.state.error ? (
            <Alert
              message="ERROR"
              description="There is no connection with the server "
              showIcon
              type="error"
            />
          ) : (
            <div>
              <Header
                changeResults={this.changeResults}
                handlerSearchValue={this.handlerSearchValue}
                changeTab={this.changeTab}
                tabActive={this.state.tabActive}
                emptyRatedFilms={this.state.ratedFilms.length === 0}
              />

              {this.state.isLoaded ? (
                <Spin size="large" />
              ) : this.state.films.length === 0 ? (
                <Alert message="No results" banner type="info" />
              ) : (
                <MovieList
                  films={
                    this.state.tabActive === 'rated' ? this.state.ratedFilms : this.state.films
                  }
                  guestSessionId={this.state.guestSessionId}
                />
              )}

              {this.state.isLoaded || this.state.tabActive === 'rated' ? null : (
                <Pagination
                  defaultCurrent={this.state.numberPage}
                  total={this.state.totalPages}
                  onChange={(page) => {
                    this.selectNumberPage(page);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </SwapiServiceProvider>
    );
  }
}

export default NetworkDetector(App);
