import matter from 'gray-matter';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BlogPost from '../components/BlogPost';

const PostPage = () => {
    const location = useLocation();
    const slug = location.pathname.replace('/post/', '');

    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setPost(null);

        const loadPost = async () => {
            try {
                // Load all posts
                const postModules = import.meta.glob('../content/posts/**/*.md', { query: '?raw', import: 'default' });

                let foundContent = null;
                const subArticlesList = [];
                const ancestors = [];

                for (const path in postModules) {
                    // Extract slug from path
                    const postSlug = path
                        .replace('../content/posts/', '')
                        .replace('.md', '')
                        .replaceAll(' ', '-');

                    // Check if this is the main post
                    if (postSlug.toLowerCase() === slug.toLowerCase()) {
                        foundContent = await postModules[path]();
                    }

                    // Check if this is an ancestor
                    if (slug.toLowerCase().startsWith(postSlug.toLowerCase() + '/')) {
                        const content = await postModules[path]();
                        const { data } = matter(content);
                        ancestors.push({
                            title: data.title || 'Untitled',
                            slug: postSlug
                        });
                    }

                    // Check if this is a sub-article (direct child)
                    // e.g. slug="A", postSlug="A/B" -> startsWith("A/") and no other slashes
                    if (postSlug.toLowerCase().startsWith(slug.toLowerCase() + '/') &&
                        !postSlug.slice(slug.length + 1).includes('/')) {

                        const content = await postModules[path]();
                        const { data } = matter(content);
                        subArticlesList.push({
                            title: data.title || 'Untitled',
                            slug: postSlug,
                            date: data.date
                        });
                    }
                }

                if (!foundContent) {
                    throw new Error('Post not found');
                }

                // Sort ancestors by slug length to ensure correct hierarchy order
                ancestors.sort((a, b) => a.slug.length - b.slug.length);

                // Parse the main post
                const { data, content: markdownContent } = matter(foundContent);

                const breadcrumbs = [
                    { label: 'Home', path: '/' },
                    ...ancestors.map(a => ({ label: a.title, path: `/post/${a.slug}` })),
                    { label: data.title || 'Untitled', path: null }
                ];

                setPost({
                    title: data.title || 'Untitled',
                    date: data.date || new Date().toISOString().split('T')[0],
                    tags: data.tags || [],
                    excerpt: data.excerpt || '',
                    readTime: data.readTime || '5 min read',
                    content: markdownContent,
                    slug: slug,
                    subArticles: subArticlesList,
                    breadcrumbs: breadcrumbs
                });
                setLoading(false);
            } catch (error) {
                console.error('Error loading post:', error);
                setLoading(false);
            }
        };

        loadPost();
    }, [slug]);

    // Scroll to heading if URL has a fragment
    useEffect(() => {
        if (!loading && window.location.hash) {
            const headingId = window.location.hash.slice(1);
            setTimeout(() => {
                const element = document.getElementById(headingId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [loading, window.location.hash]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-400">Post not found</div>
            </div>
        );
    }

    return <BlogPost post={post} onClose={() => navigate('/')} />;
};

export default PostPage;
