

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Community.css';
import { useAuth } from '../components/Auth/AuthContext';

// Import Components
import ForumList from '../components/ListofPosts/ForumList';
import BlogList from '../components/ListofPosts/BlogList';
import GalleryList from '../components/ListofPosts/GalleryList';
import NewForumPostForm from '../components/ListofPosts/NewForumPostForm';

// Constants
const API_BASE_URL = 'http://localhost:3000';

const Community = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('forum');
  
  // Use the AuthContext instead of local auth state
  const { isAuthenticated, user, requireAuth } = useAuth();
  
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

  // Pagination and data states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  
  const [forumPosts, setForumPosts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [galleryPosts, setGalleryPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isPostFormVisible, setIsPostFormVisible] = useState(false);
  
  // Search and filter states
  const [forumSearch, setForumSearch] = useState('');
  const [forumFilter, setForumFilter] = useState('recent');
  const [blogSearch, setBlogSearch] = useState('');
  const [blogFilter, setBlogFilter] = useState('all');
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [gallerySort, setGallerySort] = useState('recent');
  
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

  // Helper function for formatting relative time
  const getRelativeTime = (dateInput) => {
    // [getRelativeTime implementation unchanged]
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

  
  // Transform forum post data from API to match frontend structure
  const transformForumData = (apiData) => {
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
      
      return {
        id: post._id,
        title: post.title,
        author: post.user?.name,
        date: dateString, // Use our formatted date
        createdAt: post.createdAt, // Also keep the original value
        content: post.content,
        likes: post.likes || [], // Keep the array instead of just the length
        likesCount: post.likes?.length || 0, // Add a separate count property
        tags: post.tags || [],
        category: post.category,
        isSolved: post.isSolved,
        solutionComment: post.solutionComment,
        comments: post.comments || [],
        commentCount: post.commentCount || 0,
        user: post.user // Include full user object for reference
      };
    });
  };

  // Transform blog post data from API to match frontend structure
  const transformBlogData = (apiData) => {
    return apiData.posts.map(post => ({
      id: post._id,
      title: post.title,
      author: post.user.name,
      date: getRelativeTime(post.createdAt),
      excerpt: post.content ? (post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content) : "No excerpt available...", 
      image: post.coverImage,
      likes: post.likes || [], // Keep the array instead of just the length
      likesCount: post.likes?.length || 0, // Add a separate count property
      comments: post.comments?.length || 0,
      tags: post.tags || [],
      category: post.category,
      readTime: post.readTime || 1,
      user: post.user // Include full user object for reference
    }));
  };

  // Transform gallery post data from API to match frontend structure
  const transformGalleryData = (apiData) => {
    return apiData.posts.map(post => ({
      id: post._id,
      user: post.user.name,
      plant: post.title,
      image: post.mediaUrl,
      mediaUrl: post.mediaUrl,
      caption: post.content,
      likes: post.likes || [], // Keep the array instead of just the length
      likesCount: post.likes?.length || 0, // Add a separate count property
      comments: post.comments?.length || 0,
      date: getRelativeTime(post.createdAt),
      mediaType: post.mediaType,
      title: post.title,
      content: post.content,
      category: post.category,
      userObj: post.user // Include full user object for reference
    }));
  };

  // Fetch forum posts with search and filter
  const fetchForumPosts = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setIsLoading(prev => ({ ...prev, forum: true }));
      } else {
        setIsFetchingMore(true);
      }
      
      // Page size (posts per page)
      const limit = 10;
      
      // Build query parameters for search and filtering
      let queryParams = `page=${page}&limit=${limit}`;
      
      if (forumSearch) {
        queryParams += `&search=${encodeURIComponent(forumSearch)}`;
      }
      
      // Add sort parameter based on filter value
      if (forumFilter === 'recent') {
        queryParams += '&sort=latest';
      } else if (forumFilter === 'popular') {
        queryParams += '&sort=mostLiked';
      } else if (forumFilter === 'mostCommented') {
        queryParams += '&sort=mostCommented';
      } else if (forumFilter === 'oldest') {
        queryParams += '&sort=oldest';
      } else if (forumFilter === 'unanswered') {
        queryParams += '&solved=false';
      }
      // Add this inside fetchForumPosts before the API call
