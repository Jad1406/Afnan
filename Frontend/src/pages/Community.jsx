
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Community.css';
import { useAuth } from '../components/Auth/AuthContext'; // Import the auth context hook

// Import Components
import ForumList from '../components/ListofPosts/ForumList';
import BlogList from '../components/ListofPosts/BlogList';
import GalleryList from '../components/ListofPosts/GalleryList';
import NewForumPostForm from '../components/ListofPosts/NewForumPostForm';

// Constants
const API_BASE_URL = 'http://localhost:3000'; // Replace with your actual base URL

const Community = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('forum');
  
  // Use the AuthContext instead of local auth state
  const { isAuthenticated, requireAuth } = useAuth();
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState({
    forum: true,
    blogs: true,
    gallery: true
  });
  
  const [errors, setErrors] = useState({
    forum: null,
    blogs: null,
    gallery: null
  });
  
  const [selectedPostId, setSelectedPostId] = useState(null);
  
  const [forumPosts, setForumPosts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [galleryPosts, setGalleryPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isPostFormVisible, setIsPostFormVisible] = useState(false);
  
  const token = localStorage.getItem('token');

  // Handle new forum post submission with auth check
  const handleForumSubmit = async (e) => {
    e.preventDefault();
    
    if (newPostTitle.trim() === '' || newPostContent.trim() === '') {
      return;
    }
    
    // Use the requireAuth function from AuthContext
    requireAuth({
      type: 'REDIRECT',
      payload: { path: location.pathname }
    });
    
    if (isAuthenticated) {
      try {
        // Create post through API
        await axios.post(
          `${API_BASE_URL}/api/v1/community/forum`,
          {
            title: newPostTitle,
            content: newPostContent,
            category: 'Question', // Default category
            tags: [] // No tags by default
          },
          { 
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          },
        );
        
        // Refresh forum posts to include the new one
        fetchForumPosts();
        
        // Reset form
        setNewPostTitle('');
        setNewPostContent('');
        setIsPostFormVisible(false);
      } catch (error) {
        console.error('Error creating forum post:', error);
      }
    }
  };

  ////////////////////
  //// API Transformation Functions:

  // Format relative date like "2 days ago"
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Recursive function to flatten comment tree into a list for display
  const flattenCommentTree = (commentTree, depth = 0) => {
    if (!commentTree || !Array.isArray(commentTree)) return [];
    
    let result = [];
    
    commentTree.forEach(comment => {
      // Add the current comment with its depth
      result.push({
        id: comment._id,
        author: comment.user.name,
        date: getRelativeTime(comment.createdAt),
        content: comment.content,
        likes: comment.likes?.length || 0,
        depth: depth, // Use depth for indentation in UI
        parentId: comment.parentComment
      });
      
      // Recursively add replies if they exist
      if (comment.replies && comment.replies.length > 0) {
        result = result.concat(flattenCommentTree(comment.replies, depth + 1));
      }
    });
    
    return result;
  };

  // Transform forum post data from API to match frontend structure
  const transformForumData = (apiData) => {
    return apiData.posts.map(post => ({
      id: post._id,
      title: post.title,
      author: post.user.name,
      date: getRelativeTime(post.createdAt),
      content: post.content,
      replies: [],
      likes: post.likes.length,
      tags: post.tags || [],
      category: post.category,
      isSolved: post.isSolved,
      solutionComment: post.solutionComment,
      commentIds: post.comments
    }));
  };

  // Transform blog post data from API to match frontend structure
  const transformBlogData = (apiData) => {
    return apiData.posts.map(post => ({
      id: post._id,
      title: post.title,
      author: post.user.name,
      date: getRelativeTime(post.createdAt),
      excerpt: post.content || "No excerpt available...", 
      image: post.coverImage,
      likes: post.likes.length,
      comments: post.comments.length,
      tags: post.tags || [],
      category: post.category,
      readTime: post.readTime || 1 
    }));
  };

  // Transform gallery post data from API to match frontend structure
  const transformGalleryData = (apiData) => {
    return apiData.posts.map(post => ({
      id: post._id,
      user: post.user.name,
      plant: post.title,
      image: post.mediaUrl,
      caption: post.title,
      likes: post.likes.length,
      comments: post.comments.length,
      date: getRelativeTime(post.createdAt),
      mediaType: post.mediaType
    }));
  };

  ///////////////
  ///// API Fetching Functions:
  
  // Check if user is authenticated before performing interactions
  // UPDATED: Now uses the AuthContext requireAuth function
  const checkAuthAndProceed = (action) => {
    // Use the requireAuth function from AuthContext
    const isAuthorized = requireAuth({
      type: 'REDIRECT',
      payload: { path: location.pathname }
    });
    
    if (isAuthenticated && isAuthorized) {
      // User is logged in, proceed with the action
      action();
    }
  };

  // Fetch forum posts
  const fetchForumPosts = async () => {
    try {
      setIsLoading(prev => ({ ...prev, forum: true }));
      const response = await axios.get(`${API_BASE_URL}/api/v1/community/forum`);
      const transformedData = transformForumData(response.data);
      setForumPosts(transformedData);
      setErrors(prev => ({ ...prev, forum: null }));
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      setErrors(prev => ({ ...prev, forum: 'Failed to load forum posts' }));
    } finally {
      setIsLoading(prev => ({ ...prev, forum: false }));
    }
  };

  // Fetch a specific forum post with all details and comment tree
  const fetchForumPost = async (postId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/community/forum/${postId}`);
      const { post } = response.data; // Note the nested "post" object in the response
      
      // Process and add comments to the post in state
      let updatedPost = {
        id: post._id,
        title: post.title,
        author: post.user.name,
        date: getRelativeTime(post.createdAt),
        content: post.content,
        likes: post.likes.length,
        tags: post.tags || [],
        category: post.category,
        isSolved: post.isSolved,
        solutionComment: post.solutionComment,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType
      };
      
      // Use the commentTree from the response if available, otherwise use flat comments array
      if (post.commentTree && Array.isArray(post.commentTree)) {
        updatedPost.replies = flattenCommentTree(post.commentTree);
      } else if (post.comments && Array.isArray(post.comments)) {
        updatedPost.replies = post.comments.map(comment => ({
          id: comment._id,
          author: comment.user.name,
          date: getRelativeTime(comment.createdAt),
          content: comment.content,
          likes: comment.likes?.length || 0,
          depth: 0,
          parentId: comment.parentComment
        }));
      } else {
        updatedPost.replies = [];
      }
      
      // Update this single post in state
      setForumPosts(prev => 
        prev.map(p => p.id === postId ? updatedPost : p)
      );
      
      setSelectedPostId(postId);
      
      return updatedPost;
    } catch (error) {
      console.error(`Error fetching forum post ${postId}:`, error);
      throw error;
    }
  };

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      setIsLoading(prev => ({ ...prev, blogs: true }));
      const response = await axios.get(`${API_BASE_URL}/api/v1/community/blog`);
      const transformedData = transformBlogData(response.data);
      setBlogPosts(transformedData);
      setErrors(prev => ({ ...prev, blogs: null }));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setErrors(prev => ({ ...prev, blogs: 'Failed to load blog posts' }));
    } finally {
      setIsLoading(prev => ({ ...prev, blogs: false }));
    }
  };

  // Fetch gallery posts
  const fetchGalleryPosts = async () => {
    try {
      setIsLoading(prev => ({ ...prev, gallery: true }));
      const response = await axios.get(`${API_BASE_URL}/api/v1/community/gallery`);
      const transformedData = transformGalleryData(response.data);
      setGalleryPosts(transformedData);
      setErrors(prev => ({ ...prev, gallery: null }));
    } catch (error) {
      console.error('Error fetching gallery posts:', error);
      setErrors(prev => ({ ...prev, gallery: 'Failed to load gallery posts' }));
    } finally {
      setIsLoading(prev => ({ ...prev, gallery: false }));
    }
  };

  /////////////
  ///// Interaction Functions:

  // Like a post with auth check
  const likePost = async (postId) => {
    checkAuthAndProceed(async () => {
      try {
        await axios.post(
          `${API_BASE_URL}/api/v1/community/posts/${postId}/like`,
          {},
          { 
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          },
        );
        
        // Update the like count in state
        const updatePostLikes = (posts, setter) => {
          const updatedPosts = posts.map(post => 
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          );
          setter(updatedPosts);
        };
        
        if (forumPosts.some(p => p.id === postId)) {
          updatePostLikes(forumPosts, setForumPosts);
        } else if (blogPosts.some(p => p.id === postId)) {
          updatePostLikes(blogPosts, setBlogPosts);
        } else if (galleryPosts.some(p => p.id === postId)) {
          updatePostLikes(galleryPosts, setGalleryPosts);
        }
      } catch (error) {
        console.error('Error liking post:', error);
      }
    });
  };

  // Like a comment with auth check
  const likeComment = async (commentId) => {
    checkAuthAndProceed(async () => {
      try {
        await axios.post(
          `${API_BASE_URL}/api/v1/community/comments/${commentId}/like`,
          {},
          { 
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          },
        );
        
        // Refresh the post to get updated likes on comments
        if (selectedPostId) {
          if (forumPosts.some(p => p.id === selectedPostId)) {
            fetchForumPost(selectedPostId);
          }
        }
      } catch (error) {
        console.error('Error liking comment:', error);
      }
    });
  };

  // Add a comment to a post with auth check
  const addCommentToPost = async (postId, commentContent, parentCommentId = null) => {
    const result = checkAuthAndProceed(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/community/posts/${postId}/comments`,
          { 
            content: commentContent,
            parentComment: parentCommentId // Include parent comment ID for replies
          },
          { 
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          },
        );
      
        // After successfully adding comment, fetch the updated post with comments
        if (response.status === 201 || response.status === 200) {
          if (forumPosts.some(p => p.id === postId)) {
            fetchForumPost(postId);
          } else if (blogPosts.some(p => p.id === postId)) {
            fetchBlogPosts();
          } else if (galleryPosts.some(p => p.id === postId)) {
            fetchGalleryPosts();
          }
        }
        
        return response.data;
      } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
      }
    });
    
    return result;
  };

  // Reply to a comment with auth check
  const replyToComment = async (postId, commentId, replyContent) => {
    const result = checkAuthAndProceed(async () => {
      try {
        return await addCommentToPost(postId, replyContent, commentId);
      } catch (error) {
        console.error('Error replying to comment:', error);
        throw error;
      }
    });
    
    return result;
  };
    
  // Fetch all data on component mount
  useEffect(() => {
    fetchForumPosts();
    fetchBlogPosts();
    fetchGalleryPosts();
  }, []);

  return (
    <div className="community-page">
      <div className="community-header">
        <div className="container">
          <h1>Plant Community</h1>
          <p>Connect with fellow plant enthusiasts, share your experiences, and learn together!</p>
          
          <div className="community-tabs">
            <button 
              className={`tab-button ${activeTab === 'forum' ? 'active' : ''}`}
              onClick={() => setActiveTab('forum')}
            >
              <span className="tab-icon">💬</span>
              Forum
            </button>
            <button 
              className={`tab-button ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => setActiveTab('blogs')}
            >
              <span className="tab-icon">📝</span>
              Plant Care Blogs
            </button>
            <button 
              className={`tab-button ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              <span className="tab-icon">📸</span>
              Photo Gallery
            </button>
          </div>
        </div>
      </div>
      
      <div className="community-content container">
        {/* Forum Section */}
        {activeTab === 'forum' && (
          <div className="forum-section">
            <div className="section-header">
              <h2>Discussion Forum</h2>
              <button 
                className="primary-button"
                onClick={() => setIsPostFormVisible(!isPostFormVisible)}
              >
                {isPostFormVisible ? 'Cancel' : 'New Post'}
              </button>
            </div>
            
            <NewForumPostForm 
              isVisible={isPostFormVisible} 
              newPostTitle={newPostTitle}
              setNewPostTitle={setNewPostTitle}
              newPostContent={newPostContent}
              setNewPostContent={setNewPostContent}
              handleForumSubmit={handleForumSubmit}
            />
            
            <div className="forum-filters">
              <select className="filter-dropdown">
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="unanswered">Unanswered</option>
              </select>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search discussions..."
              />
            </div>
            
            <ForumList 
              isLoading={isLoading.forum}
              errors={errors.forum}
              forumPosts={forumPosts}
              isAuthenticated={isAuthenticated}
              fetchForumPost={fetchForumPost}
              addCommentToPost={addCommentToPost}
              replyToComment={replyToComment}
              likePost={likePost}
              likeComment={likeComment}
            />
          </div>
        )}
        
        {/* Blogs Section */}
        {activeTab === 'blogs' && (
          <div className="blogs-section">
            <div className="section-header">
              <h2>Plant Care Blogs</h2>
              <button className="primary-button">Write a Blog</button>
            </div>
            
            <div className="blogs-filters">
              <div className="filter-buttons">
                <button className="filter-button active">All</button>
                <button className="filter-button">Care Tips</button>
                <button className="filter-button">DIY Projects</button>
                <button className="filter-button">Plant Spotlights</button>
              </div>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search blogs..."
              />
            </div>
            
            <BlogList 
              isLoading={isLoading.blogs}
              errors={errors.blogs}
              blogPosts={blogPosts}
              likePost={likePost}
            />
          </div>
        )}
        
        {/* Gallery Section */}
        {activeTab === 'gallery' && (
          <div className="gallery-section">
            <div className="section-header">
              <h2>Plant Photo Gallery</h2>
              <button className="primary-button">Upload Photo</button>
            </div>
            
            <div className="gallery-filters">
              <div className="filter-buttons">
                <button className="filter-button active">All Plants</button>
                <button className="filter-button">Foliage</button>
                <button className="filter-button">Flowering</button>
                <button className="filter-button">Succulents</button>
                <button className="filter-button">Before & After</button>
              </div>
              <select className="filter-dropdown">
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            
            <GalleryList 
              isLoading={isLoading.gallery}
              errors={errors.gallery}
              galleryPosts={galleryPosts}
              likePost={likePost}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;