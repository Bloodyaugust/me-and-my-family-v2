import { createContext, useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const defaultState = {
  token: '',
};

export const sessionContext = createContext(defaultState);

export function SessionProvider(props) {
  const [state, setState] = useState(defaultState);
  const inLogin = useMatch('/login');
  const navigate = useNavigate();

  function setToken(token) {
    setState({
      ...state,
      token,
    });
  }

  useEffect(() => {
    if (!state.token && !inLogin) {
      navigate('/login', { replace: true });
    }
  }, [state.token, inLogin]);

  return (
    <sessionContext.Provider value={
      {
        state,
        setToken,
      }
    }>
      {props.children}
    </sessionContext.Provider>
  )
}
