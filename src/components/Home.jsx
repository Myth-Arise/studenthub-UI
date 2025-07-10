/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Loader from './Loader';

const Home = () => {
    const [loader, setLoader] = useState(false);
    const [posts, setposts] = useState([]);
    const [comments, setComments] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [addingComment, setAddingComment] = useState(false);
    const [showAddComment, setShowAddComment] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);
    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const [newPost, setNewPost] = useState({
        type: "",
        title: "",
        content: "",
        tags: "",
        file: null
    });
    const [addingPost, setAddingPost] = useState(false);

    // For swipe gesture
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    const fetchPosts = async () => {
        try {
            setLoader(true);
            const url = `${import.meta.env.VITE_SH_BE_URI}api/v1/posts`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setposts(response.data.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchComments = async (postId) => {
        setLoader(true);
        try {
            const url = `${import.meta.env.VITE_SH_BE_URI}api/v1/posts/${postId}/comments`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                    "Content-Type": "application/json"
                }
            });
            setComments(response.data.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]);
        } finally {
            setLoader(false);
        }
    };

    const handleView = async (post) => {
        setSelectedPost(post);
        await fetchComments(post.post_id || post._id);
        setShowModal(true);
        setShowAddComment(false);
        setNewComment("");
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPost(null);
        setComments([]);
        setNewComment("");
        setShowAddComment(false);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setAddingComment(true);
        try {
            const postId = selectedPost.post_id || selectedPost._id;
            const url = `${import.meta.env.VITE_SH_BE_URI}api/v1/comments/create`;
            const response = await axios.post(
                url,
                { post_id: postId, content: newComment },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        "Content-Type": "application/json"
                    }
                }
            );
            setComments((prev) => [...prev, response.data.data]);
            setNewComment("");
            setShowAddComment(false);
        } catch (error) {
            alert("Failed to add comment.");
        } finally {
            setAddingComment(false);
        }
    };

    // New Post Handlers
    const handleNewPostChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            setNewPost((prev) => ({ ...prev, file: files[0] }));
        } else {
            setNewPost((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleNewPostSubmit = async (e) => {
        e.preventDefault();
        setAddingPost(true);
        try {
            const formData = new FormData();
            formData.append("type", newPost.type);
            formData.append("title", newPost.title);
            formData.append("content", newPost.content);
            // Convert comma-separated tags to list
            if (newPost.tags) {
                const tagsList = newPost.tags.split(",").map(tag => tag.trim()).filter(Boolean);
                formData.append("tags", JSON.stringify(tagsList));
            }
            if (newPost.file) {
                formData.append("file", newPost.file);
            }
            const url = `${import.meta.env.VITE_SH_BE_URI}api/v1/posts/create`;
            const response = await axios.post(url, formData, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                    "Content-Type": "multipart/form-data"
                }
            });
            // Refetch posts to update the list with the new post
            await fetchPosts();
            setShowNewPostModal(false);
            setNewPost({ type: "", title: "", content: "", tags: "", file: null });
            setSlideIndex(0);
        } catch (error) {
            alert("Failed to add post.");
        } finally {
            setAddingPost(false);
        }
    };

    // Slide navigation handlers
    const handlePrev = () => {
        setSlideIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSlideIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
    };

    // Touch handlers for mobile swipe
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const diff = touchStartX.current - touchEndX.current;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swiped left
                    handleNext();
                } else {
                    // Swiped right
                    handlePrev();
                }
            }
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    const PostSlide = ({ post, onView }) => (
        <div
            className="post-slide-wrapper"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <button
                className="btn btn-outline-secondary d-none d-md-block"
                style={{
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    fontSize: 20,
                    marginRight: 16
                }}
                onClick={handlePrev}
                aria-label="Previous"
            >
                &#8592;
            </button>
            <Card
                className="mb-4 shadow post-card"
                style={{
                    minWidth: "300px",
                    maxWidth: "900px",
                    width: "100%",
                    margin: "0 10px",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                    borderRadius: "18px",
                    border: "1px solid #e0e0e0",
                    overflow: "hidden"
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.18)";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)";
                }}
            >
                <Card.Body>
                    <Card.Title className="mb-0" style={{ fontWeight: 700, fontSize: "1.3rem" }}>{post.title}</Card.Title>
                    <Card.Text style={{ color: "#444", fontSize: "1.08rem" }}>{post.content}</Card.Text>
                    <div style={{ color: "#1976d2", fontWeight: 500, fontSize: "1rem", marginBottom: 8 }}>
                        Created by: {post.created_by?.name || post.created_by || "Unknown"}
                    </div>
                    <div style={{ color: "#888", fontSize: "0.95rem", marginBottom: 8 }}>
                        Tags: {(Array.isArray(post.tags) ? post.tags.join(", ") : post.tags) || "None"}
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => onView(post)}
                        style={{ marginTop: "1rem", borderRadius: "20px", fontWeight: 600, letterSpacing: 1 }}
                    >
                        View
                    </button>
                </Card.Body>
            </Card>
            <button
                className="btn btn-outline-secondary d-none d-md-block"
                style={{
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    fontSize: 20,
                    marginLeft: 16
                }}
                onClick={handleNext}
                aria-label="Next"
            >
                &#8594;
            </button>
        </div>
    );

    return (
        <>
            {loader && <Loader />}
            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white py-5">
                <h1 className="text-4xl font-bold mb-2" style={{ color: "#1976d2" }}>Student Collaboration Hub</h1>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: "#333" }}>POSTS</h3>
            </div>
            <div className="flex flex-col items-center mt-8" style={{ minHeight: "40vh" }}>
                {posts.length > 0 && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <PostSlide post={posts[slideIndex]} onView={handleView} />
                        <div style={{ textAlign: "center", marginTop: 8 }}>
                            <span style={{ color: "#888" }}>
                                {slideIndex + 1} / {posts.length}
                            </span>
                        </div>
                        <button
                            className="btn btn-success"
                            style={{
                                margin: "32px auto 0 auto",
                                borderRadius: 20,
                                fontWeight: 600,
                                letterSpacing: 1,
                                width: 160
                            }}
                            onClick={() => setShowNewPostModal(true)}
                        >
                            + New Post
                        </button>
                    </div>
                )}
            </div>

            {/* New Post Modal */}
            {showNewPostModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        background: "rgba(0,0,0,0.5)",
                        zIndex: 1060
                    }}
                    tabIndex="-1"
                    role="dialog"
                    onClick={() => setShowNewPostModal(false)}
                >
                    <div
                        className="modal-dialog"
                        role="document"
                        style={{ pointerEvents: "auto" }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="modal-content" style={{ borderRadius: 18 }}>
                            <div className="modal-header" style={{ borderBottom: "1px solid #e0e0e0" }}>
                                <h5 className="modal-title">Create New Post</h5>
                                <button type="button" className="btn-close" onClick={() => setShowNewPostModal(false)}></button>
                            </div>
                            <form onSubmit={handleNewPostSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Type</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="type"
                                            value={newPost.type}
                                            onChange={handleNewPostChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            value={newPost.title}
                                            onChange={handleNewPostChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Content</label>
                                        <textarea
                                            className="form-control"
                                            name="content"
                                            value={newPost.content}
                                            onChange={handleNewPostChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="tags"
                                            value={newPost.tags}
                                            onChange={handleNewPostChange}
                                            placeholder="e.g. python, ai, project"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Image (optional)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="file"
                                            accept="image/*"
                                            onChange={handleNewPostChange}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowNewPostModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={addingPost}
                                    >
                                        {addingPost ? "Posting..." : "Post"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for viewing post image and comments */}
            {showModal && selectedPost && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        background: "rgba(0,0,0,0.5)",
                        zIndex: 1050
                    }}
                    tabIndex="-1"
                    role="dialog"
                    onClick={handleCloseModal}
                >
                    <div
                        className="modal-dialog modal-lg"
                        role="document"
                        style={{ pointerEvents: "auto" }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="modal-content" style={{ borderRadius: 18 }}>
                            <div className="modal-header" style={{ borderBottom: "1px solid #e0e0e0" }}>
                                <h5 className="modal-title">{selectedPost.title}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                {selectedPost.file_url && (
                                    <img
                                        src={selectedPost.file_url}
                                        alt={selectedPost.title}
                                        style={{ width: "100%", maxHeight: "400px", objectFit: "contain", marginBottom: "1rem", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
                                    />
                                )}
                                <Card.Text style={{ color: "#444", fontSize: "1.08rem" }}>{selectedPost.content}</Card.Text>
                                <h6 style={{ fontWeight: 600, marginTop: 24 }}>Comments:</h6>
                                {comments.length === 0 ? (
                                    <p className="text-muted">No comments yet.</p>
                                ) : (
                                    <ul className="list-group mb-3">
                                        {comments.map((comment, idx) => (
                                            <li key={comment.comment_id || idx} className="list-group-item">
                                                {comment.content}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {!showAddComment ? (
                                    <button
                                        className="btn btn-success"
                                        onClick={() => setShowAddComment(true)}
                                        style={{ borderRadius: 18, fontWeight: 600, marginTop: 10 }}
                                    >
                                        Add Comment
                                    </button>
                                ) : (
                                    <div className="d-flex mt-3">
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            placeholder="Add a comment..."
                                            value={newComment}
                                            onChange={e => setNewComment(e.target.value)}
                                            disabled={addingComment}
                                            style={{ borderRadius: 12 }}
                                        />
                                        <button
                                            className="btn btn-success"
                                            onClick={handleAddComment}
                                            disabled={addingComment || !newComment.trim()}
                                            style={{ borderRadius: 12, fontWeight: 600 }}
                                        >
                                            {addingComment ? "Adding..." : "Submit"}
                                        </button>
                                        <button
                                            className="btn btn-secondary ms-2"
                                            onClick={() => { setShowAddComment(false); setNewComment(""); }}
                                            disabled={addingComment}
                                            style={{ borderRadius: 12 }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Responsive styles for posts and modals */}
            <style>
                {`
                @media (max-width: 700px) {
                  .post-slide-wrapper {
                    flex-direction: column !important;
                    align-items: stretch !important;
                  }
                  .post-card {
                    min-width: 0 !important;
                    max-width: 100vw !important;
                    width: 100% !important;
                    margin: 0 !important;
                    border-radius: 12px !important;
                    box-shadow: 0 2px 12px rgba(25, 118, 210, 0.10) !important;
                  }
                  .d-md-block {
                    display: none !important;
                  }
                }
                @media (max-width: 400px) {
                  .post-card {
                    padding: 0.5rem !important;
                  }
                  .modal-dialog {
                    max-width: 98vw !important;
                    margin: 0.5rem !important;
                  }
                }
                `}
            </style>
        </>
    );
};

export default Home;