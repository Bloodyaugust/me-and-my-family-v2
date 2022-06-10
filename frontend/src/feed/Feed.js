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
  const { mutate, isSuccess: postSuccess } = useMutation(formData => createPost(state.token, formData));
  const newPostTextareaRef = useRef();
  const newPostImagesRef = useRef();

  useEffect(() => {
    if (postSuccess) {
      queryClient.invalidateQueries('posts');
      newPostTextareaRef.current.value = '';
      newPostImagesRef.current.value = '';
    }
  }, [postSuccess]);

  if (postsLoading) {
    return <span>Loading posts...</span>
  }

  function onPostClick() {
    const formData = new FormData();

    formData.append('content', newPostTextareaRef.current.value);
    [...newPostImagesRef.current.files].forEach((file) => {
      formData.append('images', file);
    });

    mutate(formData);
  }

  return (
    <div className={styles.container}>
      <div className={styles['new-post']}>
        <h2>Create new post</h2>
        <form className={styles['post-form']} encType="multipart/form-data">
          <textarea placeholder="Share your words!" ref={newPostTextareaRef} />
          <label htmlFor="images">Upload Images</label>
          <input accept="image/png, image/jpeg" id="images" multiple name="images" ref={newPostImagesRef} type="file" />
          <button onClick={onPostClick} type="button">Post</button>
        </form>
      </div>
      {posts.map((post) => {
        return (
          <div className={styles.post} key={post.id}>
            <div className={styles['post-header']}>
              <h3>{post.authorId}</h3>
              <span>{DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATETIME_SHORT)}</span>
            </div>
            <p className={styles['post-content']}>{post.content}</p>
            <div className={styles['post-images']}>
              {post.images.map((image) => {
                return <img src={image.url} key={image.id} />
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
