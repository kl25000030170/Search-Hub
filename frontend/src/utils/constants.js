// Multi-category search platform catalog
export const PLATFORM_NAME = 'SearchHub';
export const PLATFORM_TAGLINE = 'Multi-Category Search & Filter Platform';

export const CATEGORIES = [
  'Electronics',
  'Education',
  'Books',
  'Courses',
  'Learning Resources',
  'Technology Tools',
];

export const normalizeItem = (item) => ({
  ...item,
  image: item.image || item.images?.[0],
  images: item.images || (item.image ? [item.image] : []),
  reviews: item.reviewsCount ?? item.reviews ?? 0,
  tags: item.tags || [],
  attributes:
    item.attributes ||
    (item.specifications || []).map((s) =>
      typeof s === 'object' ? s : { name: 'Spec', value: String(s) }
    ),
  difficulty: item.difficulty || 'Beginner',
});

const RAW_ITEMS = [
  {
    id: 1,
    title: 'Bluetooth Speaker Pro',
    description:
      'Portable wireless speaker with deep bass, 12-hour battery life, and IPX7 water resistance. Ideal for study sessions and outdoor use.',
    category: 'Electronics',
    brand: 'SoundWave',
    price: 79,
    rating: 4.6,
    reviewsCount: 218,
    tags: ['wireless', 'audio', 'portable'],
    difficulty: 'Beginner',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    ],
    attributes: [
      { name: 'Brand', value: 'SoundWave' },
      { name: 'Battery', value: '12 hours' },
      { name: 'Rating', value: '4.6' },
    ],
  },
  {
    id: 2,
    title: 'Python Beginner Course',
    description:
      'Hands-on introduction to Python covering variables, loops, functions, and small projects. Includes exercises and certificate of completion.',
    category: 'Courses',
    brand: 'CodeAcademy Plus',
    price: 49,
    rating: 4.8,
    reviewsCount: 1240,
    tags: ['python', 'programming', 'beginner'],
    difficulty: 'Beginner',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    ],
    attributes: [
      { name: 'Difficulty Level', value: 'Beginner' },
      { name: 'Duration', value: '24 hours' },
      { name: 'Format', value: 'Video + Labs' },
    ],
  },
  {
    id: 3,
    title: 'Java Programming Book',
    description:
      'Comprehensive guide to Java fundamentals, OOP, collections, and modern Java features with practice problems and interview tips.',
    category: 'Books',
    brand: 'TechPress',
    price: 35,
    rating: 4.7,
    reviewsCount: 512,
    tags: ['java', 'programming', 'reference'],
    difficulty: 'Intermediate',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    ],
    attributes: [
      { name: 'Author', value: 'Dr. Elena Park' },
      { name: 'Pages', value: '640' },
      { name: 'Edition', value: '5th' },
    ],
  },
  {
    id: 4,
    title: 'Smart Watch Series X',
    description:
      'Fitness tracking, heart-rate monitoring, GPS, and notifications in a lightweight wearable with week-long battery in smart mode.',
    category: 'Technology Tools',
    brand: 'PulseTech',
    price: 199,
    rating: 4.5,
    reviewsCount: 890,
    tags: ['wearable', 'fitness', 'smart'],
    difficulty: 'Beginner',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&auto=format&fit=crop&q=80',
    ],
    attributes: [
      { name: 'Brand', value: 'PulseTech' },
      { name: 'Water Resistance', value: '50m' },
      { name: 'Display', value: 'AMOLED' },
    ],
  },
  {
    id: 5,
    title: 'Data Structures Study Kit',
    description:
      'Curated learning resources including cheat sheets, visual guides, and practice datasets for mastering data structures.',
    category: 'Learning Resources',
    brand: 'LearnStack',
    price: 29,
    rating: 4.4,
    reviewsCount: 156,
    tags: ['study', 'algorithms', 'resources'],
    difficulty: 'Intermediate',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    ],
    attributes: [
      { name: 'Format', value: 'Digital bundle' },
      { name: 'Topics', value: 'Arrays, Trees, Graphs' },
      { name: 'Difficulty Level', value: 'Intermediate' },
    ],
  },
  {
    id: 6,
    title: 'Machine Learning Fundamentals',
    description:
      'University-style education module covering supervised learning, model evaluation, and practical ML workflows with notebooks.',
    category: 'Education',
    brand: 'EduSphere',
    price: 89,
    rating: 4.9,
    reviewsCount: 678,
    tags: ['ml', 'ai', 'education'],
    difficulty: 'Advanced',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop&q=80',
    ],
    attributes: [
      { name: 'Difficulty Level', value: 'Advanced' },
      { name: 'Modules', value: '12' },
      { name: 'Certificate', value: 'Yes' },
    ],
  },
  {
    id: 7,
    title: 'Wireless Noise-Cancelling Headphones',
    description:
      'Premium over-ear headphones with adaptive ANC, multi-device pairing, and studio-grade audio for focused learning.',
    category: 'Electronics',
    brand: 'AudioPro',
    price: 249,
    rating: 4.8,
    reviewsCount: 2034,
    tags: ['wireless', 'audio', 'noise-cancelling'],
    difficulty: 'Beginner',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    ],
    attributes: [
      { name: 'Brand', value: 'AudioPro' },
      { name: 'Battery', value: '30 hours' },
      { name: 'ANC', value: 'Adaptive' },
    ],
  },
  {
    id: 8,
    title: 'Cloud DevOps Toolkit License',
    description:
      'Technology tools bundle for CI/CD pipelines, container management, and infrastructure-as-code templates for student projects.',
    category: 'Technology Tools',
    brand: 'DevCloud',
    price: 120,
    rating: 4.3,
    reviewsCount: 94,
    tags: ['devops', 'cloud', 'tools'],
    difficulty: 'Advanced',
    inStock: false,
    images: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    ],
    attributes: [
      { name: 'License', value: '1 year' },
      { name: 'Platforms', value: 'AWS, Azure, GCP' },
      { name: 'Difficulty Level', value: 'Advanced' },
    ],
  },
  {
    id: 9,
    title: 'Wireless Fast Charging Pad',
    description: '15W Qi-certified rapid wireless charging stand with temperature control and slip-resistant silicone surface.',
    category: 'Electronics',
    brand: 'PowerUp',
    price: 25,
    rating: 4.5,
    reviewsCount: 142,
    tags: ['wireless', 'charger', 'accessory'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Output', value: '15W Fast Charge' },
      { name: 'Connector', value: 'USB-C' },
      { name: 'Certification', value: 'Qi Certified' }
    ]
  },
  {
    id: 10,
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack engineering with HTML, CSS, JavaScript, Node, and React. Includes projects and certification.',
    category: 'Courses',
    brand: 'DevLearn Academy',
    price: 99,
    rating: 4.9,
    reviewsCount: 4205,
    tags: ['webdev', 'programming', 'javascript'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Difficulty Level', value: 'Beginner to Expert' },
      { name: 'Duration', value: '65 hours' },
      { name: 'Projects', value: '15 full apps' }
    ]
  },
  {
    id: 11,
    title: 'Introduction to Algorithms Book',
    description: 'The definitive reference guide to algorithms and data structures, featuring rigorous mathematical analyses.',
    category: 'Books',
    brand: 'MIT Press',
    price: 85,
    rating: 4.8,
    reviewsCount: 812,
    tags: ['algorithms', 'math', 'reference'],
    difficulty: 'Advanced',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Author', value: 'Thomas H. Cormen' },
      { name: 'Pages', value: '1312' },
      { name: 'Edition', value: '4th' }
    ]
  },
  {
    id: 12,
    title: 'Smart LED Desk Lamp',
    description: 'Eye-friendly dimmable desk lamp with 5 brightness levels, USB charging port, and auto-off timer.',
    category: 'Electronics',
    brand: 'LumiLight',
    price: 45,
    rating: 4.6,
    reviewsCount: 388,
    tags: ['lighting', 'smart', 'office'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Color Temp', value: '3000K-6000K' },
      { name: 'Dimmable', value: '5 Modes' },
      { name: 'USB Port', value: '5V/1A' }
    ]
  },
  {
    id: 13,
    title: 'Cyber Security Handbook',
    description: 'Essential guide on network defense, cryptography, vulnerability analysis, and incident response.',
    category: 'Books',
    brand: 'SecurityPress',
    price: 42,
    rating: 4.7,
    reviewsCount: 231,
    tags: ['security', 'hacking', 'reference'],
    difficulty: 'Intermediate',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Author', value: 'Marcus V. Cole' },
      { name: 'Format', value: 'Hardcover' },
      { name: 'Level', value: 'Intermediate' }
    ]
  },
  {
    id: 14,
    title: 'React.js Masterclass',
    description: 'Deep dive into hooks, state management (Zustand/Redux), performance tuning, and routing.',
    category: 'Courses',
    brand: 'ReactPros',
    price: 59,
    rating: 4.8,
    reviewsCount: 1540,
    tags: ['react', 'javascript', 'frontend'],
    difficulty: 'Intermediate',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Duration', value: '28 hours' },
      { name: 'Framework', value: 'React 19' },
      { name: 'Projects', value: '3 advanced projects' }
    ]
  },
  {
    id: 15,
    title: 'Arduino Ultimate Starter Kit',
    description: 'Comprehensive electronics components kit with UNO R3 controller board, sensor modules, and step-by-step guides.',
    category: 'Technology Tools',
    brand: 'Arduino-Compatible',
    price: 65,
    rating: 4.7,
    reviewsCount: 645,
    tags: ['iot', 'electronics', 'starter'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Board', value: 'UNO R3' },
      { name: 'Components', value: '200+ parts' },
      { name: 'Tutorials', value: '35 lessons' }
    ]
  },
  {
    id: 16,
    title: 'AI and Neural Networks',
    description: 'Academic learning module covering deep learning, gradient descent, backpropagation, and NLP.',
    category: 'Education',
    brand: 'EduSphere',
    price: 95,
    rating: 4.9,
    reviewsCount: 420,
    tags: ['ai', 'math', 'education'],
    difficulty: 'Advanced',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Modules', value: '16' },
      { name: 'Prerequisite', value: 'Calculus + Python' },
      { name: 'Certificate', value: 'Yes' }
    ]
  },
  {
    id: 17,
    title: 'JavaScript Quick Reference Guide',
    description: 'Cheat sheets and code snippets for modern ES6+ features, promises, and async programming paradigms.',
    category: 'Learning Resources',
    brand: 'LearnStack',
    price: 15,
    rating: 4.5,
    reviewsCount: 97,
    tags: ['study', 'javascript', 'resources'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Format', value: 'PDF Booklet + Code Files' },
      { name: 'Topics', value: 'ES6, Async, DOM' },
      { name: 'Updates', value: 'Lifetime Free' }
    ]
  },
  {
    id: 18,
    title: 'Mechanical Gaming Keyboard',
    description: 'Tactile mechanical switches, customizable RGB backlighting, and programmable macro keys for coding/gaming.',
    category: 'Electronics',
    brand: 'KeyPro',
    price: 110,
    rating: 4.6,
    reviewsCount: 521,
    tags: ['hardware', 'gaming', 'keyboard'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Switches', value: 'Brown Mechanical' },
      { name: 'Backlight', value: 'Per-key RGB' },
      { name: 'Layout', value: 'Tenkeyless' }
    ]
  },
  {
    id: 19,
    title: 'Ultra-Wide Productivity Monitor',
    description: '34-inch curved ultra-wide monitor with 144Hz refresh rate, USB-C power delivery, and picture-in-picture mode.',
    category: 'Electronics',
    brand: 'ViewMax',
    price: 499,
    rating: 4.8,
    reviewsCount: 189,
    tags: ['monitor', 'screen', 'productivity'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Resolution', value: '3440 x 1440' },
      { name: 'Curve', value: '1500R' },
      { name: 'Power Delivery', value: '90W USB-C' }
    ]
  },
  {
    id: 20,
    title: 'Deep Learning Bootcamp',
    description: 'Master PyTorch, TensorFlow, CNNs, RNNs, and Transformers with hands-on computer vision and NLP coding labs.',
    category: 'Courses',
    brand: 'NeuroAcademy',
    price: 120,
    rating: 4.9,
    reviewsCount: 954,
    tags: ['ai', 'python', 'deeplearning'],
    difficulty: 'Advanced',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Duration', value: '45 hours' },
      { name: 'Frameworks', value: 'PyTorch, TensorFlow' },
      { name: 'Labs', value: '12 Jupyter Projects' }
    ]
  },
  {
    id: 21,
    title: 'Design Patterns Reference Book',
    description: 'Elements of Reusable Object-Oriented Software. The classic catalog of 23 software engineering design patterns.',
    category: 'Books',
    brand: 'Addison-Wesley',
    price: 55,
    rating: 4.7,
    reviewsCount: 1420,
    tags: ['designpatterns', 'oop', 'reference'],
    difficulty: 'Intermediate',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Authors', value: 'Gang of Four' },
      { name: 'Language', value: 'C++, Smalltalk examples' },
      { name: 'Pages', value: '395' }
    ]
  },
  {
    id: 22,
    title: 'Noise-Cancelling Wireless Earbuds',
    description: 'Active noise-cancelling true wireless earbuds with custom touch controls, water resistance, and 24h battery case.',
    category: 'Electronics',
    brand: 'SoundWave',
    price: 129,
    rating: 4.6,
    reviewsCount: 789,
    tags: ['audio', 'wireless', 'earbuds'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'ANC', value: 'Up to 35dB' },
      { name: 'Battery', value: '6h earbuds + 18h case' },
      { name: 'Waterproof', value: 'IPX5' }
    ]
  },
  {
    id: 23,
    title: 'Docker & Kubernetes Handbook',
    description: 'Learn containerization, service orchestration, config management, and modern cloud deployment architectures.',
    category: 'Books',
    brand: 'CloudPress',
    price: 49,
    rating: 4.8,
    reviewsCount: 312,
    tags: ['docker', 'devops', 'reference'],
    difficulty: 'Intermediate',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Author', value: 'Nigel Poulton' },
      { name: 'Format', value: 'Paperback' },
      { name: 'Release Year', value: '2024' }
    ]
  },
  {
    id: 24,
    title: 'Mobile App Development with Flutter',
    description: 'Build native iOS and Android apps using Dart, Flutter SDK, state management, and Firebase backends.',
    category: 'Courses',
    brand: 'CodeAcademy Plus',
    price: 79,
    rating: 4.7,
    reviewsCount: 1201,
    tags: ['flutter', 'dart', 'mobile'],
    difficulty: 'Intermediate',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Duration', value: '38 hours' },
      { name: 'SDK Version', value: 'Flutter 3.x' },
      { name: 'Type', value: 'Self-paced' }
    ]
  },
  {
    id: 25,
    title: 'Raspberry Pi 4 Starter Kit',
    description: '4GB RAM Raspberry Pi 4 Model B board with power supply, casing, HDMI cables, and 32GB MicroSD preloaded.',
    category: 'Technology Tools',
    brand: 'PiFoundation-Compatible',
    price: 95,
    rating: 4.8,
    reviewsCount: 843,
    tags: ['iot', 'hardware', 'kit'],
    difficulty: 'Intermediate',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'RAM', value: '4GB LPDDR4' },
      { name: 'Storage', value: '32GB MicroSD' },
      { name: 'SoC', value: 'Broadcom BCM2711' }
    ]
  },
  {
    id: 26,
    title: 'Statistics & Probability for Data Science',
    description: 'Rigorous module on statistical modeling, hypothesis testing, Bayes theorem, and regression frameworks.',
    category: 'Education',
    brand: 'EduSphere',
    price: 75,
    rating: 4.6,
    reviewsCount: 310,
    tags: ['math', 'datascience', 'education'],
    difficulty: 'Intermediate',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Modules', value: '10' },
      { name: 'Language', value: 'Python / R code labs' },
      { name: 'Prerequisite', value: 'College Algebra' }
    ]
  },
  {
    id: 27,
    title: 'Python Cheat Sheet Card',
    description: 'Double-sided laminated quick reference sheet covering loops, functions, lists, dicts, and built-in modules.',
    category: 'Learning Resources',
    brand: 'LearnStack',
    price: 9,
    rating: 4.4,
    reviewsCount: 154,
    tags: ['python', 'study', 'resources'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Dimensions', value: '8.5 x 11 inches' },
      { name: 'Laminated', value: 'Yes' },
      { name: 'Reference', value: 'Python 3.12' }
    ]
  },
  {
    id: 28,
    title: 'Ergonomic Vertical Mouse',
    description: 'Wireless vertical mouse designed to reduce wrist strain, featuring customizable DPI and 6 programmable buttons.',
    category: 'Electronics',
    brand: 'KeyPro',
    price: 39,
    rating: 4.5,
    reviewsCount: 421,
    tags: ['mouse', 'ergonomic', 'hardware'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Connection', value: '2.4GHz + Bluetooth' },
      { name: 'DPI Levels', value: '800 / 1200 / 1600' },
      { name: 'Battery', value: 'Rechargeable Li-ion' }
    ]
  },
  {
    id: 29,
    title: 'Smart Home Wifi Thermostat',
    description: 'Energy-saving programmable smart thermostat that learns your schedule and controls home temperature via mobile app.',
    category: 'Electronics',
    brand: 'NestEco',
    price: 149,
    rating: 4.6,
    reviewsCount: 312,
    tags: ['smarthome', 'hvac', 'energy'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1545259742-b4fd8fea67e4?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Compatibility', value: '24V Systems' },
      { name: 'Wifi', value: '2.4GHz / 5GHz' },
      { name: 'Display', value: 'Color LCD' }
    ]
  },
  {
    id: 30,
    title: 'SQL & Relational Databases Guide',
    description: 'Comprehensive study of SQL syntax, relational theory, query optimization, indexing strategies, and normalization.',
    category: 'Books',
    brand: 'DBPress',
    price: 39,
    rating: 4.7,
    reviewsCount: 168,
    tags: ['sql', 'database', 'reference'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Author', value: 'Alan R. Feather' },
      { name: 'Pages', value: '450' },
      { name: 'SQL Flavors', value: 'PostgreSQL, MySQL' }
    ]
  },
  {
    id: 31,
    title: 'Professional Quadcopter Drone',
    description: 'Foldable quadcopter drone equipped with 4K UHD video camera, GPS return-to-home, and brushless motors for stable flight.',
    category: 'Electronics',
    brand: 'AeroSky',
    price: 299,
    rating: 4.8,
    reviewsCount: 94,
    tags: ['drone', 'camera', 'hobbies'],
    difficulty: 'Intermediate',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Camera', value: '4K Ultra HD' },
      { name: 'Flight Time', value: '30 minutes' },
      { name: 'Range', value: '3 kilometers' }
    ]
  },
  {
    id: 32,
    title: 'UI/UX Design Fundamentals Course',
    description: 'Learn modern digital product design, wireframing, high-fidelity prototyping, typography, and user testing using Figma.',
    category: 'Courses',
    brand: 'DesignSchool',
    price: 69,
    rating: 4.8,
    reviewsCount: 1045,
    tags: ['uiux', 'figma', 'design'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1561070791-26c113006238?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Software', value: 'Figma' },
      { name: 'Format', value: 'On-demand Videos' },
      { name: 'Portfolio Projects', value: '4 UI layouts' }
    ]
  },
  {
    id: 33,
    title: 'DIY 3D Printer Kit',
    description: 'FDM 3D printer kit with high-precision printing nozzle, heated bed platform, and auto-resume printing function.',
    category: 'Technology Tools',
    brand: 'MakerForge',
    price: 249,
    rating: 4.5,
    reviewsCount: 156,
    tags: ['3dprinting', 'maker', 'hardware'],
    difficulty: 'Intermediate',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Build Volume', value: '220 x 220 x 250 mm' },
      { name: 'Filament', value: 'PLA, ABS, TPU' },
      { name: 'Nozzle Temp', value: 'Up to 260°C' }
    ]
  },
  {
    id: 34,
    title: 'Digital DSLR Camera Bundle',
    description: '24.1 MP DSLR camera kit with 18-55mm lens, wireless connectivity, camera bag, and 64GB high-speed memory card.',
    category: 'Electronics',
    brand: 'Optix',
    price: 450,
    rating: 4.7,
    reviewsCount: 204,
    tags: ['photography', 'camera', 'bundle'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Sensor', value: '24.1 MP APS-C CMOS' },
      { name: 'Lens', value: 'EF-S 18-55mm f/3.5-5.6' },
      { name: 'Connectivity', value: 'Wi-Fi / NFC' }
    ]
  },
  {
    id: 35,
    title: 'Blockchain & Smart Contracts Module',
    description: 'Academic course covering cryptography foundations, decentralization, Ethereum Solidity, and ERC-20 token standards.',
    category: 'Education',
    brand: 'CryptEdu',
    price: 89,
    rating: 4.6,
    reviewsCount: 182,
    tags: ['blockchain', 'solidity', 'education'],
    difficulty: 'Advanced',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Difficulty Level', value: 'Advanced' },
      { name: 'Coding Language', value: 'Solidity' },
      { name: 'Assessment', value: 'Practical projects' }
    ]
  },
  {
    id: 36,
    title: 'Git & GitHub Tutorial Guide',
    description: 'Interactive resource for mastering git branching, staging, rebasing, merge conflict resolution, and pull requests.',
    category: 'Learning Resources',
    brand: 'LearnStack',
    price: 19,
    rating: 4.5,
    reviewsCount: 88,
    tags: ['git', 'github', 'resources'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Format', value: 'Interactive Sandbox' },
      { name: 'Content', value: 'Cheat sheets + CLI practice' },
      { name: 'License', value: 'Lifetime access' }
    ]
  },
  {
    id: 37,
    title: 'Clean Code & Architecture Handbook',
    description: 'A handbook of agile software craftsmanship. Master SOLID principles, code smells, refactoring, and clean architecture design.',
    category: 'Books',
    brand: 'TechPress',
    price: 45,
    rating: 4.9,
    reviewsCount: 652,
    tags: ['programming', 'software', 'reference'],
    difficulty: 'Intermediate',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Author', value: 'Robert C. Martin' },
      { name: 'Pages', value: '464' },
      { name: 'Topic', value: 'Software Quality' }
    ]
  },
  {
    id: 38,
    title: 'Smart Fingerprint Door Lock',
    description: 'Keyless entry smart lock featuring biometric fingerprint identification, electronic keypad, auto-lock mechanism, and emergency key.',
    category: 'Electronics',
    brand: 'SecureHome',
    price: 179,
    rating: 4.6,
    reviewsCount: 115,
    tags: ['security', 'smarthome', 'hardware'],
    difficulty: 'Beginner',
    inStock: true,
    images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Unlock Methods', value: 'Fingerprint, Code, Key' },
      { name: 'Memory', value: '100 Fingerprints' },
      { name: 'Battery', value: '4 AA Batteries' }
    ]
  }
];

export const MOCK_ITEMS = RAW_ITEMS.map(normalizeItem);

// Backward compatibility alias
export const MOCK_PRODUCTS = MOCK_ITEMS;

export const BASE_FILTER_METADATA = {
  categories: CATEGORIES,
  brands: [...new Set(MOCK_ITEMS.map((i) => i.brand))],
  tags: ['wireless', 'programming', 'education', 'audio', 'fitness', 'cloud', 'beginner', 'study'],
  difficulties: ['Beginner', 'Intermediate', 'Advanced'],
  attributes: ['Brand', 'Difficulty Level', 'Price', 'Rating'],
};

export const MOCK_AUTO_SUGGESTIONS = [
  'python course',
  'bluetooth speaker',
  'java book',
  'smart watch',
  'machine learning',
  'wireless headphones',
  'data structures',
  'cloud devops',
];

export default MOCK_ITEMS;
