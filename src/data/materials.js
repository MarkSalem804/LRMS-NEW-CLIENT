const materials = [
  // Mathematics
  {
    id: "math-module-1",
    title: "Algebra Fundamentals",
    type: "Module",
    subject: "mathematics",
    description:
      "A comprehensive guide to algebraic expressions and equations.",
    dateAdded: "2023-06-15",
    downloads: 1245,
    rating: 4.7,
    author: "Dr. Sarah Matthews",
    thumbnail:
      "https://images.pexels.com/photos/3808057/pexels-photo-3808057.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-lesson-1",
    title: "Pythagorean Theorem",
    type: "Lesson Exemplar",
    subject: "mathematics",
    description:
      "A detailed lesson plan on teaching the Pythagorean theorem with examples.",
    dateAdded: "2023-07-22",
    downloads: 892,
    rating: 4.8,
    author: "Prof. Michael Johnson",
    thumbnail:
      "https://images.pexels.com/photos/714698/pexels-photo-714698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-module-2",
    title: "Calculus Introduction",
    type: "Module",
    subject: "mathematics",
    description:
      "An introductory module to differential and integral calculus.",
    dateAdded: "2023-05-10",
    downloads: 743,
    rating: 4.5,
    author: "Dr. Robert Chen",
    thumbnail:
      "https://images.pexels.com/photos/6238048/pexels-photo-6238048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-module-3",
    title: "Introduction to Subtraction",
    type: "Module",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "A beginner module on subtraction concepts and exercises.",
    dateAdded: "2024-03-20",
    downloads: 300,
    rating: 4.6,
    author: "Teacher Anna Smith",
    thumbnail:
      "https://images.pexels.com/photos/3808057/pexels-photo-3808057.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-activity-2",
    title: "Counting with Objects",
    type: "Activity Guide",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "Hands-on activities for counting using everyday objects.",
    dateAdded: "2024-03-21",
    downloads: 250,
    rating: 4.8,
    author: "Teacher John Doe",
    thumbnail:
      "https://images.pexels.com/photos/714698/pexels-photo-714698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-activity-3",
    title: "Shapes and Their Properties",
    type: "Activity Guide",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "Activities to identify and describe different shapes.",
    dateAdded: "2024-03-26",
    downloads: 150,
    rating: 4.5,
    author: "Teacher Emily White",
    thumbnail:
      "https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-module-4",
    title: "Introduction to Addition",
    type: "Module",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "A beginner module on addition concepts and exercises.",
    dateAdded: "2024-03-27",
    downloads: 200,
    rating: 4.6,
    author: "Teacher Anna Brown",
    thumbnail:
      "https://images.pexels.com/photos/1234568/pexels-photo-1234568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-activity-4",
    title: "Telling Time",
    type: "Activity Guide",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "Fun activities to learn how to tell time.",
    dateAdded: "2024-03-28",
    downloads: 180,
    rating: 4.7,
    author: "Teacher John Smith",
    thumbnail:
      "https://images.pexels.com/photos/1234569/pexels-photo-1234569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-module-5",
    title: "Understanding Fractions",
    type: "Module",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "An introduction to basic fractions and their uses.",
    dateAdded: "2024-03-29",
    downloads: 220,
    rating: 4.8,
    author: "Teacher Lisa Green",
    thumbnail:
      "https://images.pexels.com/photos/1234570/pexels-photo-1234570.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-activity-5",
    title: "Money Matters",
    type: "Activity Guide",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "Activities to learn about money and its value.",
    dateAdded: "2024-03-30",
    downloads: 160,
    rating: 4.4,
    author: "Teacher Sarah Blue",
    thumbnail:
      "https://images.pexels.com/photos/1234571/pexels-photo-1234571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-module-6",
    title: "Patterns and Sequences",
    type: "Module",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "Understanding patterns and sequences in numbers.",
    dateAdded: "2024-03-31",
    downloads: 190,
    rating: 4.5,
    author: "Teacher Michael Red",
    thumbnail:
      "https://images.pexels.com/photos/1234572/pexels-photo-1234572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-activity-6",
    title: "Measurement Fun",
    type: "Activity Guide",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "Activities to learn about measuring length and weight.",
    dateAdded: "2024-04-01",
    downloads: 170,
    rating: 4.6,
    author: "Teacher Anna Yellow",
    thumbnail:
      "https://images.pexels.com/photos/1234573/pexels-photo-1234573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-module-7",
    title: "Exploring Graphs",
    type: "Module",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "Introduction to basic graphs and data representation.",
    dateAdded: "2024-04-02",
    downloads: 210,
    rating: 4.7,
    author: "Teacher John Black",
    thumbnail:
      "https://images.pexels.com/photos/1234574/pexels-photo-1234574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-activity-7",
    title: "Sorting and Classifying",
    type: "Activity Guide",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "Activities to sort and classify objects based on attributes.",
    dateAdded: "2024-04-03",
    downloads: 140,
    rating: 4.5,
    author: "Teacher Emily Pink",
    thumbnail:
      "https://images.pexels.com/photos/1234575/pexels-photo-1234575.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-module-8",
    title: "Introduction to Division",
    type: "Module",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "A beginner module on division concepts and exercises.",
    dateAdded: "2024-04-04",
    downloads: 230,
    rating: 4.8,
    author: "Teacher Sarah Orange",
    thumbnail:
      "https://images.pexels.com/photos/1234576/pexels-photo-1234576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-activity-8",
    title: "Fun with Numbers",
    type: "Activity Guide",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "Engaging activities to practice number recognition.",
    dateAdded: "2024-04-05",
    downloads: 150,
    rating: 4.6,
    author: "Teacher Lisa Purple",
    thumbnail:
      "https://images.pexels.com/photos/1234577/pexels-photo-1234577.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-module-9",
    title: "Exploring 3D Shapes",
    type: "Module",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "An introduction to 3D shapes and their properties.",
    dateAdded: "2024-04-06",
    downloads: 220,
    rating: 4.7,
    author: "Teacher John Gray",
    thumbnail:
      "https://images.pexels.com/photos/1234578/pexels-photo-1234578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-activity-9",
    title: "Number Line Activities",
    type: "Activity Guide",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "Activities to understand and use number lines.",
    dateAdded: "2024-04-07",
    downloads: 160,
    rating: 4.5,
    author: "Teacher Anna Blue",
    thumbnail:
      "https://images.pexels.com/photos/1234579/pexels-photo-1234579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-module-10",
    title: "Math Games and Puzzles",
    type: "Module",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "Fun games and puzzles to enhance math skills.",
    dateAdded: "2024-04-08",
    downloads: 240,
    rating: 4.9,
    author: "Teacher Michael Green",
    thumbnail:
      "https://images.pexels.com/photos/1234580/pexels-photo-1234580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "math-activity-10",
    title: "Math Story Problems",
    type: "Activity Guide",
    subject: "Mathematics",
    grade: 1,
    area: "Mathematics",
    description: "Activities to solve simple math story problems.",
    dateAdded: "2024-04-09",
    downloads: 170,
    rating: 4.6,
    author: "Teacher Sarah Red",
    thumbnail:
      "https://images.pexels.com/photos/1234581/pexels-photo-1234581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },

  // Science
  {
    id: "science-module-1",
    title: "Cell Biology",
    type: "Module",
    subject: "science",
    description: "A comprehensive guide to cell structure and function.",
    dateAdded: "2023-08-05",
    downloads: 1056,
    rating: 4.6,
    author: "Dr. Emily Parker",
    thumbnail:
      "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "science-lesson-1",
    title: "Physics Experiments",
    type: "Lesson Exemplar",
    subject: "science",
    description:
      "A collection of physics experiments for high school students.",
    dateAdded: "2023-09-12",
    downloads: 678,
    rating: 4.4,
    author: "Prof. David Wilson",
    thumbnail:
      "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "science-activity-1",
    title: "Ecosystem Exploration",
    type: "Activity Guide",
    subject: "science",
    description:
      "Hands-on activities for exploring ecosystems and biodiversity.",
    dateAdded: "2023-04-18",
    downloads: 823,
    rating: 4.7,
    author: "Dr. Lisa Rodriguez",
    thumbnail:
      "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "science-module-2",
    title: "Weather Patterns",
    type: "Module",
    subject: "Science",
    grade: 1,
    area: "Science",
    description:
      "An introduction to different weather patterns and their effects.",
    dateAdded: "2024-03-22",
    downloads: 180,
    rating: 4.7,
    author: "Teacher Maria Garcia",
    thumbnail:
      "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "science-activity-2",
    title: "Plant Growth",
    type: "Activity Guide",
    subject: "Science",
    grade: 1,
    area: "Science",
    description: "Activities to observe and learn about how plants grow.",
    dateAdded: "2024-03-23",
    downloads: 220,
    rating: 4.5,
    author: "Teacher Lisa Chen",
    thumbnail:
      "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },

  // English
  {
    id: "english-module-1",
    title: "Grammar Essentials",
    type: "Module",
    subject: "english",
    description: "A comprehensive guide to English grammar rules and usage.",
    dateAdded: "2023-07-08",
    downloads: 1342,
    rating: 4.5,
    author: "Prof. William Thomas",
    thumbnail:
      "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "english-lesson-1",
    title: "Creative Writing",
    type: "Lesson Exemplar",
    subject: "english",
    description:
      "A detailed lesson plan for teaching creative writing techniques.",
    dateAdded: "2023-06-25",
    downloads: 912,
    rating: 4.9,
    author: "Dr. Sophia Lee",
    thumbnail:
      "https://images.pexels.com/photos/3059750/pexels-photo-3059750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "english-module-2",
    title: "Basic Vocabulary",
    type: "Module",
    subject: "English",
    grade: 1,
    area: "English",
    description:
      "A module introducing basic vocabulary words for Grade 1 students.",
    dateAdded: "2024-03-24",
    downloads: 300,
    rating: 4.6,
    author: "Teacher Sarah Johnson",
    thumbnail:
      "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "english-activity-2",
    title: "Story Time",
    type: "Activity Guide",
    subject: "English",
    grade: 1,
    area: "English",
    description:
      "Activities to enhance listening and comprehension skills through storytelling.",
    dateAdded: "2024-03-25",
    downloads: 150,
    rating: 4.8,
    author: "Teacher Michael Brown",
    thumbnail:
      "https://images.pexels.com/photos/3059750/pexels-photo-3059750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },

  // Values
  {
    id: "values-module-1",
    title: "Character Development",
    type: "Module",
    subject: "values",
    description:
      "A module focused on developing positive character traits in students.",
    dateAdded: "2023-05-30",
    downloads: 687,
    rating: 4.8,
    author: "Dr. Maria Garcia",
    thumbnail:
      "https://images.pexels.com/photos/8471767/pexels-photo-8471767.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "values-activity-1",
    title: "Community Service Projects",
    type: "Activity Guide",
    subject: "values",
    description:
      "A guide to implementing community service projects in schools.",
    dateAdded: "2023-08-15",
    downloads: 542,
    rating: 4.7,
    author: "Prof. James Wilson",
    thumbnail:
      "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },

  // Social Studies
  {
    id: "social-module-1",
    title: "World History",
    type: "Module",
    subject: "social-studies",
    description: "A comprehensive module covering major world history events.",
    dateAdded: "2023-06-10",
    downloads: 876,
    rating: 4.5,
    author: "Dr. Alexander Brown",
    thumbnail:
      "https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "social-lesson-1",
    title: "Geography Exploration",
    type: "Lesson Exemplar",
    subject: "social-studies",
    description: "A detailed lesson plan for teaching geographical concepts.",
    dateAdded: "2023-07-18",
    downloads: 634,
    rating: 4.3,
    author: "Prof. Christine Adams",
    thumbnail:
      "https://images.pexels.com/photos/2394446/pexels-photo-2394446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },

  // Arts
  {
    id: "arts-module-1",
    title: "Visual Arts Techniques",
    type: "Module",
    subject: "arts",
    description: "A module covering various visual arts techniques and styles.",
    dateAdded: "2023-08-22",
    downloads: 723,
    rating: 4.9,
    author: "Prof. Isabella Martinez",
    thumbnail:
      "https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "arts-activity-1",
    title: "Music Composition",
    type: "Activity Guide",
    subject: "arts",
    description: "A guide to teaching music composition to students.",
    dateAdded: "2023-05-15",
    downloads: 589,
    rating: 4.8,
    author: "Dr. Thomas Johnson",
    thumbnail:
      "https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

export default materials;
