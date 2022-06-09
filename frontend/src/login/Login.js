import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../api/session";
import { queryClient } from "../App";
import { sessionContext } from "../session/SessionProvider";

function Login () {
  const { setToken } = useContext(sessionContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const loginEmailRef = useRef();
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('token')) {
      setToken(searchParams.get('token'));
      setSearchParams({});
      queryClient.invalidateQueries('currentUser');
      navigate('/', { replace: true });
    }
  }, []);

  if (searchParams.get('token')) {
    return (
      <span>Logging you in...</span>
    )
  }

  async function onLoginEmailClicked() {
    const { data } = await login(loginEmailRef.current.value);
    setLoginMessage(data.message);
  }

  return (
    <div>
      <label htmlFor="login-email">Login Email</label>
      <input id="login-email" type="text" ref={loginEmailRef} />
      <button type="button" onClick={onLoginEmailClicked}>Get Login Link</button>
      <span>{loginMessage}</span>
    </div>
  )
}

export default Login;
