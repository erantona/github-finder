import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';

import {
  SEARCH_USERS,
  GET_USER,
  CLEAR_USERS,
  GET_REPOS,
  SET_LOADING,
} from '../types';
let githubClintId;
let githubClintSecret;
if (process.env.NODE_ENV !== 'production') {
  githubClintId = process.env.REACT_APP_GITHUB_CLINT_ID;
  githubClintSecret = process.env.REACT_APP_GITHUB_CLINT_SECRET;
} else {
  githubClintId = process.env.GITHUB_CLINT_ID;
  githubClintSecret = process.env.GITHUB_CLINT_SECRET;
}

const GithubState = (props) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };
  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Search Users

  const searchUsers = async (text) => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&clint_id=
      ${githubClintId}&clint_secret=
      ${githubClintSecret}`
    );
    dispatch({
      type: SEARCH_USERS,
      payload: res.data.items,
    });
  };

  // Get User

  const getUser = async (username) => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users/${username}?clint_id=
      ${githubClintId}&clint_secret=
      ${githubClintSecret}`
    );
    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  };

  // Get Repos

  const getUserRepos = async (username) => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=10&sort=created:asc&clint_id=
      ${githubClintId}&clint_secret=
      ${githubClintSecret}`
    );
    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  };

  // Clear Users

  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  // Set Loasing

  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
