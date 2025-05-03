// Education.jsx - Hybrid approach
// Import plant images directly (only these were having issues)
import React, { useEffect, useState } from 'react';
import './Education.css';

// Import plant images directly
import monsteraImage from '../assets/images/monstera.1adcde5ca2aedb6e35be.jpeg';
import snakePlantImage from '../assets/images/snake-plant.3ef0286b35a88b16db99.jpeg';
import fiddleLeafImage from '../assets/images/fiddle-leaf.156c60ff0976bd146865.jpeg';
import pothosImage from '../assets/images/pothos.66f1e2c06f7825e20421.jpeg';
import spiderPlantImage from '../assets/images/spider-plant.1c977f7f6c6a2e418cf0.jpeg';
import zzPlantImage from '../assets/images/zz-plant.7c181c45ab6059252490.jpeg';
import {useAuth} from '../components/Auth/AuthContext';


const Education = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [plantsData, setPlantsData] = useState([]);
  const [guidesData, setGuidesData] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for question modal
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    questionAsked: '',
    body: '',
    category: 'light' // Default category
  });

  // State for answers
  const [answers, setAnswers] = useState({});  // Object to store answers for each question

  const { user } = useAuth();
  const token = localStorage.getItem('token');


  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchPlantsData(),
          fetchGuidesData(),
          fetchQuestionsData()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);


  const baseUrl = 'http://localhost:5000/api/v1';


  const fetchPlantsData = async () => {
    try {
      const response = await fetch(`${baseUrl}/education/plants`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Plants fetched successfully:", data);
        setPlantsData(data);
        return data;
      } else {
        console.error("Failed to fetch plants:", response.status);
      }
    } catch (error) {
      console.error("Error fetching plants data:", error);
      // If we can't fetch plants, use the dummy data
      setPlantsData(plantsDataDummyArray);
    }
    return [];
  };

  const fetchGuidesData = async () => {
    try {
      const response = await fetch(`${baseUrl}/education/guides`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Guides fetched successfully:", data);
        setGuidesData(data);
        return data;
      } else {
        console.error("Failed to fetch guides:", response.status);
      }
    } catch (error) {
      console.error("Error fetching guides data:", error);
      // If we can't fetch guides, use the dummy data
      setGuidesData(guidesDataDummyArray);
    }
    return [];
  };

  const fetchQuestionsData = async () => {
    try {
      const response = await fetch(`${baseUrl}/education/questions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Questions fetched successfully:", data);
        setQuestionsData(data);
        return data;
      } else {
        console.error("Failed to fetch questions:", response.status);
      }
    } catch (error) {
      console.error("Error fetching questions data:", error);
      // If we can't fetch questions, use the dummy data
      setQuestionsData(questionsDataDummyArray);
    }
    return [];
  };

  // Plant encyclopedia dummy data with imported images (fallback if API fails)
  const plantsDataDummyArray = [
    {
      name: "Monstera Deliciosa",
      commonName: "Swiss Cheese Plant",
      category: "foliage",
      image: monsteraImage, // Changed to imported image
      light: "Moderate to bright indirect light",
      water: "Allow top inch of soil to dry between waterings",
      humidity: "Medium to high",
      temperature: "65-85°F (18-29°C)",
      soil: "Well-draining potting mix",
      difficulty: "Easy",
      toxic: "Yes, to pets and humans",
      growth: "Fast growing during spring/summer",
      propagation: "Stem cuttings or air layering",
      description: "Monstera deliciosa is famous for its large, glossy, perforated leaves. As the plant matures, the leaves develop their characteristic holes (fenestrations)."
    },
    {
      name: "Sansevieria Trifasciata",
      commonName: "Snake Plant",
      category: "succulent",
      image: snakePlantImage, // Changed to imported image
      light: "Low to bright indirect light",
      water: "Allow to dry completely between waterings",
      humidity: "Low to high",
      temperature: "60-85°F (15-29°C)",
      soil: "Well-draining, sandy soil mix",
      difficulty: "Very easy",
      toxic: "Mildly toxic to pets",
      growth: "Slow growing",
      propagation: "Division or leaf cuttings",
      description: "The Snake Plant is one of the most tolerant houseplants. Its stiff, upright leaves come in a variety of patterns and colors, and it's excellent at purifying air."
    },
    {
      name: "Ficus Lyrata",
      commonName: "Fiddle Leaf Fig",
      category: "foliage",
      image: fiddleLeafImage, // Changed to imported image
      light: "Bright indirect light",
      water: "Allow top inch of soil to dry between waterings",
      humidity: "Medium",
      temperature: "65-75°F (18-24°C)",
      soil: "Well-draining potting mix",
      difficulty: "Moderate",
      toxic: "Yes, to pets and humans",
      growth: "Moderate growing",
      propagation: "Stem cuttings",
      description: "The Fiddle Leaf Fig is popular for its large, violin-shaped leaves. It can be finicky about changes in environment, but rewards proper care with dramatic foliage."
    },
    {
      name: "Epipremnum Aureum",
      commonName: "Pothos",
      category: "vine",
      image: pothosImage, // Changed to imported image
      light: "Low to bright indirect light",
      water: "Allow to dry slightly between waterings",
      humidity: "Low to medium",
      temperature: "60-85°F (15-29°C)",
      soil: "Well-draining potting mix",
      difficulty: "Very easy",
      toxic: "Yes, to pets and humans",
      growth: "Fast growing",
      propagation: "Stem cuttings in water or soil",
      description: "Pothos is known for its trailing vines and heart-shaped leaves. It's extremely adaptable and one of the easiest houseplants to grow."
    },
    {
      name: "Chlorophytum Comosum",
      commonName: "Spider Plant",
      category: "foliage",
      image: spiderPlantImage, // Changed to imported image
      light: "Moderate to bright indirect light",
      water: "Keep soil lightly moist",
      humidity: "Medium",
      temperature: "60-75°F (15-24°C)",
      soil: "Well-draining potting mix",
      difficulty: "Easy",
      toxic: "Non-toxic to pets and humans",
      growth: "Fast growing",
      propagation: "Plantlets (spiderettes)",
      description: "The Spider Plant produces arching leaves and tiny plantlets that dangle from long stems, resembling spiders. It's excellent for beginners and pet owners."
    },
    {
      name: "Zamioculcas Zamiifolia",
      commonName: "ZZ Plant",
      category: "foliage",
      image: zzPlantImage, // Changed to imported image
      light: "Low to bright indirect light",
      water: "Allow to dry completely between waterings",
      humidity: "Low",
      temperature: "65-85°F (18-29°C)",
      soil: "Well-draining potting mix",
      difficulty: "Very easy",
      toxic: "Yes, to pets and humans",
      growth: "Slow growing",
      propagation: "Leaf cuttings or division",
      description: "The ZZ Plant has glossy, dark green leaves that grow from thick rhizomes. It's extremely drought-tolerant and can survive long periods of neglect."
    }
  ];

  // How-to guides dummy data (fallback if API fails)
  const guidesDataDummyArray = [
    {
      id: 1,
      title: "How to Propagate Houseplants",
      category: "propagation",
      image: "/images/propagation-guide.jpg", // Keep original path
      difficulty: "beginner",
      timeRequired: "15-30 minutes",
      tools: ["Clean scissors or pruning shears", "Containers for water propagation", "Potting soil", "Small pots"],
      steps: [
        "Select a healthy parent plant with multiple stems",
        "Identify the node (small bump where leaves emerge)",
        "Make a clean cut just below a node",
        "For water propagation: Place cutting in water, ensuring node is submerged",
        "For soil propagation: Dip cutting in rooting hormone (optional) and plant in moist soil",
        "Place in bright, indirect light and wait for roots to develop",
        "Once roots are 1-2 inches long, transplant water cuttings to soil"
      ],
      content: "Propagation is an amazing way to multiply your plant collection for free! Different plants require different methods, but stem cuttings work for many popular houseplants..."
    },
    {
      id: 2,
      title: "When and How to Repot Plants",
      category: "maintenance",
      image: "/images/repotting-guide.jpg", // Keep original path
      difficulty: "beginner",
      timeRequired: "30-60 minutes",
      tools: ["New pot (1-2 inches larger in diameter)", "Fresh potting mix", "Trowel", "Scissors", "Watering can"],
      steps: [
        "Determine if your plant needs repotting (roots growing through drainage holes, slowed growth)",
        "Water plant a day before repotting",
        "Prepare new pot with drainage layer if needed",
        "Gently remove plant from current pot",
        "Loosen root ball and trim any damaged roots",
        "Position in new pot and add fresh soil around the sides",
        "Water thoroughly and place in indirect light for a few days"
      ],
      content: "Repotting gives your plants fresh nutrients and room to grow. Most houseplants benefit from repotting every 1-2 years, typically in spring as growth accelerates..."
    },
    {
      id: 3,
      title: "Dealing with Common Houseplant Pests",
      category: "pest-control",
      image: "/images/pest-guide.jpg", // Keep original path
      difficulty: "intermediate",
      timeRequired: "Varies",
      tools: ["Spray bottle", "Neem oil", "Insecticidal soap", "Cotton swabs", "Sticky traps"],
      steps: [
        "Identify the pest (spider mites, mealybugs, aphids, etc.)",
        "Isolate infected plants to prevent spreading",
        "For small infestations, remove pests manually with cotton swab dipped in alcohol",
        "Spray plant thoroughly with neem oil solution or insecticidal soap",
        "Continue treatment weekly until pests are gone",
        "Preventative measures: Regular inspection, proper watering, adequate airflow"
      ],
      content: "Pests are an unfortunate reality of plant parenthood, but catching them early is key to successful treatment. This guide covers identification and treatment for common houseplant pests..."
    }
  ];

  // Q&A dummy data (fallback if API fails)
  const questionsDataDummyArray = [
    {
      id: 1,
      question: "Why are my plant's leaves turning yellow?",
      askedBy: "PlantNewbie",
      date: "3 days ago",
      category: "plant-problems",
      answers: [
        {
          id: 101,
          answeredBy: "PlantExpert",
          date: "2 days ago",
          content: "Yellowing leaves are often caused by overwatering, which can lead to root rot. Check if the soil stays wet for too long and adjust your watering schedule. Allow the top inch or so of soil to dry out between waterings for most houseplants. Other causes could be nutrient deficiencies, too much direct sunlight, or normal aging of lower leaves.",
          votes: 15
        },
        {
          id: 102,
          answeredBy: "BotanyBuff",
          date: "1 day ago",
          content: "In addition to overwatering, yellow leaves can also indicate a nitrogen deficiency, especially if it's happening to older leaves first. Consider using a balanced houseplant fertilizer during the growing season. Also, check for pests under the leaves, as spider mites can cause yellowing.",
          votes: 8
        }
      ]
    },
    {
      id: 2,
      question: "How often should I water my succulents?",
      askedBy: "DesertPlantLover",
      date: "1 week ago",
      category: "watering",
      answers: [
        {
          id: 201,
          answeredBy: "SucculentQueen",
          date: "6 days ago",
          content: "Succulents store water in their leaves and stems, so they need much less water than typical houseplants. A good rule of thumb is to water thoroughly but infrequently, allowing the soil to dry completely between waterings. In summer, this might mean watering once every 1-2 weeks, while in winter, you might only water once a month. Always ensure your pot has drainage holes and uses well-draining soil specifically for cacti and succulents.",
          votes: 22
        }
      ]
    },
    {
      id: 3,
      question: "What are the best low-light plants for a north-facing window?",
      askedBy: "ShadyApartment",
      date: "2 weeks ago",
      category: "plant-recommendations",
      answers: [
        {
          id: 301,
          answeredBy: "PlantProfessor",
          date: "13 days ago",
          content: "North-facing windows provide gentle, indirect light which is perfect for many popular houseplants! Some great options include: Snake Plants (Sansevieria), ZZ Plants, Pothos, Philodendron (especially Heart-leaf varieties), Peace Lilies, Chinese Evergreen (Aglaonema), and Cast Iron Plants. These all tolerate lower light conditions and are generally easy to care for.",
          votes: 19
        },
        {
          id: 302,
          answeredBy: "IndoorJungle",
          date: "10 days ago",
          content: "I'd add Calathea, Maranta (Prayer Plants), and ferns to that list! Just be careful not to overwater in lower light conditions, as plants use less water when they receive less light. Also, remember that 'low light tolerant' doesn't mean 'no light' - even these plants need some natural light to thrive long-term.",
          votes: 14
        }
      ]
    }
  ];

  // Filter plants based on search and category
  const filteredPlants = plantsData.filter(plant => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plant.commercialName && plant.commercialName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === 'all' || plant.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Filter guides based on search
  const filteredGuides = guidesData.filter(guide =>
    guide.title && guide.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Image error handler function - using a static local image to prevent infinite loops
  const handleImageError = (e) => {
    console.error("Failed to load image");
    e.target.onerror = null; // Prevents infinite error loop
    // Use one of our imported images as a fallback instead of an external URL
    e.target.src = monsteraImage;
  };

  // Handle input change for new question form
  const handleQuestionInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input change for answers
  const handleAnswerInputChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Submit a new question
  const submitQuestion = async () => {
    // Check if user is authenticated
    if (!user || !token) {
      alert("You need to be logged in to ask a question. Please log in and try again.");
      return;
    }

    // Validate inputs (this is now also handled by the disabled button)
    if (!newQuestion.questionAsked.trim() || !newQuestion.body.trim()) {
      return;
    }

    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(`${baseUrl}/education/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newQuestion
        })
      });

      if (response.ok) {
        // Reset form and close modal
        setNewQuestion({
          questionAsked: '',
          body: '',
          category: 'light'
        });
        setShowQuestionModal(false);

        // Refresh questions data
        await fetchQuestionsData();

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Your question has been submitted successfully!';
        document.body.appendChild(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
          successMessage.classList.add('fade-out');
          setTimeout(() => {
            document.body.removeChild(successMessage);
          }, 500);
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to submit question'}`);
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("Failed to submit question. Please try again.");
    } finally {
      // Reset button state
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  };

  // Submit an answer to a question
  const submitAnswer = async (questionId) => {
    // Check if user is authenticated
    if (!user || !token) {
      alert("You need to be logged in to answer a question. Please log in and try again.");
      return;
    }

    if (!answers[questionId] || !answers[questionId].trim()) {
      alert("Please enter your answer");
      return;
    }

    // Find the submit button for this specific answer
    const submitBtn = document.querySelector(`button[data-question-id="${questionId}"]`);
    if (submitBtn) {
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
    }

    try {
      const response = await fetch(`${baseUrl}/education/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          body: answers[questionId],
          questionAnswered: questionId,
        })
      });

      if (response.ok) {
        // Clear the answer input
        setAnswers(prev => ({
          ...prev,
          [questionId]: ''
        }));

        // Refresh questions data
        await fetchQuestionsData();

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Your answer has been submitted successfully!';
        document.body.appendChild(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
          successMessage.classList.add('fade-out');
          setTimeout(() => {
            document.body.removeChild(successMessage);
          }, 500);
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to submit answer'}`);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer. Please try again.");
    } finally {
      // Reset button state
      const submitBtn = document.querySelector(`button[data-question-id="${questionId}"]`);
      if (submitBtn) {
        submitBtn.textContent = 'Submit Answer';
        submitBtn.disabled = false;
      }
    }
  };

  // Handle voting on answers
  const handleVote = async (answerId, voteType) => {
    // Check if user is authenticated
    if (!user || !token) {
      alert("You need to be logged in to vote on answers. Please log in and try again.");
      return;
    }

    if (!answerId) return;

    try {
      const endpoint = voteType === 'up'
        ? `${baseUrl}/education/answers/upvote/${answerId}`
        : `${baseUrl}/education/answers/downvote/${answerId}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh the questions data to show updated votes
        await fetchQuestionsData();

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = `You ${voteType === 'up' ? 'upvoted' : 'downvoted'} the answer.`;
        document.body.appendChild(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
          successMessage.classList.add('fade-out');
          setTimeout(() => {
            document.body.removeChild(successMessage);
          }, 500);
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || `Failed to ${voteType === 'up' ? 'upvote' : 'downvote'} answer`}`);
      }
    } catch (error) {
      console.error(`Error ${voteType === 'up' ? 'upvoting' : 'downvoting'} answer:`, error);
      alert(`Failed to ${voteType === 'up' ? 'upvote' : 'downvote'} answer. Please try again.`);
    }
  };

  return (
    <div className="education-page">
      {/* Floating Ask Question Button - Always visible */}
      <button
        className="floating-ask-btn"
        onClick={() => setShowQuestionModal(true)}
        title="Ask a Question"
      >
        <span>+</span>
      </button>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading plant data...</p>
        </div>
      ) : (
        <>
          <div className="education-header">
            <div className="container">
              <h1>Plant Education Center</h1>
              <p>Expand your plant knowledge with our comprehensive resources, guides, and expert advice.</p>

              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search plants, guides, and questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-button">Search</button>
              </div>
            </div>
          </div>

      <div className="education-content container">
        {/* Plant Encyclopedia Section */}
        <section className="encyclopedia-section">
          <div className="section-header">
            <h2>Plant Encyclopedia</h2>
            <p>Discover detailed information about a wide variety of houseplants.</p>
          </div>

          <div className="category-filters">
            <button
              className={`category-button ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Plants
            </button>
            <button
              className={`category-button ${activeCategory === 'foliage' ? 'active' : ''}`}
              onClick={() => setActiveCategory('foliage')}
            >
              Foliage Plants
            </button>
            <button
              className={`category-button ${activeCategory === 'succulent' ? 'active' : ''}`}
              onClick={() => setActiveCategory('succulent')}
            >
              Succulents & Cacti
            </button>
            <button
              className={`category-button ${activeCategory === 'vine' ? 'active' : ''}`}
              onClick={() => setActiveCategory('vine')}
            >
              Climbing & Trailing
            </button>
            <button
              className={`category-button ${activeCategory === 'flowering' ? 'active' : ''}`}
              onClick={() => setActiveCategory('flowering')}
            >
              Flowering Plants
            </button>
          </div>
          <div className="plants-grid">
            {filteredPlants.length > 0 ? (
              filteredPlants.map(plant => (
                <div className="plant-card" key={plant._id}>
                  <div className="plant-image-container">
                    <img
                      src={plant.image || "https://via.placeholder.com/300x200?text=Plant+Image"}
                      alt={plant.name}
                      className="plant-image"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="plant-info">
                    <h3 className="plant-name">{plant.name}</h3>
                    <p className="plant-common-name">{plant.commercialName || "Common Name Not Available"}</p>

                    <div className="plant-care-icons">
                      <div className="care-item" title="Light Requirements">
                        <span className="care-icon">☀</span>
                        <span className="care-label">Light:</span>
                        <span className="care-value">{plant.light}</span>
                      </div>
                      <div className="care-item" title="Water Requirements">
                        <span className="care-icon">💧</span>
                        <span className="care-label">Water:</span>
                        <span className="care-value">{plant.water && plant.water.includes('dry') ? 'Low' : 'Moderate'}</span>
                      </div>
                      <div className="care-item" title="Difficulty Level">
                        <span className="care-icon">🌱</span>
                        <span className="care-label">Care:</span>
                        <span className="care-value">{plant.difficulty}</span>
                      </div>
                    </div>

                    <p className="plant-description">{plant.description && plant.description.substring(0, 100)}...</p>

                    <button className="view-details-btn">View Details</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No plants found matching your search criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* How-To Guides Section */}
        <section className="guides-section">
          <div className="section-header">
            <h2>How-To Guides</h2>
            <p>Step-by-step instructions for common plant care tasks and projects.</p>
          </div>

          <div className="guides-grid">
            {filteredGuides.map(guide => (
              <div className="guide-card" key={guide.id}>
                <div className="guide-image-container">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="guide-image"
                    onError={handleImageError}
                  />
                  <div className="guide-icon">
                    {guide.category === 'propagation' ? '✂' :
                     guide.category === 'maintenance' ? '🔄' : '🛡'}
                  </div>
                </div>
                <div className="guide-content">
                  <div className="guide-meta">
                    <span className="guide-category">{guide.category.replace('-', ' ')}</span>
                    <span className="guide-difficulty">{guide.difficulty}</span>
                  </div>
                  <h3 className="guide-title">{guide.title}</h3>
                  <p className="guide-excerpt">{guide.content.substring(0, 120)}...</p>

                  <div className="guide-details">
                    <div className="guide-time">
                      <span className="time-icon">⏱</span>
                      <span>{guide.timeRequired}</span>
                    </div>
                    <button className="read-guide-btn">Read Guide</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Q&A Section */}
        <section className="qa-section">
          <div className="section-header">
            <h2>Plant Questions & Answers</h2>
            <p>Get expert advice for your plant care questions.</p>
            <button
              className="ask-question-btn"
              onClick={() => setShowQuestionModal(true)}
            >
              Ask a Question
            </button>
          </div>

          {/* Question Modal */}
          {showQuestionModal && (
            <div className="modal-overlay" onClick={(e) => {
              // Close modal when clicking outside
              if (e.target.className === 'modal-overlay') {
                setShowQuestionModal(false);
              }
            }}>
              <div className="question-modal">
                <div className="modal-header">
                  <h3>Ask a Plant Question</h3>
                  <button className="close-modal" onClick={() => setShowQuestionModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <p className="modal-instruction">Share your plant care questions with our community. Be specific to get the best answers!</p>

                  <div className="form-group">
                    <label htmlFor="questionAsked">Question Title: <span className="required">*</span></label>
                    <input
                      type="text"
                      id="questionAsked"
                      name="questionAsked"
                      value={newQuestion.questionAsked}
                      onChange={handleQuestionInputChange}
                      placeholder="e.g., How often should I water my monstera?"
                      className={!newQuestion.questionAsked.trim() ? 'input-error' : ''}
                    />
                    {!newQuestion.questionAsked.trim() && (
                      <span className="error-message">Please enter a question title</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="body">Question Details: <span className="required">*</span></label>
                    <textarea
                      id="body"
                      name="body"
                      value={newQuestion.body}
                      onChange={handleQuestionInputChange}
                      rows="4"
                      placeholder="Provide more details about your question..."
                      className={!newQuestion.body.trim() ? 'input-error' : ''}
                    ></textarea>
                    {!newQuestion.body.trim() && (
                      <span className="error-message">Please provide details about your question</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category: <span className="required">*</span></label>
                    <select
                      id="category"
                      name="category"
                      value={newQuestion.category}
                      onChange={handleQuestionInputChange}
                    >
                      <option value="light">Light</option>
                      <option value="water">Water</option>
                      <option value="humidity">Humidity</option>
                      <option value="temperature">Temperature</option>
                      <option value="soil">Soil</option>
                      <option value="difficulty">Difficulty</option>
                      <option value="toxic">Toxicity</option>
                      <option value="growth">Growth</option>
                      <option value="propagation">Propagation</option>
                      <option value="description">General</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={() => setShowQuestionModal(false)}>Cancel</button>
                  <button
                    className="submit-btn"
                    onClick={submitQuestion}
                    disabled={!newQuestion.questionAsked.trim() || !newQuestion.body.trim()}
                  >
                    Submit Question
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add a clear call-to-action for asking questions */}
          <div className="ask-question-container">
            <button
              className="big-ask-question-btn"
              onClick={() => setShowQuestionModal(true)}
            >
              + Ask a New Question
            </button>
            <p>Have a plant care question? Our community is here to help!</p>
          </div>

          <div className="questions-container">
            {questionsData.length > 0 ? (
              questionsData.map(question => (
                <div className="question-card" key={question._id || question.id}>
                  <div className="question-header">
                    <h3 className="question-title">{question.questionAsked || question.question}</h3>
                    <div className="question-meta">
                      <span className="question-author">
                        Asked by {question.user?.name || question.askedBy || "Anonymous"}
                      </span>
                      <span className="question-date">
                        {question.createdAt
                          ? new Date(question.createdAt).toLocaleDateString()
                          : question.date || "Unknown date"}
                      </span>
                      <span className="question-category">
                        {question.category && question.category.replace('-', ' ')}
                      </span>
                    </div>
                    {question.body && (
                      <div className="question-body">
                        <p>{question.body}</p>
                      </div>
                    )}
                  </div>

                  <div className="answers-container">
                    {/* Handle both database structure and dummy data structure */}
                    {question.replies ? (
                      // Database structure
                      <>
                        <h4>{question.replies.length} Answer{question.replies.length !== 1 ? 's' : ''}</h4>

                        {question.replies.length > 0 ? (
                          question.replies.map(answer => (
                            <div className="answer" key={answer._id}>
                              <div className="answer-content">
                                <p>{answer.body}</p>
                              </div>
                              <div className="answer-footer">
                                <div className="answer-meta">
                                  <span className="answer-author">
                                    Answered by {answer.user?.name || "Anonymous"}
                                  </span>
                                  <span className="answer-date">
                                    {answer.createdAt
                                      ? new Date(answer.createdAt).toLocaleDateString()
                                      : "Unknown date"}
                                  </span>
                                </div>
                                <div className="answer-votes">
                                  <button
                                    className="vote-btn upvote"
                                    onClick={() => handleVote(answer._id, 'up')}
                                  >▲</button>
                                  <span className="vote-count">{answer.upVotes || 0}</span>
                                  <button
                                    className="vote-btn downvote"
                                    onClick={() => handleVote(answer._id, 'down')}
                                  >▼</button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="no-answers">No answers yet. Be the first to answer!</p>
                        )}
                      </>
                    ) : (
                      // Dummy data structure
                      <>
                        <h4>{question.answers?.length || 0} Answer{question.answers?.length !== 1 ? 's' : ''}</h4>

                        {question.answers && question.answers.map(answer => (
                          <div className="answer" key={answer.id}>
                            <div className="answer-content">
                              <p>{answer.content}</p>
                            </div>
                            <div className="answer-footer">
                              <div className="answer-meta">
                                <span className="answer-author">Answered by {answer.answeredBy}</span>
                                <span className="answer-date">{answer.date}</span>
                              </div>
                              <div className="answer-votes">
                                <button className="vote-btn upvote">▲</button>
                                <span className="vote-count">{answer.votes}</span>
                                <button className="vote-btn downvote">▼</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    <div className="add-answer">
                      <textarea
                        placeholder="Share your knowledge by answering this question..."
                        rows="3"
                        value={answers[question._id || question.id] || ''}
                        onChange={(e) => handleAnswerInputChange(question._id || question.id, e.target.value)}
                      ></textarea>
                      <button
                        className="submit-answer-btn"
                        onClick={() => submitAnswer(question._id || question.id)}
                        data-question-id={question._id || question.id}
                        disabled={!answers[question._id || question.id] || !answers[question._id || question.id].trim()}
                      >
                        Submit Answer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-questions">
                <p>No questions found. Be the first to ask a question!</p>
              </div>
            )}
          </div>
        </section>
      </div>
        </>
      )}
    </div>
  );
};

export default Education;
