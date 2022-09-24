import './App.css';
import Header from './components/Header/Header';
import MovieList from './components/MovieList/MovieList';
import { Component } from 'react';
import { Spin, Alert, Pagination } from 'antd';
import NetworkDetector from './components/Hoc/NetworkDetector';
import { SwapiServiceProvider } from './context/swapi-servers-context';

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
    fetch(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=5bb302c89cc93b527bf971f01fac8160&language=en-US'
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            genresId: result.genres,
          });
        },
        (error) => {
          this.setState({
            error,
          });
        }
      );
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=5bb302c89cc93b527bf971f01fac8160&query=${this.state.searchValue}&page=${this.state.numberPage}`
    )
      .then((res) => res.json())
      .then(
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
    fetch(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=5bb302c89cc93b527bf971f01fac8160'
    )
      .then((res) => res.json())
      .then(
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
        fetch(
          `https://api.themoviedb.org/3/guest_session/${this.state.guestSessionId}/rated/movies?api_key=5bb302c89cc93b527bf971f01fac8160&language=en-US&sort_by=created_at.asc`
        )
          .then((res) => res.json())
          .then((result) =>
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
      numberPage: numberPage,
    });
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=5bb302c89cc93b527bf971f01fac8160&query=${searchText}&page=${numberPage}`
    )
      .then((res) => res.json())
      .then(
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
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=5bb302c89cc93b527bf971f01fac8160&query=${this.state.searchValue}&page=${page}`
    )
      .then((res) => res.json())
      .then(
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
                <Alert message="No results" banner={true} type="info" />
              ) : (
                <MovieList
                  films={
                    this.state.tabActive === 'rated'
                      ? this.state.ratedFilms
                      : this.state.films
                  }
                  guestSessionId={this.state.guestSessionId}
                />
              )}
              {this.state.isLoaded ||
              this.state.tabActive === 'rated' ? null : (
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
