// Education.jsx - Hybrid approach
// Import plant images directly (only these were having issues)
import React, { useState } from 'react';
import './Education.css';

// Import plant images directly 
import monsteraImage from '../assets/images/monstera.1adcde5ca2aedb6e35be.jpeg';
import snakePlantImage from '../assets/images/snake-plant.3ef0286b35a88b16db99.jpeg';
import fiddleLeafImage from '../assets/images/fiddle-leaf.156c60ff0976bd146865.jpeg';
import pothosImage from '../assets/images/pothos.66f1e2c06f7825e20421.jpeg';
import spiderPlantImage from '../assets/images/spider-plant.1c977f7f6c6a2e418cf0.jpeg';
import zzPlantImage from '../assets/images/zz-plant.7c181c45ab6059252490.jpeg';

const Education = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Plant encyclopedia data with imported images
  //Probably no backend for this data, so we can keep it as is, or, use a plant-data api 
  const plantsData = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
  
  // How-to guides data - kept as is since you said this part was working
  const guidesData = [
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
  
  // Q&A data - No changes needed here
  const questionsData = [
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
      plant.commonName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || plant.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Filter guides based on search
  const filteredGuides = guidesData.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Image error handler function
  const handleImageError = (e) => {
    console.error("Failed to load image");
    e.target.onerror = null; // Prevents infinite error loop
    e.target.src = "https://via.placeholder.com/300x200?text=Plant+Image";
  };
  
  return (
    <div className="education-page">
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
                <div className="plant-card" key={plant.id}>
                  <div className="plant-image-container">
                    <img 
                      src={plant.image} 
                      alt={plant.name} 
                      className="plant-image" 
                      onError={handleImageError}
                    />
                  </div>
                  <div className="plant-info">
                    <h3 className="plant-name">{plant.name}</h3>
                    <p className="plant-common-name">{plant.commonName}</p>
                    
                    <div className="plant-care-icons">
                      <div className="care-item" title="Light Requirements">
                        <span className="care-icon">☀️</span>
                        <span className="care-label">Light:</span>
                        <span className="care-value">{plant.light.split(' ')[0]}</span>
                      </div>
                      <div className="care-item" title="Water Requirements">
                        <span className="care-icon">💧</span>
                        <span className="care-label">Water:</span>
                        <span className="care-value">{plant.water.includes('dry') ? 'Low' : 'Moderate'}</span>
                      </div>
                      <div className="care-item" title="Difficulty Level">
                        <span className="care-icon">🌱</span>
                        <span className="care-label">Care:</span>
                        <span className="care-value">{plant.difficulty}</span>
                      </div>
                    </div>
                    
                    <p className="plant-description">{plant.description.substring(0, 100)}...</p>
                    
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
                    {guide.category === 'propagation' ? '✂️' : 
                     guide.category === 'maintenance' ? '🔄' : '🛡️'}
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
                      <span className="time-icon">⏱️</span>
                      <span>{guide.timeRequired}</span>
                    </div>
                    <button className="read-guide-btn">Read Guide</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Q&A Section - No changes needed */}
        <section className="qa-section">
          <div className="section-header">
            <h2>Plant Questions & Answers</h2>
            <p>Get expert advice for your plant care questions.</p>
            <button className="ask-question-btn">Ask a Question</button>
          </div>
          
          <div className="questions-container">
            {questionsData.map(question => (
              <div className="question-card" key={question.id}>
                <div className="question-header">
                  <h3 className="question-title">{question.question}</h3>
                  <div className="question-meta">
                    <span className="question-author">Asked by {question.askedBy}</span>
                    <span className="question-date">{question.date}</span>
                    <span className="question-category">{question.category.replace('-', ' ')}</span>
                  </div>
                </div>
                
                <div className="answers-container">
                  <h4>{question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}</h4>
                  
                  {question.answers.map(answer => (
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
                  
                  <div className="add-answer">
                    <textarea 
                      placeholder="Share your knowledge by answering this question..."
                      rows="3"
                    ></textarea>
                    <button className="submit-answer-btn">Submit Answer</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Education;