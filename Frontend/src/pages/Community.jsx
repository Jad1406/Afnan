
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
import TestDataGenerator from '../utils/TestDataGenerator'; // Import the test data generator
// Constants
const API_BASE_URL = 'http://localhost:3000'; // Replace with your actual base URL

const Community = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('forum');
  
  // Use the AuthContext instead of local auth state
  const { isAuthenticated,user, requireAuth } = useAuth();
  
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

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  
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
// Improved getRelativeTime function that handles different date formats
const getRelativeTime = (dateInput) => {
  if (!dateInput) return 'Unknown date';
  
  let date;
  
  // Try to parse the date if it's a string
  if (typeof dateInput === 'string') {
    try {
      date = new Date(dateInput);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateInput);
        return 'Invalid date';
      }
    } catch (e) {
      console.error('Error parsing date:', e);
      return 'Invalid date';
    }
  } else if (dateInput instanceof Date) {
    // If it's already a Date object, use it directly
    date = dateInput;
  } else {
    // If it's neither a string nor a Date, return unknown
    console.warn('Unsupported date type:', typeof dateInput);
    return 'Unknown date';
  }
  
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // If same day, show hours
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      if (diffMinutes === 0) {
        return 'Just now';
      }
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
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
    // For older dates, show the formatted date
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
// Update the transformForumData function to handle top-level comments:


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

  const fetchForumPosts = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setIsLoading(prev => ({ ...prev, forum: true }));
      } else {
        setIsFetchingMore(true);
      }
      
      // Page size (posts per page)
      const limit = 10;
      
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/community/forum?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      
      const transformedData = transformForumData(response.data);
      
      if (append) {
        // Append new posts to existing ones
        setForumPosts(prevPosts => [...prevPosts, ...transformedData]);
      } else {
        // Replace existing posts
        setForumPosts(transformedData);
      }
      
      // Update pagination state
      setCurrentPage(page);
      
      // Check if there are more posts to load
      setHasMorePosts(response.data.pagination?.hasNextPage || false);
      
      setErrors(prev => ({ ...prev, forum: null }));
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      setErrors(prev => ({ ...prev, forum: 'Failed to load forum posts' }));
    } finally {
      setIsLoading(prev => ({ ...prev, forum: false }));
      setIsFetchingMore(false);
    }
  };
  
  // Add this function to load more posts (for infinite scrolling)
  const loadMoreForumPosts = async () => {
    if (hasMorePosts && !isFetchingMore) {
      await fetchForumPosts(currentPage + 1, true);
    }
  };
  
  // Update the transformForumData function to properly handle comments and replies
  const transformForumData = (apiData) => {
    // Debug: Log first post to check date structure
    if (apiData.posts && apiData.posts.length > 0) {
      console.log('First post date info:', {
        createdAt: apiData.posts[0].createdAt,
        type: typeof apiData.posts[0].createdAt,
        isValid: apiData.posts[0].createdAt ? !isNaN(new Date(apiData.posts[0].createdAt).getTime()) : false
      });
    }
    
    return apiData.posts.map(post => {
      // Try to create a valid date string
      let dateString = 'Unknown date';
      if (post.createdAt) {
        try {
          const dateObj = new Date(post.createdAt);
          if (!isNaN(dateObj.getTime())) {
            dateString = getRelativeTime(dateObj);
          } else {
            console.warn('Invalid date in post:', post._id, post.createdAt);
          }
        } catch (e) {
          console.error('Error parsing date:', e);
        }
      }
      
      const transformedPost = {
        id: post._id,
        title: post.title,
        author: post.user?.name,
        date: dateString, // Use our formatted date
        createdAt: post.createdAt, // Also keep the original value
        content: post.content,
        replies: [],
        likes: post.likes?.length || 0,
        tags: post.tags || [],
        category: post.category,
        isSolved: post.isSolved,
        solutionComment: post.solutionComment,
        commentCount: post.commentCount || 0
      };
      
      // If topLevelComments are included, transform them
      if (post.topLevelComments && post.topLevelComments.length > 0) {
        transformedPost.replies = post.topLevelComments.map(comment => {
          // Format comment dates too
          let commentDateString = 'Unknown date';
          if (comment.createdAt) {
            try {
              const commentDateObj = new Date(comment.createdAt);
              if (!isNaN(commentDateObj.getTime())) {
                commentDateString = getRelativeTime(commentDateObj);
              }
            } catch (e) {
              console.error('Error parsing comment date:', e);
            }
          }
          
          return {
            id: comment._id,
            author: comment.user?.name,
            content: comment.content,
            date: commentDateString,
            createdAt: comment.createdAt,
            likes: comment.likes?.length || 0,
            replyCount: comment.replyCount || (comment.replies?.length || 0),
            depth: 0,
            parentId: null
          };
        });
      }
      
      return transformedPost;
    });
  };
  
// Update fetchForumPost to handle virtual replies
const fetchForumPost = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/community/forum/${postId}`);
    
    // Get the post data from the response
    const { post } = response.data;
    
    // Return the post data with top-level comments
    return {
      ...post,
      id: post._id // Ensure the ID is available as both _id and id
    };
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
// Update the likePost function to toggle like state
const likePost = async (postId) => {
  requireAuth(async () => {
    try {
      // Check if user has already liked the post
      const post = forumPosts.find(p => p.id === postId || p._id === postId);
      
      if (!post) return;
      
      const liked = post.likes && Array.isArray(post.likes) && post.likes.includes(user.userId);
      
      // Call either like or unlike endpoint
      await axios.post(
        `${API_BASE_URL}/api/v1/community/posts/${postId}/${liked ? 'unlike' : 'like'}`,
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
        const updatedPosts = posts.map(post => {
          if (post.id === postId || post._id === postId) {
            // If already liked, decrease count (unlike), otherwise increase (like)
            const newLikes = Array.isArray(post.likes) 
              ? (liked 
                ? post.likes.filter(id => id !== user.userId) 
                : [...post.likes, user.userId])
              : (liked ? post.likes - 1 : post.likes + 1);
              
            return { 
              ...post, 
              likes: newLikes
            };
          }
          return post;
        });
        setter(updatedPosts);
      };
      
      if (forumPosts.some(p => p.id === postId || p._id === postId)) {
        updatePostLikes(forumPosts, setForumPosts);
      } else if (blogPosts.some(p => p.id === postId || p._id === postId)) {
        updatePostLikes(blogPosts, setBlogPosts);
      } else if (galleryPosts.some(p => p.id === postId || p._id === postId)) {
        updatePostLikes(galleryPosts, setGalleryPosts);
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  });
};

// Update the likeComment function to toggle like state
const likeComment = async (commentId) => {
  checkAuthAndProceed(async () => {
    try {
      // We don't have a way to easily check if comment is already liked
      // So we'll just call the like endpoint
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

const addCommentToPost = async (postId, commentContent, parentCommentId = null) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if not authenticated
      navigate('/login');
      return null;
    }
    
    // Prepare request data
    const requestData = { 
      content: commentContent
    };
    
    // If this is a reply to another comment, add parentComment
    if (parentCommentId) {
      requestData.parentComment = parentCommentId;
    }
    
    // Send the request
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/community/posts/${postId}/comments`,
      requestData,
      { 
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      }
    );
    
    // Return the created comment
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Reply to a comment (wrapper around addCommentToPost)
const replyToComment = async (postId, commentId, replyContent) => {
  try {
    return await addCommentToPost(postId, replyContent, commentId);
  } catch (error) {
    console.error('Error replying to comment:', error);
    throw error;
  }
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
                    loadMorePosts={loadMoreForumPosts}
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