// Community.jsx
import React, { useState } from 'react';
import './Community.css';

const Community = () => {
  const [activeTab, setActiveTab] = useState('forum');
  
  // Sample forum posts data
  //The below should represent the schema
  const [forumPosts, setForumPosts] = useState([
    {
      id: 1,
      title: "Help! My Monstera leaves are turning yellow",
      author: "PlantLover22",
      date: "2 days ago",
      content: "I've had my Monstera for about 6 months and it was doing great until recently. Now the leaves are turning yellow. What could be causing this?",
      //The replies should be an array type within the model of the Post
      replies: [
        {
          id: 101,
          author: "GreenThumbExpert",
          date: "1 day ago",
          content: "Yellow leaves on a Monstera often indicate overwatering. Make sure your pot has good drainage and let the soil dry out between waterings."
        },
        {
          id: 102,
          author: "PlantDoc",
          date: "1 day ago",
          content: "It could also be a nutrient deficiency. When did you last fertilize it? Try adding a balanced houseplant fertilizer at half strength."
        }
      ],
      likes: 12,
      tags: ["Monstera", "Plant Problems", "Yellowing"]
    },
    {
      id: 2,
      title: "Best pots for succulents?",
      author: "DesertPlants",
      date: "5 days ago",
      content: "I'm expanding my succulent collection and looking for recommendations on the best pots. Terracotta? Ceramic? What do you all prefer?",
      replies: [
        {
          id: 201,
          author: "SucculentQueen",
          date: "4 days ago",
          content: "Terracotta is my go-to! They're porous so they help prevent overwatering by allowing water to evaporate through the sides."
        }
      ],
      likes: 8,
      tags: ["Succulents", "Pots", "Recommendations"]
    },
    {
      id: 3,
      title: "Snake plant not growing",
      author: "NewPlantParent",
      date: "1 week ago",
      content: "I've had a snake plant for almost a year and it hasn't grown at all. Is this normal? What can I do to encourage growth?",
      replies: [
        {
          id: 301,
          author: "PlantProfessor",
          date: "6 days ago",
          content: "Snake plants are very slow growers, especially in low light. Try moving it to a brighter spot and fertilizing lightly in spring/summer."
        }
      ],
      likes: 5,
      tags: ["Snake Plant", "Growth", "Care Tips"]
    }
  ]);
  
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "10 Easiest Houseplants for Beginners",
      author: "PlantExpert",
      date: "June 15, 2023",
      excerpt: "New to plant parenthood? These 10 houseplants are nearly impossible to kill and perfect for beginners...",
      image: "/images/beginner-plants.jpg",
      likes: 45,
      comments: 12
    },
    {
      id: 2,
      title: "How to Create a Tropical Oasis in Your Home",
      author: "JungleQueen",
      date: "June 2, 2023",
      excerpt: "Transform your living space into a lush tropical paradise with these stunning plants and styling tips...",
      image: "/images/tropical-oasis.jpg",
      likes: 38,
      comments: 9
    },
    {
      id: 3,
      title: "Natural Pest Control for Houseplants",
      author: "OrganicGardener",
      date: "May 23, 2023",
      excerpt: "Dealing with pests but want to avoid harsh chemicals? Try these natural remedies to keep your plants healthy...",
      image: "/images/pest-control.jpg",
      likes: 56,
      comments: 17
    }
  ];
  
  // Sample gallery posts data
  const galleryPosts = [
    {
      id: 1,
      user: "PlantLover22",
      plant: "Monstera Deliciosa",
      image: "/images/gallery1.jpg",
      caption: "My monstera has put out 3 new leaves this month! So proud of this beauty.",
      likes: 89,
      comments: 14,
      date: "3 days ago"
    },
    {
      id: 2,
      user: "UrbanJungle",
      plant: "Fiddle Leaf Fig",
      image: "/images/gallery2.jpg",
      caption: "One year growth progress on my fiddle leaf fig. Patience pays off!",
      likes: 124,
      comments: 28,
      date: "1 week ago"
    },
    {
      id: 3,
      user: "SucculentAddiction",
      plant: "Echeveria Collection",
      image: "/images/gallery3.jpg",
      caption: "My succulent shelf is finally complete! At least until I buy more...",
      likes: 76,
      comments: 11,
      date: "2 weeks ago"
    },
    {
      id: 4,
      user: "BotanicalDreams",
      plant: "String of Pearls",
      image: "/images/gallery4.jpg",
      caption: "6 month progress on my string of pearls! From a tiny cutting to this cascading beauty.",
      likes: 103,
      comments: 19,
      date: "3 weeks ago"
    }
  ];
  
  // New post state for forum
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isPostFormVisible, setIsPostFormVisible] = useState(false);
  
  // Handle new forum post submission
  const handleForumSubmit = (e) => {
    e.preventDefault();
    
    if (newPostTitle.trim() === '' || newPostContent.trim() === '') {
      return;
    }
    
    const newPost = {
      id: forumPosts.length + 1,
      title: newPostTitle,
      author: "CurrentUser", // In a real app, this would be the logged-in user
      date: "Just now",
      content: newPostContent,
      replies: [],
      likes: 0,
      tags: []
    };
    
    setForumPosts([newPost, ...forumPosts]);
    setNewPostTitle('');
    setNewPostContent('');
    setIsPostFormVisible(false);
  };
  
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
            
            {isPostFormVisible && (
              <div className="new-post-form">
                <h3>Create a New Post</h3>
                <form onSubmit={handleForumSubmit}>
                  <div className="form-group">
                    <label htmlFor="postTitle">Title</label>
                    <input 
                      type="text" 
                      id="postTitle"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="What's your question or topic?"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="postContent">Content</label>
                    <textarea 
                      id="postContent"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Share your question or thoughts in detail..."
                      rows="5"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="primary-button">Post</button>
                </form>
              </div>
            )}
            
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
            
            <div className="forum-posts">
              {forumPosts.map(post => (
                <div className="forum-post" key={post.id}>
                  <div className="post-header">
                    <h3 className="post-title">{post.title}</h3>
                    <div className="post-meta">
                      <span className="post-author">By {post.author}</span>
                      <span className="post-date">{post.date}</span>
                      <span className="post-likes">❤️ {post.likes}</span>
                    </div>
                  </div>
                  
                  <div className="post-content">
                    <p>{post.content}</p>
                  </div>
                  
                  <div className="post-tags">
                    {post.tags.map((tag, index) => (
                      <span className="tag" key={index}>{tag}</span>
                    ))}
                  </div>
                  
                  <div className="post-replies">
                    <h4>{post.replies.length} Replies</h4>
                    {post.replies.map(reply => (
                      <div className="reply" key={reply.id}>
                        <div className="reply-header">
                          <span className="reply-author">{reply.author}</span>
                          <span className="reply-date">{reply.date}</span>
                        </div>
                        <p className="reply-content">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="post-actions">
                    <button className="action-button">Reply</button>
                    <button className="action-button">Like</button>
                    <button className="action-button">Share</button>
                  </div>
                </div>
              ))}
            </div>
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
            
            <div className="blog-posts">
              {blogPosts.map(post => (
                <div className="blog-card" key={post.id}>
                  <div className="blog-image-placeholder">
                    <div className="blog-icon">🌿</div>
                  </div>
                  <div className="blog-content">
                    <h3 className="blog-title">{post.title}</h3>
                    <div className="blog-meta">
                      <span className="blog-author">By {post.author}</span>
                      <span className="blog-date">{post.date}</span>
                    </div>
                    <p className="blog-excerpt">{post.excerpt}</p>
                    <div className="blog-actions">
                      <button className="read-more">Read More</button>
                      <div className="blog-stats">
                        <span className="blog-likes">❤️ {post.likes}</span>
                        <span className="blog-comments">💬 {post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            
            <div className="gallery-grid">
              {galleryPosts.map(post => (
                <div className="gallery-item" key={post.id}>
                  <div className="gallery-image-placeholder">
                    <div className="gallery-icon">🪴</div>
                  </div>
                  <div className="gallery-overlay">
                    <h3 className="plant-name">{post.plant}</h3>
                    <p className="user-name">by {post.user}</p>
                  </div>
                  <div className="gallery-details">
                    <p className="caption">{post.caption}</p>
                    <div className="gallery-stats">
                      <span className="gallery-likes">❤️ {post.likes}</span>
                      <span className="gallery-comments">💬 {post.comments}</span>
                      <span className="gallery-date">{post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;