console.log('Fetching forum posts with params:', queryParams);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/community/forum?${queryParams}`,
        { withCredentials: true }
      );
      console.log('Forum response:', response.data);
      const transformedData = transformForumData(response.data);
      console.log('Transformed forum data:', transformedData);
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
  
  // Fetch detailed forum post by ID
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

  // Fetch blog posts with search and filter
  const fetchBlogPosts = async () => {
    try {
      setIsLoading(prev => ({ ...prev, blogs: true }));
      
      // Build query parameters for search and filtering
      let queryParams = '';
      
      if (blogSearch) {
        queryParams += `&search=${encodeURIComponent(blogSearch)}`;
      }
      
      // Add category filter if it's not "all"
      if (blogFilter && blogFilter !== 'all') {
        queryParams += `&category=${encodeURIComponent(blogFilter)}`;
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/community/blog?${queryParams.startsWith('&') ? queryParams.substring(1) : queryParams}`
      );
      
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

  // Fetch gallery posts with search and filter
  const fetchGalleryPosts = async () => {
    try {
      setIsLoading(prev => ({ ...prev, gallery: true }));
      
      // Build query parameters for search and filtering
      let queryParams = '';
      
      if (gallerySearch) {
        queryParams += `&search=${encodeURIComponent(gallerySearch)}`;
      }
      
      // Add category filter if it's not "all"
      if (galleryFilter && galleryFilter !== 'all') {
        queryParams += `&category=${encodeURIComponent(galleryFilter)}`;
      }
      
      // Add sort parameter
      if (gallerySort === 'recent') {
        queryParams += '&sort=latest';
      } else if (gallerySort === 'popular') {
        queryParams += '&sort=mostLiked';
      }
      
      // Add media type filter if needed
      // (Adding this as a future option - not implemented in the UI yet)
      // if (mediaType) {
      //   queryParams += `&mediaType=${encodeURIComponent(mediaType)}`;
      // }
      
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/community/gallery?${queryParams.startsWith('&') ? queryParams.substring(1) : queryParams}`
      );
      
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

  // Handle search input changes with debounce
  const handleForumSearchChange = (e) => {
    setForumSearch(e.target.value);
  };
  
  const handleBlogSearchChange = (e) => {
    setBlogSearch(e.target.value);
  };
  
  const handleGallerySearchChange = (e) => {
    setGallerySearch(e.target.value);
  };
  
  // Handle filter changes
  const handleForumFilterChange = (e) => {
    setForumFilter(e.target.value);
  };
  
  const handleBlogFilterChange = (filter) => {
    setBlogFilter(filter);
  };
  
  const handleGalleryFilterChange = (filter) => {
    setGalleryFilter(filter);
  };
  
  const handleGallerySortChange = (e) => {
    setGallerySort(e.target.value);
  };

  // Handle search form submissions
  const handleForumSearchSubmit = (e) => {
    e.preventDefault();
    fetchForumPosts(1, false);
  };
  
  const handleBlogSearchSubmit = (e) => {
    e.preventDefault();
    fetchBlogPosts();
  };
  
  const handleGallerySearchSubmit = (e) => {
    e.preventDefault();
    fetchGalleryPosts();
  };

  const likePost = async (postId) => {
    if (!isAuthenticated) {
      requireAuth({
        type: 'CALLBACK',
        payload: { callbackName: 'handleLikePost', args: [postId] }
      });
      return Promise.reject(new Error('Not authenticated'));
    }
    
    try {
      // Find the post
      let post = null;
      let postsList = null;
      let setPostsList = null;
      
      if (forumPosts.some(p => p.id === postId || p._id === postId)) {
        post = forumPosts.find(p => p.id === postId || p._id === postId);
        postsList = forumPosts;
        setPostsList = setForumPosts;
      } else if (blogPosts.some(p => p.id === postId || p._id === postId)) {
        post = blogPosts.find(p => p.id === postId || p._id === postId);
        postsList = blogPosts;
        setPostsList = setBlogPosts;
      } else if (galleryPosts.some(p => p.id === postId || p._id === postId)) {
        post = galleryPosts.find(p => p.id === postId || p._id === postId);
        postsList = galleryPosts;
        setPostsList = setGalleryPosts;
      }
      
      if (!post) return Promise.reject(new Error('Post not found'));
      
      // Ensure likes is an array
      const postLikes = Array.isArray(post.likes) ? post.likes : [];
      
      // Convert all IDs to strings for consistent comparison
      const likesAsStrings = postLikes.map(id => 
        typeof id === 'object' ? id.toString() : String(id)
      );
      const userIdString = String(user.userId);
      
      // Determine if the post is already liked by checking if user ID exists in likes array
      const isLiked = likesAsStrings.includes(userIdString);
      
      
      // Make API call
      await axios.post(
        `${API_BASE_URL}/api/v1/community/posts/${postId}/like`,
        {},
        { 
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      
      // Update the post in state after successful API call
      if (postsList && setPostsList) {
        const updatedPosts = postsList.map(p => {
          if ((p.id === postId || p._id === postId)) {
            // Create a copy of the post
            const updatedPost = {...p};
            
            // Update likes array
            if (Array.isArray(updatedPost.likes)) {
              if (isLiked) {
                // Remove user ID from likes
                updatedPost.likes = updatedPost.likes.filter(id => {
                  const idStr = typeof id === 'object' ? id.toString() : String(id);
                  return idStr !== userIdString;
                });
              } else {
                // Add user ID to likes if not already present
                if (!likesAsStrings.includes(userIdString)) {
                  updatedPost.likes = [...updatedPost.likes, user.userId];
                }
              }
              // Update likesCount
              updatedPost.likesCount = updatedPost.likes.length;
            } else {
              // If likes is not an array, initialize it
              if (isLiked) {
                updatedPost.likes = [];
              } else {
                updatedPost.likes = [user.userId];
              }
              updatedPost.likesCount = updatedPost.likes.length;
            }
            
            return updatedPost;
          }
          return p;
        });
        
        setPostsList(updatedPosts);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      return Promise.reject(error);
    }
  };

  // Like a comment
  const likeComment = async (commentId) => {
    if (!isAuthenticated) {
      requireAuth({
        type: 'CALLBACK',
        payload: { callbackName: 'handleLikeComment', args: [commentId] }
      });
      return Promise.reject(new Error('Not authenticated'));
    }
    
    try {

      await axios.post(
        `${API_BASE_URL}/api/v1/community/comments/${commentId}/like`,
        {},
        { 
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      
      // No need to update state here - let the component handle it
      return Promise.resolve();
    } catch (error) {
      console.error('Error liking comment:', error);
      return Promise.reject(error);
    }
  };

  // Add a comment to a post
  const addCommentToPost = async (postId, commentContent, parentCommentId = null) => {
    if (!isAuthenticated) {
      navigate('/login');
      return null;
    }
    
    try {
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

  // Reply to a comment
  const replyToComment = async (postId, commentId, replyContent) => {
    try {
      return await addCommentToPost(postId, replyContent, commentId);
    } catch (error) {
      console.error('Error replying to comment:', error);
      throw error;
    }
  };
  
  // Register callbacks for liking posts and comments
  useEffect(() => {
    window.handleLikePost = (postId) => likePost(postId);
    window.handleLikeComment = (commentId) => likeComment(commentId);
    
    // Clean up callbacks when component unmounts
    return () => {
      delete window.handleLikePost;
      delete window.handleLikeComment;
    };
  }, [user, isAuthenticated]); // Re-register when user changes

  // Fetch initial data when component mounts or when tab changes
  useEffect(() => {
    if (activeTab === 'forum') {
      fetchForumPosts();
    } else if (activeTab === 'blogs') {
      fetchBlogPosts();
    } else if (activeTab === 'gallery') {
      fetchGalleryPosts();
    }
  }, [activeTab]);
  
  // Refetch data when filters or search change
// Modify your useEffect for forum filters to ensure it runs properly
useEffect(() => {
  if (activeTab === 'forum') {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchForumPosts(1, false);
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  }
}, [forumFilter, forumSearch]); // Add forumSearch to the dependency array
  
  useEffect(() => {
    if (activeTab === 'blogs') {
      const timer = setTimeout(() => {
        fetchBlogPosts();
      }, 500); // 500ms debounce
      
      return () => clearTimeout(timer);
    }
  }, [blogFilter]);
  
  useEffect(() => {
    if (activeTab === 'gallery') {
      const timer = setTimeout(() => {
        fetchGalleryPosts();
      }, 500); // 500ms debounce
      
      return () => clearTimeout(timer);
    }
  }, [galleryFilter, gallerySort]);

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
                          <button 
                className="primary-button"
                onClick={() => setIsPostFormVisible(!isPostFormVisible)}
              >
                {isPostFormVisible ? 'Cancel' : 'New Post'}
              </button>
            <div className="section-header">
              <h2>Discussion Forum</h2>

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
              <select 
                className="filter-dropdown" 
                value={forumFilter}
                onChange={handleForumFilterChange}
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="mostCommented">Most Commented</option>
                <option value="oldest">Oldest First</option>
                <option value="unanswered">Unanswered</option>
              </select>
              
              <form onSubmit={handleForumSearchSubmit}>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search discussions..."
                  value={forumSearch}
                  onChange={handleForumSearchChange}
                />
                <button type="submit" className="search-button" aria-label="Search">
                  🔍
                </button>
              </form>
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
              currentUserId={user?.userId}
            />
          </div>
        )}
        
        {/* Blogs Section */}
        {activeTab === 'blogs' && (
          <div className="blogs-section">
                          <button 
                className="primary-button"
                onClick={() => navigate('/community/blog/new')}
              >
                Write a Blog
              </button>
            <div className="section-header">
              <h2>Plant Care Blogs</h2>

            </div>
            
            <div className="blogs-filters">
              <div className="filter-buttons">
                <button 
                  className={`filter-button ${blogFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleBlogFilterChange('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-button ${blogFilter === 'Gardening Tips' ? 'active' : ''}`}
                  onClick={() => handleBlogFilterChange('Gardening Tips')}
                >
                  Care Tips
                </button>
                <button 
                  className={`filter-button ${blogFilter === 'DIY Projects' ? 'active' : ''}`}
                  onClick={() => handleBlogFilterChange('DIY Projects')}
                >
                  DIY Projects
                </button>
                <button 
                  className={`filter-button ${blogFilter === 'Plant Stories' ? 'active' : ''}`}
                  onClick={() => handleBlogFilterChange('Plant Stories')}
                >
                  Plant Spotlights
                </button>
                <button 
                  className={`filter-button ${blogFilter === 'Sustainability' ? 'active' : ''}`}
                  onClick={() => handleBlogFilterChange('Sustainability')}
                >
                  Sustainability
                </button>
              </div>
              
              <form onSubmit={handleBlogSearchSubmit}>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search blogs..."
                  value={blogSearch}
                  onChange={handleBlogSearchChange}
                />
                <button type="submit" className="search-button" aria-label="Search">
                  🔍
                </button>
              </form>
            </div>
            
            <BlogList 
              isLoading={isLoading.blogs}
              errors={errors.blogs}
              blogPosts={blogPosts}
              likePost={likePost}
              isAuthenticated={isAuthenticated}
              currentUserId={user?.userId}
            />
          </div>
        )}
        
        {/* Gallery Section */}
        {activeTab === 'gallery' && (
          <div className="gallery-section">
                          <button 
                className="primary-button"
                onClick={() => navigate('/community/gallery/new')}
              >
                Upload to Gallery
              </button>
            <div className="section-header">
              <h2>Plant Photo Gallery</h2>

            </div>
            
            <div className="gallery-filters">
              <div className="filter-buttons">
                <button 
                  className={`filter-button ${galleryFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleGalleryFilterChange('all')}
                >
                  All Plants
                </button>
                <button 
                  className={`filter-button ${galleryFilter === 'Plants' ? 'active' : ''}`}
                  onClick={() => handleGalleryFilterChange('Plants')}
                >
                  Foliage
                </button>
                <button 
                  className={`filter-button ${galleryFilter === 'Flowers' ? 'active' : ''}`}
                  onClick={() => handleGalleryFilterChange('Flowers')}
                >
                  Flowering
                </button>
                <button 
                  className={`filter-button ${galleryFilter === 'Indoor' ? 'active' : ''}`}
                  onClick={() => handleGalleryFilterChange('Indoor')}
                >
                  Indoor
                </button>
                <button 
                  className={`filter-button ${galleryFilter === 'Before/After' ? 'active' : ''}`}
                  onClick={() => handleGalleryFilterChange('Before/After')}
                >
                  Before & After
                </button>
              </div>
              
              <div className="gallery-filter-right">
                <select 
                  className="filter-dropdown"
                  value={gallerySort}
                  onChange={handleGallerySortChange}
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                </select>
                
                <form onSubmit={handleGallerySearchSubmit}>
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search gallery..."
                    value={gallerySearch}
                    onChange={handleGallerySearchChange}
                  />
                  <button type="submit" className="search-button" aria-label="Search">
                    🔍
                  </button>
                </form>
              </div>
            </div>
            
            <GalleryList 
              isLoading={isLoading.gallery}
              errors={errors.gallery}
              galleryPosts={galleryPosts}
              likePost={likePost}
              isAuthenticated={isAuthenticated}
              currentUserId={user?.userId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;