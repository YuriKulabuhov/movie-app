const API_KEY = '5bb302c89cc93b527bf971f01fac8160';
const LANG_SETT = 'en-US';

export const getGenreId = async () => {
  const result = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=${LANG_SETT}`
  );
  const body = result.json();
  return body;
};
export const getSearchStart = async (searchValue, numberPage) => {
  const result = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchValue}&page=${numberPage}`
  );
  const body = result.json();
  return body;
};
export const getRatedMovies = async (guestSessionId) => {
  const result = await fetch(
    `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${API_KEY}&language=${LANG_SETT}&sort_by=created_at.asc`
  );
  const body = result.json();
  return body;
};
export const postRateMovie = async (movieId, guestSessionId, bodyCount) => {
  const result = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionId}`,
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
export const startGuestSession = async () => {
  const result = await fetch(
    `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}`
  );
  const body = result.json();
  return body;
};
