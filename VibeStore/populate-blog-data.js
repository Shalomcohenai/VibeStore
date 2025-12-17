// Script to populate Firestore with blog posts and categories
// Run this in the browser console on the VibeStore site

async function populateBlogData() {
  if (!window.firebase || !window.firebase.firestore) {
    console.error('Firebase not available');
    return;
  }

  const db = window.firebase.firestore();

  try {
    // Add blog categories
    console.log('Adding blog categories...');
    const categories = [
      {
        id: "vibe-coding-fundamentals",
        name: "Vibe Coding Fundamentals",
        slug: "vibe-coding-fundamentals",
        description: "Core principles and techniques for coding with positive energy",
        color: "#6366f1",
        icon: "💻",
        post_count: 1
      },
      {
        id: "mindful-programming",
        name: "Mindful Programming",
        slug: "mindful-programming",
        description: "Programming with awareness, focus, and intention",
        color: "#8b5cf6",
        icon: "🧘",
        post_count: 0
      },
      {
        id: "developer-wellness",
        name: "Developer Wellness",
        slug: "developer-wellness",
        description: "Mental health, work-life balance, and sustainable coding practices",
        color: "#06b6d4",
        icon: "🌱",
        post_count: 0
      },
      {
        id: "positive-tech-culture",
        name: "Positive Tech Culture",
        slug: "positive-tech-culture",
        description: "Building inclusive, supportive, and joyful development teams",
        color: "#10b981",
        icon: "🤝",
        post_count: 1
      },
      {
        id: "vibe-tools-workflow",
        name: "Vibe Tools & Workflow",
        slug: "vibe-tools-workflow",
        description: "Tools and workflows that enhance your coding experience",
        color: "#f59e0b",
        icon: "🛠️",
        post_count: 1
      },
      {
        id: "coding-philosophy",
        name: "Coding Philosophy",
        slug: "coding-philosophy",
        description: "Deep thoughts on the art and philosophy of programming",
        color: "#ef4444",
        icon: "💭",
        post_count: 0
      }
    ];

    for (const category of categories) {
      await db.collection('blog_categories').doc(category.id).set(category);
      console.log(`Added category: ${category.name}`);
    }

    // Add blog posts
    console.log('Adding blog posts...');
    const posts = [
      {
        id: "art-of-vibe-coding",
        title: "The Art of Vibe Coding: Programming with Positive Energy",
        slug: "art-of-vibe-coding",
        category: "vibe-coding-fundamentals",
        excerpt: "Learn how to transform your coding experience by embracing positive energy and mindful programming practices that lead to better code and happier developers.",
        author: "VibeStore Team",
        meta_description: "Discover how to code with positive vibes and create better software through mindful programming practices",
        meta_keywords: ["vibe coding", "mindful programming", "developer wellness", "positive coding"],
        published: true,
        publishedAt: new Date("2025-01-27"),
        createdAt: new Date("2025-01-27"),
        updatedAt: new Date("2025-01-27"),
        tags: ["coding", "mindfulness", "productivity", "developer-wellness"],
        view_count: 0,
        comment_count: 0,
        url: "/vibe-coding-fundamentals/2025/01/27/art-of-vibe-coding.html"
      },
      {
        id: "essential-apps-vibe-coder",
        title: "5 Essential Apps Every Vibe Coder Should Have",
        slug: "essential-apps-vibe-coder",
        category: "vibe-tools-workflow",
        excerpt: "From mindfulness apps to powerful development tools, here are the essential apps that every vibe coder needs in their toolkit.",
        author: "VibeStore Team",
        meta_description: "Discover the must-have apps that will enhance your coding experience and boost your productivity as a developer",
        meta_keywords: ["developer apps", "productivity tools", "coding apps", "developer productivity"],
        published: true,
        publishedAt: new Date("2025-01-26"),
        createdAt: new Date("2025-01-26"),
        updatedAt: new Date("2025-01-26"),
        tags: ["productivity", "apps", "developer-tools", "mindfulness"],
        view_count: 0,
        comment_count: 0,
        url: "/vibe-tools-workflow/2025/01/26/essential-apps-vibe-coder.html"
      },
      {
        id: "positive-developer-culture",
        title: "Building a Positive Developer Culture: Lessons from Vibe Coding",
        slug: "positive-developer-culture",
        category: "positive-tech-culture",
        excerpt: "Discover how vibe coding principles can transform your development team culture, creating an environment where everyone thrives.",
        author: "VibeStore Team",
        meta_description: "Learn how to build a positive, inclusive developer culture that promotes growth, collaboration, and well-being",
        meta_keywords: ["developer culture", "team building", "workplace wellness", "positive work environment"],
        published: true,
        publishedAt: new Date("2025-01-25"),
        createdAt: new Date("2025-01-25"),
        updatedAt: new Date("2025-01-25"),
        tags: ["team-culture", "leadership", "collaboration", "workplace-wellness"],
        view_count: 0,
        comment_count: 0,
        url: "/positive-tech-culture/2025/01/25/positive-developer-culture.html"
      }
    ];

    for (const post of posts) {
      await db.collection('blog_posts').doc(post.id).set(post);
      console.log(`Added post: ${post.title}`);
    }

    console.log('✅ Blog data populated successfully!');
  } catch (error) {
    console.error('Error populating blog data:', error);
  }
}

// Run the function
populateBlogData();
