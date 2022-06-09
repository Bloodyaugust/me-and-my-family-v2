import { useContext, useEffect, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { DateTime } from 'luxon';
import { createPost, getPosts } from "../api/posts";
import { queryClient } from "../App";
import { sessionContext } from "../session/SessionProvider";
import styles from "./Feed.module.css";

export default function Feed() {
  const { state } = useContext(sessionContext);
  const { data: posts, isLoading: postsLoading } = useQuery('posts', () => getPosts(state.token));
  const { mutate, isSuccess: postSuccess } = useMutation(content => createPost(state.token, content));
  const newPostTextareaRef = useRef();

  useEffect(() => {
    if (postSuccess) {
      queryClient.invalidateQueries('posts');
      newPostTextareaRef.current.value = '';
    }
  }, [postSuccess]);

  if (postsLoading) {
    return <span>Loading posts...</span>
  }

  function onPostClick() {
    mutate(newPostTextareaRef.current.value);
  }

  return (
    <div className={styles.container}>
      <div className={styles['new-post']}>
        <h2>Create new post</h2>
        <textarea ref={newPostTextareaRef} />
        <button onClick={onPostClick} type="button">Post</button>
      </div>
      {posts.map((post) => {
        return (
          <div className={styles.post} key={post.id}>
            <div className={styles['post-header']}>
              <h3>{post.authorId}</h3>
              <span>{DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATETIME_SHORT)}</span>
            </div>
            <p className={styles['post-content']}>{post.content}</p>
          </div>
        )
      })}
    </div>
  )
}
