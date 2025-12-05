import 'highlight.js/styles/tokyo-night-dark.css';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const BlogPost = ({ post, onClose }) => {
    if (!post) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-dark/80 backdrop-blur-sm" onClick={onClose}>
            <div className="min-h-screen px-4 py-12 flex items-center justify-center">
                <div
                    className="glass rounded-3xl p-8 md:p-12 max-w-4xl w-full relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 rounded-full glass glass-hover flex items-center justify-center"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Post header */}
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 text-gray-400">
                            <time>{formatDate(post.date)}</time>
                            <span>•</span>
                            <span>{post.readTime || '5 min read'}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags && post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 text-xs font-medium rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Post content */}
                    <div className="markdown-content">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
