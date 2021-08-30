import { GiphyFetch } from "@giphy/js-fetch-api";
import {
  getValueFromSessionStorage,
  setValueToSessionStorage,
} from "../utils/sessionStorage";

/**
 * 응답 예제는 아래 링크에서 참고
 * https://developers.giphy.com/explorer/#explorer
 */
const gf = new GiphyFetch(process.env.GIPHY_API_KEY);
const DEFAULT_FETCH_COUNT = 16;
const TRENDING_GIF_API = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&limit=${DEFAULT_FETCH_COUNT}&rating=g`;

const formatResponse = (gifList) => {
  return gifList.map((gif) => {
    return {
      id: gif.id,
      title: gif.title,
      imageUrl: gif.images.original.url,
    };
  });
};

export const fetchTrendingGifs = async () => {
  const memoizedTrendingGifs = getValueFromSessionStorage("trendingGifs");

  if (memoizedTrendingGifs) {
    return memoizedTrendingGifs;
  }

  const newTrendingGifs = await fetch(TRENDING_GIF_API)
    .then((response) => response.json())
    .then((gifs) => gifs.data)
    .then(formatResponse)
    .catch((e) => {
      return [];
    });

  setValueToSessionStorage("trendingGifs", newTrendingGifs);

  return newTrendingGifs;
};

export const fetchGifsByKeyword = (keyword, page = 0) => {
  const offset = page * DEFAULT_FETCH_COUNT;

  return gf
    .search(keyword, { limit: DEFAULT_FETCH_COUNT, lang: "en", offset })
    .then((gifs) => gifs.data)
    .then(formatResponse)
    .catch((e) => {
      return [];
    });
};
