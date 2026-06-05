export const topics = [
  { id: 'logic', name: 'Logical Reasoning' },
  { id: 'math', name: 'Quantitative Aptitude' },
  { id: 'dsa', name: 'Data Structures & Algorithms' },
  { id: 'programming', name: 'Programming Fundamentals' }
];

// Difficulty ranges from -3.0 to +3.0
// a (discrimination) ranges from 0.5 to 2.5
export const mockQuestions = [
    // Programming Basics (Difficulty -2.0 to 0.0)
    {
        id: 'q100',
        topic_id: 'programming',
        difficulty: -1.5,
        discrimination: 1.0,
        question: "What is the primary function of a compiler?",
        options: ["Execute code line by line", "Store variables in memory", "Translate source code to machine code", "Format code aesthetics"],
        correct: "Translate source code to machine code",
        tags: ["basics", "compilation"]
    },
    {
        id: 'q101',
        topic_id: 'programming',
        difficulty: -0.5,
        discrimination: 1.2,
        question: "Which of the following describes a 'Boolean' data type?",
        options: ["A number with decimals", "A string of text", "A sequence of characters", "A value that is either True or False"],
        correct: "A value that is either True or False",
        tags: ["datatypes"]
    },
    // DSA (Difficulty 0.0 to 2.5)
    {
        id: 'q102',
        topic_id: 'dsa',
        difficulty: 0.5,
        discrimination: 1.5,
        question: "Which data structure uses LIFO (Last In First Out)?",
        options: ["Queue", "Tree", "Stack", "Linked List"],
        correct: "Stack",
        tags: ["stack", "basics"]
    },
    {
        id: 'q103',
        topic_id: 'dsa',
        difficulty: 1.5,
        discrimination: 1.8,
        question: "What is the average time complexity of QuickSort?",
        options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
        correct: "O(n log n)",
        tags: ["sorting", "complexity"]
    },
    {
        id: 'q104',
        topic_id: 'dsa',
        difficulty: 2.2,
        discrimination: 2.0,
        question: "In a Red-Black Tree, what is the maximum depth difference between the shortest and longest paths from the root to a leaf?",
        options: ["They must be equal", "No more than a factor of 2", "No more than 1", "Unbounded"],
        correct: "No more than a factor of 2",
        tags: ["trees", "advanced"]
    },
    // Logic/Algo (General problem solving)
    {
        id: 'q105',
        topic_id: 'logic',
        difficulty: 0.0,
        discrimination: 1.1,
        question: "If a loop iterations 10 times, and inside it another loop iterates 5 times, how many total inner executions occur?",
        options: ["15", "50", "10", "5"],
        correct: "50",
        tags: ["loops", "basics"]
    }
];

