import { useContext } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../api/session";
import Feed from "../feed/Feed";
import { sessionContext } from "../session/SessionProvider";
import styles from "./Home.module.css";

function Home() {
  const { state } = useContext(sessionContext);
  const { data: currentUser, isLoading: loadingUser } = useQuery('currentUser', () => getCurrentUser(state.token));

  if (loadingUser) {
    return <span>Loading user...</span>
  }

  return (
    <div className={styles.container}>
      <Link to={`/profile/${currentUser.id}`}>My Profile</Link>
      <Feed />
    </div>
  )
}

export default Home;
