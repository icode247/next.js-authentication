"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function PostPage({ params }) {
  const { data: session, status } = useSession();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      if (!params.postId) return;

      try {
        const res = await fetch(`/api/posts/${params.postId}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      }
    }

    if (status === "authenticated") {
      fetchPost();
    }
  }, [params.postId, status]);

  const handleEdit = async () => {
    if (!params.postId) return;

    try {
      const res = await fetch(`/api/posts/${params.postId}`, { method: 'PUT' });
      if (!res.ok) throw new Error('Failed to update');
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === "loading") return <p>Loading session...</p>;
  if (status === "unauthenticated") return <p>Please sign in</p>;
  if (error) return <p>Error: {error}</p>;
  if (!post) return <p>Loading post...</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <button onClick={handleEdit}>Edit Post</button>
    </div>
  );
}