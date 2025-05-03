// CareGuidesModal.jsx
import React, { useState } from 'react';
import './CareGuidesModal.css';

const CareGuidesModal = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('basics');

  if (!isOpen) return null;

  // Plant care guide categories
  const categories = [
    { id: 'basics', name: 'Care Basics' },
    { id: 'lighting', name: 'Lighting' },
    { id: 'watering', name: 'Watering' },
    { id: 'soil', name: 'Soil & Repotting' },
    { id: 'fertilizing', name: 'Fertilizing' },
    { id: 'pests', name: 'Pest Control' },
    { id: 'propagation', name: 'Propagation' },
    { id: 'seasonal', name: 'Seasonal Care' }
  ];

  // Guide content for each category
  const guideContent = {
    basics: {
      title: 'Plant Care Basics',
      introduction: 'Understanding the fundamental needs of your houseplants is the first step to becoming a successful plant parent.',
      sections: [
        {
          heading: 'Getting Started',
          content: 'Every plant has specific needs, but most houseplants share similar basic requirements. Before bringing a new plant home, research its specific needs and make sure you can provide the right environment.',
          image: '/images/guides/plant-basics.jpg'
        },
        {
          heading: 'Understanding Plant Types',
          content: 'Plants can be broadly categorized as tropical, succulent, flowering, or foliage. Each category has general care patterns, though individual plants may have unique needs.'
        },
        {
          heading: 'Reading Plant Signals',
          content: 'Plants communicate through visible changes. Yellow leaves often indicate overwatering, while brown tips might signal low humidity or too much direct sun. Learning to read these signals is key to responsive plant care.'
        },
        {
          heading: 'Essential Tools',
          content: 'Start with quality potting soil, proper containers with drainage, pruning shears, a watering can, and a moisture meter if you\'re new to gauging soil moisture by touch.'
        }
      ]
    },
    lighting: {
      title: 'Understanding Plant Lighting Needs',
      introduction: 'Light is the energy source that powers all plant growth. Different plants have evolved to thrive in different light conditions.',
      sections: [
        {
          heading: 'Types of Light Exposure',
          content: 'Direct light: Unfiltered sunlight through a window. Bright indirect light: Near a window but no direct sun rays. Medium light: A few feet from a window. Low light: Areas further from windows or north-facing exposures.',
          image: '/images/guides/plant-lighting.jpg'
        },
        {
          heading: 'Signs of Improper Lighting',
          content: 'Too much light: Scorched or bleached leaves, wilting despite proper watering. Too little light: Leggy growth reaching toward light sources, smaller new leaves, slow or stalled growth.'
        },
        {
          heading: 'Seasonal Light Changes',
          content: 'Be aware that window exposure changes with seasons. A perfect spot in summer might be too dark in winter. You may need to relocate plants as seasons change.'
        },
        {
          heading: 'Artificial Lighting',
          content: 'If natural light is limited, consider grow lights. Look for full-spectrum LEDs that provide the right light wavelengths for photosynthesis. Position 12-30 inches above plants depending on intensity.'
        }
      ]
    },
    watering: {
      title: 'Proper Watering Techniques',
      introduction: 'Watering is perhaps the trickiest aspect of plant care to master, as both underwatering and overwatering can harm your plants.',
      sections: [
        {
          heading: 'Water Quality Matters',
          content: 'Many plants are sensitive to chemicals in tap water. Consider using filtered water, rainwater, or leaving tap water out overnight to allow chlorine to evaporate.',
          image: '/images/guides/plant-watering.jpg'
        },
        {
          heading: 'How to Water Properly',
          content: 'Water thoroughly until it flows from drainage holes, ensuring complete soil saturation. Empty drainage trays to prevent roots sitting in water. For most plants, it\'s better to water deeply and less frequently than to provide frequent shallow waterings.'
        },
        {
          heading: 'When to Water',
          content: 'Rather than following a strict schedule, check soil moisture before watering. For most plants, water when the top 1-2 inches of soil feels dry. Some plants (succulents, snake plants) prefer to dry out completely, while others (ferns, calatheas) prefer consistently moist but not soggy soil.'
        },
        {
          heading: 'Signs of Watering Issues',
          content: 'Overwatering: Yellowing leaves, soft stems, moldy soil, fungus gnats. Underwatering: Crispy brown leaf edges, curling leaves, slow growth, soil pulling away from pot edges.'
        }
      ]
    },
    soil: {
      title: 'Soil & Repotting Guide',
      introduction: 'The right soil mix and properly sized containers create the foundation for healthy plant growth.',
      sections: [
        {
          heading: 'Choosing the Right Soil',
          content: 'Different plants require different soil compositions. Most houseplants thrive in well-draining potting mix. Succulents and cacti need fast-draining, sandy mixtures. Orchids require specialized bark mixes.',
          image: '/images/guides/plant-repotting.jpg'
        },
        {
          heading: 'When to Repot',
          content: 'Signs it\'s time to repot include: roots growing through drainage holes, water running straight through the pot, slowed growth, or plant becoming top-heavy. Most houseplants benefit from repotting every 1-2 years.'
        },
        {
          heading: 'Repotting Process',
          content: 'Water plant 1-2 days before repotting. Choose a pot 1-2 inches larger in diameter. Gently remove plant, loosen root ball, and position in new pot with fresh soil around the sides. Water thoroughly and place in indirect light for a few days to recover.'
        },
        {
          heading: 'Container Considerations',
          content: 'Always select pots with drainage holes. Terra cotta pots allow soil to dry more quickly and are good for plants prone to overwatering. Plastic and glazed ceramic retain moisture longer, benefiting moisture-loving plants.'
        }
      ]
    },
    fertilizing: {
      title: 'Fertilizing Your Plants',
      introduction: 'Plants in containers eventually deplete the nutrients in their soil and benefit from supplemental feeding.',
      sections: [
        {
          heading: 'Types of Fertilizers',
          content: 'Common options include liquid fertilizers (easy to control and apply), slow-release granules (provide nutrients over months), and organic options like compost tea, worm castings, or fish emulsion.',
          image: '/images/guides/plant-fertilizing.jpg'
        },
        {
          heading: 'When to Fertilize',
          content: 'Most houseplants benefit from fertilizing during active growth seasons (spring and summer). Reduce or eliminate fertilizing during fall and winter when growth naturally slows. Never fertilize a stressed, freshly repotted, or bone-dry plant.'
        },
        {
          heading: 'How Much to Fertilize',
          content: 'Follow package instructions, but for most houseplants, dilute to half the recommended strength. It\'s better to under-fertilize than over-fertilize, which can burn roots and damage plants.'
        },
        {
          heading: 'Signs of Fertilizer Issues',
          content: 'Over-fertilization: White crust on soil, brown leaf tips/edges, wilting despite moist soil. Under-fertilization: Slow growth, smaller new leaves, pale or yellowing older leaves.'
        }
      ]
    },
    pests: {
      title: 'Preventing & Treating Plant Pests',
      introduction: 'Even indoor plants can attract pests. Early detection and proper treatment are essential for plant health.',
      sections: [
        {
          heading: 'Common Houseplant Pests',
          content: 'Spider mites: Tiny specks creating fine webbing, leaves appear dusty. Mealybugs: White, cottony clusters in leaf joints. Aphids: Small insects clustering on new growth. Scale: Bumpy brown patches that don\'t rub off easily. Fungus gnats: Small flying insects around soil.',
          image: '/images/guides/plant-pests.jpg'
        },
        {
          heading: 'Prevention Practices',
          content: 'Regularly inspect new plants and isolate for 1-2 weeks before introducing to your collection. Maintain good air circulation, avoid overwatering, and keep leaves clean by occasionally wiping with a damp cloth.'
        },
        {
          heading: 'Natural Treatments',
          content: 'For minor infestations: Spray with diluted dish soap solution (1 tsp in 1 quart water), neem oil mixture, or 70% isopropyl alcohol on a cotton swab for small areas. Heavily infested plants may need to be isolated or discarded if treatment fails.'
        },
        {
          heading: 'Systemic Options',
          content: 'For persistent problems, systemic insecticides added to soil can protect plants from the inside out. Follow package instructions carefully and keep treated plants away from beneficial insects and pollinators.'
        }
      ]
    },
    propagation: {
      title: 'Plant Propagation Methods',
      introduction: 'Propagation allows you to multiply your plant collection and share plants with friends.',
      sections: [
        {
          heading: 'Stem Cuttings',
          content: 'The most common method for vining and many leafy plants. Cut a stem section with at least one node (where leaves emerge), remove lower leaves, and place in water or moist soil. Pothos, philodendron, and monstera are excellent plants for beginners to try this method.',
          image: '/images/guides/plant-propagation.jpg'
        },
        {
          heading: 'Leaf Cuttings',
          content: 'Some plants can grow from just a leaf or leaf section. Snake plants can be cut into sections and planted upright in soil. Succulents can grow new plants from fallen leaves placed on soil. Rex begonias can be propagated by pinning a leaf with small cuts on the veins to moist soil.'
        },
        {
          heading: 'Division',
          content: 'Plants that grow in clumps or produce offsets (pups) can be separated during repotting. Gently pull apart root systems or use a clean knife to separate. Ensure each division has adequate roots and replant immediately.'
        },
        {
          heading: 'Air Layering',
          content: 'For woody plants or those resistant to other methods. Make a small cut on a stem, apply rooting hormone, wrap with moist sphagnum moss, and cover with plastic. Once roots develop in the moss, cut below the new roots and pot up the new plant.'
        }
      ]
    },
    seasonal: {
      title: 'Seasonal Plant Care',
      introduction: 'Plants respond to natural seasonal changes, even indoors. Adjusting your care routine with the seasons helps plants thrive year-round.',
      sections: [
        {
          heading: 'Spring Care',
          content: 'As days lengthen, plants enter active growth phase. Resume regular fertilizing if paused for winter. Increase watering as needed. Spring is ideal for repotting and propagation. Monitor for new growth and pests that become more active.',
          image: '/images/guides/plant-seasonal.jpg'
        },
        {
          heading: 'Summer Care',
          content: 'Watch for heat stress and increased water needs. Move sensitive plants away from hot windows. Be mindful of vacation care—group plants, set up self-watering systems, or find a plant sitter. Continue regular fertilizing and consider higher humidity for tropical plants.'
        },
        {
          heading: 'Fall Care',
          content: 'As growth slows, reduce watering and fertilizing. Bring outdoor plants inside before temperatures drop below their tolerance. Clean plants thoroughly before bringing indoors to prevent pest introduction. Gradually acclimate plants to indoor conditions.'
        },
        {
          heading: 'Winter Care',
          content: 'Most plants enter dormancy or slower growth. Significantly reduce or stop fertilizing. Water less frequently but don\'t let soil completely dry out for extended periods. Move plants away from cold drafts and heat sources. Monitor humidity as indoor heating can dry air.'
        }
      ]
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="care-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2>Plant Care Guides</h2>
        
        <div className="care-guide-container">
          <div className="care-categories">
            {categories.map(category => (
              <button 
                key={category.id}
                className={`care-category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="care-guide-content">
            <h3>{guideContent[activeCategory].title}</h3>
            <p className="guide-intro">{guideContent[activeCategory].introduction}</p>
            
            <div className="guide-sections">
              {guideContent[activeCategory].sections.map((section, index) => (
                <div className="guide-section" key={index}>
                  <div className="section-text">
                    <h4>{section.heading}</h4>
                    <p>{section.content}</p>
                  </div>
                  {section.image && (
                    <div className="section-image">
                      <img src={section.image} alt={section.heading} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="care-guide-footer">
          <p>For more detailed guides and plant-specific care information, visit our <a href="/education">Education Center</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default CareGuidesModal;
