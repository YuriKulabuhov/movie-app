export const GET_GENRE_ID = async () => {
  const result = await fetch(
    'https://api.themoviedb.org/3/genre/movie/list?api_key=5bb302c89cc93b527bf971f01fac8160&language=en-US'
  );
  const body = result.json();
  return body;
};
export const GET_SEARCH_START = async (searchValue, numberPage) => {
  const result = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=5bb302c89cc93b527bf971f01fac8160&query=${searchValue}&page=${numberPage}`
  );
  const body = result.json();
  return body;
};
export const GET_RATED_MOVIES = async (guestSessionId) => {
  const result = await fetch(
    `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=5bb302c89cc93b527bf971f01fac8160&language=en-US&sort_by=created_at.asc`
  );
  const body = result.json();
  return body;
};
export const POST_RATE_MOVIE = async (movieId, guestSessionId, bodyCount) => {
  const result = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=5bb302c89cc93b527bf971f01fac8160&guest_session_id=${guestSessionId}`,
    {
      method: 'POST',
      body: JSON.stringify(bodyCount),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const res = result.json();
  return res;
};
export const START_GUESTSESSION = async () => {
  const result = await fetch(
    'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=5bb302c89cc93b527bf971f01fac8160'
  );
  const body = result.json();
  return body;
};
