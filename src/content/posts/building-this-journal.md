---
title: Building a Portfolio Journal with Vite and TailwindCSS
date: 2025-12-04
tags: [web-dev, vite, tailwindcss, react]
excerpt: How I built this beautiful technical journal using Vite, React, and TailwindCSS with markdown support for blog posts.
readTime: 6 min read
---

# Building a Portfolio Journal with Vite and TailwindCSS

Today I built this very website you're reading! It's a portfolio-style technical journal where I can document my coding adventures using markdown files.

## The Vision

I wanted a place to write technical blog posts that:

- ✨ Looks **stunning** with modern design aesthetics
- 📝 Uses **Markdown** for easy content creation
- 🎨 Features **glassmorphism** and smooth animations
- 🔍 Includes **search and filtering** capabilities
- ⚡ Is **fast** and responsive

## Tech Stack

Here's what powers this journal:

```javascript
{
  "framework": "Vite + React",
  "styling": "TailwindCSS",
  "markdown": "react-markdown + remark-gfm",
  "syntax-highlighting": "rehype-highlight",
  "fonts": "Google Fonts (Inter)"
}
```

## Design Philosophy

### Glassmorphism

I used glassmorphism effects throughout the site for a modern, premium feel:

```css
.glass {
  @apply bg-white/5 backdrop-blur-xl border border-white/10;
}
```

This creates those beautiful frosted glass cards you see everywhere on the site.

### Animated Gradients

The hero section features an animated gradient background:

```css
.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}
```

### Dark Mode First

I designed with dark mode as the primary theme, using a carefully curated color palette:

- Background: `#0a0a0f` (deep dark)
- Accent Purple: `#a855f7`
- Accent Blue: `#3b82f6`
- Accent Cyan: `#06b6d4`

## Markdown Integration

One of the coolest features is how blog posts work. Each post is just a markdown file with YAML front matter:

```markdown
---
title: My Blog Post
date: 2025-12-04
tags: [web-dev, tutorial]
excerpt: A short description
---

# Content goes here...
```

The app automatically loads all markdown files and parses them:

```javascript
const postModules = import.meta.glob('./content/posts/*.md', { as: 'raw' });
```

## Features

### Search

Real-time search across all posts:

```javascript
const matchesSearch = !searchQuery || 
  post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
```

### Tag Filtering

Click any tag to filter posts by category. The tags are automatically extracted from all posts.

### Syntax Highlighting

Code blocks get beautiful syntax highlighting using `rehype-highlight` with the Tokyo Night Dark theme.

## What's Next?

Some ideas for future enhancements:

- [ ] Add RSS feed
- [ ] Implement reading progress indicator
- [ ] Add table of contents for long posts
- [ ] Include related posts suggestions
- [ ] Add comments system (maybe using GitHub Discussions)

## Conclusion

Building this journal was a fun afternoon project that resulted in a beautiful, functional space for documenting my technical journey. The combination of Vite's speed, React's flexibility, and TailwindCSS's utility-first approach made development a breeze.

Now I just need to keep writing! 📝