export const availableCourses = [
    {
        id: 'c1',
        title: 'Python for Beginners',
        category: 'Programming',
        difficulty: 'Beginner',
        duration: '4 Weeks',
        rating: 4.8,
        students: 1250,
        description: 'Start your coding journey with Python. Learn syntax, variables, loops, functions, and basic data structures in this comprehensive introductory course.',
        topics: ['Variables & Datatypes', 'Control Flow', 'Functions', 'Lists & Dictionaries', 'File I/O'],
        tags: ['python', 'basics', 'programming']
    },
    {
        id: 'c2',
        title: 'Advanced JavaScript Concepts',
        category: 'Web Development',
        difficulty: 'Advanced',
        duration: '6 Weeks',
        rating: 4.9,
        students: 890,
        description: 'Deep dive into JS architecture. Master closures, prototypes, asynchronous programming, the Event Loop, and modern ES6+ features.',
        topics: ['Closures & Scope', 'Prototypal Inheritance', 'Async/Await & Promises', 'Event Loop', 'ES6+ Syntax'],
        tags: ['javascript', 'advanced', 'frontend']
    },
    {
        id: 'c3',
        title: 'Mastering React.js',
        category: 'Web Development',
        difficulty: 'Intermediate',
        duration: '8 Weeks',
        rating: 4.7,
        students: 2100,
        description: 'Build dynamic modern user interfaces. Covers Components, Hooks, Context API, Redux for state management, and Performance Optimization.',
        topics: ['JSX & Components', 'React Hooks', 'State Management', 'React Router', 'Performance Optimization'],
        tags: ['react', 'frontend', 'components']
    },
    {
        id: 'c4',
        title: 'Data Structures & Algorithms in Java',
        category: 'Computer Science',
        difficulty: 'Intermediate',
        duration: '10 Weeks',
        rating: 4.9,
        students: 3400,
        description: 'The definitive guide to cracking coding interviews. Implement Arrays, Linked Lists, Trees, Graphs, and master Sorting algorithms in Java.',
        topics: ['Arrays & Strings', 'Linked Lists & Trees', 'Sorting & Searching', 'Dynamic Programming', 'Graph Algorithms'],
        tags: ['java', 'dsa', 'algorithms']
    },
    {
        id: 'c5',
        title: 'System Design Patterns',
        category: 'Architecture',
        difficulty: 'Expert',
        duration: '12 Weeks',
        rating: 4.9,
        students: 560,
        description: 'Learn how to architect scalable, distributed backend systems. Covers Microservices, Load Balancing, Caching, and Database Sharding.',
        topics: ['Load Balancing', 'Microservices', 'Caching Strategies', 'Database Sharding', 'Message Queues'],
        tags: ['architecture', 'system-design', 'backend']
    },
    {
        id: 'c6',
        title: 'C++ for Competitive Programming',
        category: 'Computer Science',
        difficulty: 'Advanced',
        duration: '8 Weeks',
        rating: 4.8,
        students: 1100,
        description: 'Master the Standard Template Library (STL) and advanced algorithmic problem-solving techniques specifically tailored for coding competitions.',
        topics: ['STL Basics', 'Advanced Datatypes', 'Greedy Algorithms', 'Graph Theory', 'Number Theory'],
        tags: ['cpp', 'competitive', 'dsa']
    },
    {
        id: 'c7',
        title: 'Node.js Backend Architecture',
        category: 'Web Development',
        difficulty: 'Intermediate',
        duration: '6 Weeks',
        rating: 4.6,
        students: 1400,
        description: 'Build fast, scalable network applications. Learn Express.js, REST API design, JWT Authentication, and MongoDB integration.',
        topics: ['Express.js Fundamentals', 'RESTful APIs', 'Authentication & JWT', 'MongoDB & Mongoose', 'Error Handling'],
        tags: ['node', 'backend', 'api']
    },
    {
        id: 'c8',
        title: 'Machine Learning Fundamentals',
        category: 'AI / Data Science',
        difficulty: 'Intermediate',
        duration: '10 Weeks',
        rating: 4.7,
        students: 2200,
        description: 'Introduction to predictive modeling. Covers Linear Regression, Classification, Support Vector Machines, and Neural Networks basics using Python.',
        topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Neural Networks', 'Scikit-Learn'],
        tags: ['python', 'ml', 'ai']
    },
    {
        id: 'c9',
        title: 'SQL & Database Design',
        category: 'Databases',
        difficulty: 'Beginner',
        duration: '5 Weeks',
        rating: 4.8,
        students: 2800,
        description: 'Learn to design robust relational databases. Master complex queries, joins, subqueries, indexing, and normalization techniques.',
        topics: ['Relational Algebra', 'Complex Joins', 'Subqueries', 'Indexing & Performance', 'Normalization'],
        tags: ['sql', 'database', 'backend']
    },
    {
        id: 'c10',
        title: 'DevOps & CI/CD Pipelines',
        category: 'Infrastructure',
        difficulty: 'Advanced',
        duration: '8 Weeks',
        rating: 4.9,
        students: 950,
        description: 'Automate software delivery. Learn Docker containerization, Kubernetes orchestration, and setting up GitHub Actions / Jenkins pipelines.',
        topics: ['Docker Basics', 'Kubernetes Orchestration', 'CI/CD Concepts', 'Jenkins/GitHub Actions', 'Infrastructure as Code'],
        tags: ['devops', 'docker', 'ci-cd']
    },
    {
        id: 'c11',
        title: 'Introduction to Rust',
        category: 'Programming',
        difficulty: 'Intermediate',
        duration: '7 Weeks',
        rating: 4.8,
        students: 800,
        description: 'Learn memory safety without garbage collection. Master ownership, borrowing, lifetimes, and safe concurrency in Rust.',
        topics: ['Ownership & Borrowing', 'Lifetimes', 'Structs & Enums', 'Error Handling', 'Concurrency'],
        tags: ['rust', 'systems', 'memory']
    },
    {
        id: 'c12',
        title: 'Go (Golang) Microservices',
        category: 'Backend',
        difficulty: 'Advanced',
        duration: '6 Weeks',
        rating: 4.7,
        students: 1050,
        description: 'Build highly concurrent microservices. Learn Goroutines, Channels, gRPC, and building lightweight backend services in Go.',
        topics: ['Go Syntax Fundamentals', 'Goroutines & Concurrency', 'Channels', 'gRPC & Protobuf', 'Web Servers in Go'],
        tags: ['go', 'microservices', 'backend']
    },
    {
        id: 'c13',
        title: 'UI/UX Design for Developers',
        category: 'Design',
        difficulty: 'Beginner',
        duration: '4 Weeks',
        rating: 4.6,
        students: 1600,
        description: 'Bridge the gap between code and design. Learn color theory, typography, spacing, and accessible component design principles.',
        topics: ['Color Theory', 'Typography', 'Spacing & Layouts', 'Accessibility', 'Figma Basics'],
        tags: ['ux', 'ui', 'design']
    },
    {
        id: 'c14',
        title: 'Cybersecurity Ethical Hacking',
        category: 'Security',
        difficulty: 'Intermediate',
        duration: '10 Weeks',
        rating: 4.9,
        students: 1900,
        description: 'Learn offensive security foundations. Web App pentesting, network scanning, OWASP top 10 vulnerabilities, and cryptography basics.',
        topics: ['Network Scanning', 'Web App Vulnerabilities', 'Cryptography Basics', 'OWASP Top 10', 'Penetration Testing'],
        tags: ['security', 'hacking', 'cyber']
    },
    {
        id: 'c15',
        title: 'Dynamic Programming Masterclass',
        category: 'Computer Science',
        difficulty: 'Expert',
        duration: '8 Weeks',
        rating: 4.8,
        students: 750,
        description: 'Demystify Dynamic Programming. Master 1D, 2D DP, memoization, tabulation, and solve classic hard interview problems step-by-step.',
        topics: ['Memoization vs Tabulation', '1D DP Arrays', '2D Grids & Paths', 'Knapsack Variations', 'State Transition'],
        tags: ['dsa', 'dp', 'algorithms']
    }
];

// Initial state for a new student
export const initialUserState = {
    userId: 'u123',
    name: 'Test Student',
    email: 'student@example.com',
    ability: 0.0, // Initial Theta (average)
    topicMastery: {
        logic: 0.5,
        dsa: 0.3,
        programming: 0.4
    },
    attempts: [], // history of {questionId, isCorrect, timestamp, probability, responseTime, confidenceScore}
    enrolledCourses: [] // Starts empty for Phase 4/5 testing logic
};
