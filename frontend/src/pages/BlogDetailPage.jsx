import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    axios.get(`http://localhost:8000/api/blogs/${slug}`)
      .then(res => setBlog(res.data))
      .catch(err => {
          console.error(err);
          setError("Artikel tidak ditemukan atau terjadi kesalahan peladen.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const getImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2670&auto=format&fit=crop";
    return path.startsWith('http') ? path : `http://localhost:8000${path}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-margin py-stack-lg flex-1 w-full bg-white mt-6 rounded-xl border border-surface-variant shadow-sm mb-12 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-4">settings</span>
             <p className="text-on-surface-variant animate-pulse">Memuat artikel...</p>
          </div>
        ) : error ? (
            <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
                <h2 className="text-2xl font-bold text-on-surface mb-2">Ups!</h2>
                <p className="text-on-surface-variant mb-6">{error}</p>
                <Link to="/blog" className="text-primary font-bold hover:underline">Kembali ke Beranda Blog</Link>
            </div>
        ) : blog && (
          <article className="px-4 md:px-8 py-4">
            <Link to="/blog" className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-primary font-bold hover:bg-primary-container/10 transition-all mb-8">
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span> 
                Kembali ke Blog
            </Link>
            
            <header className="mb-10 text-center">
                <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container font-bold text-xs rounded-full uppercase tracking-wider mb-4">
                    {blog.category}
                </span>
                <h1 className="font-headline-xl text-3xl md:text-5xl text-on-surface mb-6 leading-tight">
                    {blog.title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-on-surface-variant text-sm font-medium">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">person</span> {blog.author || 'Admin'}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">calendar_today</span> {formatDate(blog.created_at)}</span>
                </div>
            </header>

            <div className="w-full h-64 md:h-[400px] lg:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-lg border border-surface-variant">
                <img src={getImageUrl(blog.image_url)} alt={blog.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-lg md:prose-xl max-w-none text-on-surface font-body-lg text-lg !leading-relaxed">
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        img: ({node, ...props}) => <img {...props} src={getImageUrl(props.src)} className="rounded-xl shadow-md mx-auto my-8 border border-surface-variant max-w-full h-auto" alt={props.alt || ''} />,
                        h2: ({node, ...props}) => <h2 {...props} className="text-2xl font-bold mt-10 mb-4 text-on-surface" />,
                        h3: ({node, ...props}) => <h3 {...props} className="text-xl font-bold mt-8 mb-3 text-on-surface" />,
                        p: ({node, ...props}) => <p {...props} className="mb-6 leading-relaxed" />,
                        ul: ({node, ...props}) => <ul {...props} className="list-disc pl-6 mb-6" />,
                        ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-6 mb-6" />,
                    }}
                >
                    {blog.content}
                </ReactMarkdown>
            </div>

            <footer className="mt-16 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold text-xl uppercase">
                        {blog.author ? blog.author.substring(0, 2) : 'AD'}
                    </div>
                    <div>
                        <p className="font-bold text-on-surface">{blog.author || 'Admin'}</p>
                        <p className="text-sm text-on-surface-variant">Penulis Kreatif Westtamp</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors border border-outline-variant group">
                        <span className="material-symbols-outlined text-[24px]">share</span>
                    </button>
                    <button className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors border border-outline-variant group">
                        <span className="material-symbols-outlined text-[24px]">favorite</span>
                    </button>
                </div>
            </footer>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
