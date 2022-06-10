import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { getProfile } from "../api/profile";

export default function Profile() {
  const { data: profile, isLoading: profileLoading } = useQuery('profile', () => getProfile());

  if (profileLoading) {
    return <span>Loading...</span>
  }

  return (
    <div>
      <Link to="/">Home</Link>
      <p>{profile.bio}</p>
    </div>
  );
}
