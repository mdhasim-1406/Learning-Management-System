// 10 knowledge base articles
const articles = [
  {
    title: 'Getting Started with the LMS',
    category: 'Onboarding',
    tags: ['beginner', 'setup', 'guide'],
    content: `# Welcome to LearnHub

Welcome to our Learning Management System! This guide will help you get started with your learning journey.

## First Steps

1. **Complete Your Profile**: Add a profile picture and bio to personalize your account.
2. **Browse the Course Catalog**: Explore available courses and find topics that interest you.
3. **Enroll in Your First Course**: Click the "Enroll" button on any course to get started.

## Navigation

- **Dashboard**: Your home base showing progress and recommendations.
- **My Courses**: View all your enrolled courses and track progress.
- **Catalog**: Browse all available courses.
- **Certificates**: View your earned certificates.

## Tips for Success

- Set aside dedicated learning time each day
- Take notes as you watch lessons
- Complete quizzes to test your knowledge
- Earn certificates to showcase your skills

Happy learning!`,
    status: 'published'
  },
  {
    title: 'Best Practices for Course Creation',
    category: 'For Trainers',
    tags: ['courses', 'content', 'tips'],
    content: `# Creating Engaging Courses

As a trainer, creating effective courses is essential for learner success. Here are our best practices.

## Course Structure

### Modules
- Break your course into logical modules
- Each module should cover one main topic
- Aim for 3-5 modules per course

### Lessons
- Keep lessons focused on a single concept
- Ideal video length: 10-20 minutes
- Mix content types: videos, links, documents

## Content Guidelines

1. **Start with objectives**: What will learners be able to do after completing the course?
2. **Use real examples**: Practical examples help reinforce concepts
3. **Include assessments**: Quizzes help learners validate their understanding
4. **Provide resources**: Link to additional reading and documentation

## Video Tips

- Use clear audio (invest in a good microphone)
- Keep a consistent pace
- Use screen recordings for demonstrations
- Add captions for accessibility

## Engagement

- Encourage learners to complete lessons in order
- Create challenging but fair quizzes
- Respond to questions promptly
- Update content regularly`,
    status: 'published'
  },
  {
    title: 'Understanding Your Learning Dashboard',
    category: 'User Guide',
    tags: ['dashboard', 'progress', 'tracking'],
    content: `# Your Learning Dashboard

The dashboard is your central hub for tracking progress and discovering new content.

## Dashboard Sections

### Progress Overview
See at a glance:
- Enrolled courses count
- Completed courses
- Certificates earned
- Learning streak

### Continue Learning
Resume where you left off with quick access to your in-progress courses.

### Recommended Courses
Personalized suggestions based on your interests and history.

### Recent Activity
Track your latest completions and achievements.

## Understanding Progress

Progress is calculated based on lessons completed within a course. Mark lessons as complete after watching or reading to update your progress.

## Tips
- Check your dashboard daily to maintain momentum
- Set goals for course completions
- Celebrate your achievements!`,
    status: 'published'
  },
  {
    title: 'How to Complete Courses and Earn Certificates',
    category: 'User Guide',
    tags: ['certificates', 'completion', 'achievement'],
    content: `# Earning Certificates

Certificates demonstrate your commitment to learning and can enhance your professional profile.

## Completion Requirements

To earn a certificate, you must:

1. **Complete all lessons** in the course
2. **Pass the final quiz** (if applicable) with the minimum score
3. Lessons are marked complete when you click "Mark as Complete"

## Certificate Features

Each certificate includes:
- Your name
- Course title
- Completion date
- Unique certificate number
- Verification link

## Sharing Certificates

You can:
- Download as PDF
- Share on LinkedIn
- Add to your portfolio
- Include in your resume

## Certificate Verification

Employers can verify your certificate using the unique certificate number on our verification page.`,
    status: 'published'
  },
  {
    title: 'Taking Quizzes Effectively',
    category: 'User Guide',
    tags: ['quizzes', 'assessment', 'tips'],
    content: `# Quiz Guide

Quizzes help reinforce your learning and test your understanding.

## Before the Quiz

- Review the course material
- Take notes on key concepts
- Ensure you've completed all lessons

## During the Quiz

- Read each question carefully
- Don't rush through questions
- Review your answers before submitting

## After the Quiz

- Review any incorrect answers
- Revisit relevant lessons if needed
- Retake the quiz if you didn't pass

## Scoring

- Each quiz has a passing score (typically 70-80%)
- You can retake quizzes to improve your score
- Only your best score is recorded

## Tips for Success

1. Study the material thoroughly before attempting
2. Take your time - there's no time limit
3. Use the process of elimination for tough questions
4. Don't be afraid to retake if you don't pass`,
    status: 'published'
  },
  {
    title: 'Admin Guide: Managing Users',
    category: 'Admin',
    tags: ['admin', 'users', 'management'],
    content: `# User Management Guide

As an administrator, you have access to manage all users in the system.

## User Roles

### Super Admin
- Full system access
- Can manage all users and settings
- Can assign admin roles

### Admin
- Manage users and courses
- View reports and analytics
- Cannot modify super admins

### Trainer
- Create and manage courses
- View enrolled learners
- Access course analytics

### Learner
- Enroll in courses
- Complete lessons and quizzes
- Earn certificates

## User Operations

### Creating Users
1. Navigate to User Management
2. Click "Add User"
3. Fill in user details
4. Select appropriate role
5. Save

### Editing Users
- Update user information
- Change user roles
- Reset passwords
- Activate/deactivate accounts

### Bulk Operations
- Import users via CSV
- Export user lists
- Bulk activate/deactivate`,
    status: 'published'
  },
  {
    title: 'Admin Guide: Course Management',
    category: 'Admin',
    tags: ['admin', 'courses', 'management'],
    content: `# Course Management Guide

Manage all courses across the platform effectively.

## Course Lifecycle

### Draft
- Course is being created
- Not visible to learners
- Can be edited freely

### Published
- Course is live and visible
- Learners can enroll
- Content changes affect all enrollees

### Archived
- Course is hidden from catalog
- Existing enrollments remain
- Can be republished

## Managing Courses

### Viewing All Courses
- See all courses regardless of creator
- Filter by status, category, or trainer
- View enrollment statistics

### Course Actions
- Edit course details
- Manage modules and lessons
- View enrolled learners
- Archive or delete courses

### Quality Control
- Review draft courses before publishing
- Ensure content meets standards
- Monitor completion rates`,
    status: 'published'
  },
  {
    title: 'Understanding Analytics and Reports',
    category: 'Admin',
    tags: ['analytics', 'reports', 'data'],
    content: `# Analytics and Reporting

Use analytics to understand learning patterns and improve outcomes.

## Available Reports

### Overview
- Total users, courses, and enrollments
- Completion rates
- Active learner count

### Course Performance
- Enrollments per course
- Completion rates by course
- Popular courses
- Struggling learners

### User Activity
- Active users by time period
- Login frequency
- Course completion times

### Certificate Issuance
- Certificates issued over time
- Top certificate earners

## Using Reports

### Identify Trends
- Spot popular topics
- Find underperforming courses
- Track seasonal patterns

### Improve Outcomes
- Focus on courses with low completion
- Recognize high achievers
- Allocate training resources effectively

### Export Options
- Download reports as CSV
- Schedule regular reports
- Share with stakeholders`,
    status: 'published'
  },
  {
    title: 'Troubleshooting Common Issues',
    category: 'Support',
    tags: ['troubleshooting', 'help', 'issues'],
    content: `# Troubleshooting Guide

Having issues? Here are solutions to common problems.

## Login Issues

### Can't Log In
1. Verify your email is correct
2. Check caps lock is off
3. Try password reset
4. Clear browser cache
5. Contact admin if issues persist

### Session Expired
- Log in again
- Enable "Remember me" for longer sessions

## Video Playback

### Video Won't Play
- Check your internet connection
- Try refreshing the page
- Clear browser cache
- Try a different browser
- Disable ad blockers

### Poor Video Quality
- Check bandwidth
- Lower quality settings if available
- Try during off-peak hours

## Progress Issues

### Progress Not Saving
- Ensure you click "Mark as Complete"
- Check your internet connection
- Try logging out and back in

### Certificate Not Appearing
- Verify all lessons are completed
- Check if quiz is required and passed
- Wait a few minutes and refresh

## Getting Help

If issues persist:
1. Check this knowledge base
2. Contact your administrator
3. Submit a support ticket`,
    status: 'published'
  },
  {
    title: 'Keyboard Shortcuts and Accessibility',
    category: 'User Guide',
    tags: ['accessibility', 'shortcuts', 'a11y'],
    content: `# Accessibility Features

We're committed to making learning accessible to everyone.

## Keyboard Navigation

### Global Shortcuts
- \`Tab\`: Navigate between elements
- \`Enter\`: Activate buttons/links
- \`Esc\`: Close modals/dropdowns

### Video Player
- \`Space\`: Play/Pause
- \`→\`: Forward 10 seconds
- \`←\`: Rewind 10 seconds
- \`M\`: Mute/Unmute
- \`F\`: Fullscreen

## Screen Reader Support

- All images have alt text
- Form fields have proper labels
- Headings are properly structured
- ARIA labels for interactive elements

## Visual Accessibility

- High contrast text
- Resizable text (use browser zoom)
- Focus indicators on interactive elements
- Color is not the only indicator

## Requesting Accommodations

If you need additional accommodations:
1. Contact your administrator
2. Describe your needs
3. We'll work to provide solutions

We continuously improve accessibility based on feedback.`,
    status: 'published'
  }
];

module.exports = articles;
