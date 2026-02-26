export const STEPS = [
    'Personal Info',
    'Education',
    'Experience',
    'Skills',
    'Projects',
    'Review'
];

export const TEMPLATES = [
    { id: 'modern', name: 'Modern' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'executive', name: 'Executive' },
    { id: 'simple', name: 'Simple' }
];

export const DUMMY_RESUME = {
    personal: {
        fullName: "Harish Pampana",
        email: "harish.pampana@gmail.com",
        phone: "+1 (555) 123-4567",
        linkedin: "linkedin.com/in/harish-pampana",
        summary: "Innovative Software Engineer with 5+ years of experience in building scalable web applications. Proven track record of leadership and problem-solving."
    },
    education: [
        { school: "Stanford University", degree: "M.S. Computer Science", year: "2018-2020" },
        { school: "MIT", degree: "B.S. Computer Science", year: "2014-2018" }
    ],
    experience: [
        {
            company: "Tech Solutions Inc.",
            role: "Senior Developer",
            duration: "2020 - Present",
            description: "Led a team of 5 developers to rebuild the core product, improving performance by 40%."
        },
        {
            company: "StartUp Lab",
            role: "Frontend Developer",
            duration: "2018 - 2020",
            description: "Developed key features for the MVP using React and Node.js."
        }
    ],
    skills: ["React", "Node.js", "Python", "AWS", "Design Systems", "Team Leadership"],
    projects: [
        { name: "E-Commerce Platform", link: "github.com/alex/ecom", description: "Built a full-stack e-commerce solution with Stripe integration." }
    ],
    achievements: [
        { title: "Best Innovator Award", description: "Received internal award for proposing a new architecture." }
    ]
};
