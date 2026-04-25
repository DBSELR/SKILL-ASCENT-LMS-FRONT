import { ResumeData } from './types';

export const sampleResumeData: ResumeData = {
  template: 'modern',
  personalInfo: {
    fullName: 'Jane Software Developer',
    email: 'jane.dev@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'janedev.com',
    linkedin: 'linkedin.com/in/janedev',
    github: 'github.com/janedev',
    summary: 'Results-oriented Software Engineer with 5+ years of experience designing and developing scalable web applications. Proven expertise in React, Node.js, and cloud architecture. Passionate about writing clean, maintainable code and mentoring junior developers.',
  },
  experience: [
    {
      id: '1',
      company: 'TechNovation Inc.',
      position: 'Senior Software Engineer',
      startDate: 'Mar 2021',
      endDate: 'Present',
      current: true,
      description: '- Architected and built a microservices-based backend using Node.js and Docker, improving system resilience by 40%.\n- Led a team of 4 engineers to migrate legacy React application to Next.js, resulting in a 60% boost in SEO traffic.\n- Implemented CI/CD pipelines using GitHub Actions, reducing deployment time from hours to minutes.',
    },
    {
      id: '2',
      company: 'DataFlow Solutions',
      position: 'Software Engineer',
      startDate: 'Jun 2018',
      endDate: 'Feb 2021',
      current: false,
      description: '- Developed responsive, accessible UI components using React and Tailwind CSS, adopted by 3 internal product teams.\n- Integrated third-party APIs including Stripe and SendGrid for automated billing and notifications.\n- Optimized MongoDB queries to reduce API latency by 35% on average.',
    }
  ],
  education: [
    {
      id: '1',
      institution: 'State University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      graduationDate: 'May 2018',
      gpa: '3.8/4.0',
    }
  ],
  skills: 'Languages: JavaScript (ES6+), TypeScript, Python, HTML/CSS\nFrameworks & Libraries: React, Next.js, Node.js, Express, Tailwind CSS\nTools & Platforms: Git, Docker, AWS (EC2, S3), MongoDB, PostgreSQL, CI/CD',
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      link: 'github.com/janedev/ecommerce',
      technologies: 'React, Redux, Node.js, Stripe',
      description: 'A full-stack e-commerce application with user authentication, product search, cart management, and secure payment processing.',
    },
    {
      id: '2',
      name: 'Real-time Chat App',
      link: 'chat.janedev.com',
      technologies: 'Socket.io, Express, React',
      description: 'Real-time messaging application supporting multiple chat rooms, online status indicators, and typing notifications.',
    }
  ],
};
