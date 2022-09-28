import './MovieList.css';
import { Row } from 'antd';
import MovieItem from '../MovieItem/MovieItem';
import { SwapiServiceConsumer } from '../../context/swapi-servers-context';

function MovieList(props) {
  return (
    <div>
      <Row gutter={[24, 16]} justify="space-evenly">
        {props.films.map((film) => (
          <SwapiServiceConsumer key={film.id}>
            {(genresId) => {
              return (
                <MovieItem
                  {...film}
                  guestSessionId={props.guestSessionId}
                  genresIdList={genresId}
                />
              );
            }}
          </SwapiServiceConsumer>
        ))}
      </Row>
    </div>
  );
}
export default MovieList;
