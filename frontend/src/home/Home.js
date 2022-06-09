import { useContext } from "react";
import { useQuery } from "react-query";
import { getCurrentUser } from "../api/session";
import { sessionContext } from "../session/SessionProvider";

function Home() {
  const { state } = useContext(sessionContext);
  const { data: currentUser, isLoading: loadingUser } = useQuery('currentUser', () => getCurrentUser(state.token));

  if (loadingUser) {
    return <span>Loading user...</span>
  }

  return (
    <span>Hello {currentUser.name}!</span>
  )
}

export default Home;
