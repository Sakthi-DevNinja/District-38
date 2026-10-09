import React from 'react';
import { ArrowLeft, Clock, User, Share2, ChevronRight, BookOpen } from 'lucide-react';
import { GUIDES } from '../data/guides';
import { useShop } from '../context/ShopContext';
import { usePageMeta } from '../hooks/use-page-meta';
import { setStructuredData } from '../lib/seo';
import { NotFoundNotice } from '../components/layout/NotFoundNotice';
import { useEffect } from 'react';

interface GuideDetailPageProps {
  slug: string;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({ slug }) => {
  const { navigate, showToast } = useShop();
  const guide = GUIDES.find(g => g.slug === slug);

  usePageMeta(guide ? {
    title: guide.title,
    description: guide.excerpt,
    path: `/guides/${guide.slug}`,
    image: guide.coverImage
  } : null, [slug]);

  useEffect(() => {
    if (!guide) return;
    setStructuredData('ld-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.excerpt,
      image: guide.coverImage,
      author: { '@type': 'Person', name: guide.author },
      datePublished: guide.publishedDate,
      publisher: { '@type': 'Organization', name: 'District 38' }
    });
    return () => setStructuredData('ld-article', null);
  }, [slug]);

  if (!guide) {
    return (
      <NotFoundNotice
        title="Guide not found"
        message="This guide may have moved or the link is incorrect."
        actionLabel="Browse all guides"
        actionPath="/guides"
      />
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.excerpt,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Guide link copied to clipboard!', 'info');
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-neutral-500">
        <button onClick={() => navigate('/')} className="hover:text-neutral-900">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate('/guides')} className="hover:text-neutral-900">Guides</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-semibold truncate">{guide.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
            {guide.category}
          </span>
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 text-xs text-neutral-500 hover:text-neutral-900"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Guide</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight leading-tight">
          {guide.title}
        </h1>

        <div className="flex items-center space-x-4 text-xs text-neutral-500 pb-6 border-b border-neutral-200">
          <div className="flex items-center space-x-1.5">
            <User className="w-4 h-4 text-neutral-400" />
            <span className="font-semibold text-neutral-800">{guide.author}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-neutral-400" />
            <span>{guide.readTime}</span>
          </div>
          <span>•</span>
          <span>{guide.publishDate}</span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="rounded-3xl overflow-hidden shadow-md max-h-96">
        <img src={guide.coverImage} alt={guide.title} className="w-full h-full object-cover" />
      </div>

      {/* Excerpt Lead */}
      <p className="text-sm sm:text-base font-medium text-neutral-700 leading-relaxed bg-neutral-50 p-6 rounded-2xl border border-neutral-200/80 italic">
        "{guide.excerpt}"
      </p>

      {/* Structured Content Sections */}
      <div className="space-y-8 text-neutral-800 text-xs sm:text-sm leading-relaxed">
        {Array.isArray(guide.content) ? (
          guide.content.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              {sec.heading && (
                <h2 className="text-lg sm:text-xl font-bold text-neutral-950 pt-2 pb-1 border-b border-neutral-200">
                  {sec.heading}
                </h2>
              )}
              {sec.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="leading-relaxed text-neutral-700">
                  {para}
                </p>
              ))}
              {sec.callout && (
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 font-medium text-xs space-y-1">
                  <div className="font-bold uppercase tracking-wider text-[10px] text-orange-700">
                    District 38 Technical Note
                  </div>
                  <div>{sec.callout.text}</div>
                </div>
              )}
            </div>
          ))
        ) : null}
      </div>

      {/* Footer Store Callout */}
      <div className="p-6 bg-neutral-950 text-white rounded-3xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-sm text-white">Need a personalized helmet fit test?</h4>
          <p className="text-xs text-neutral-400">Visit our Flagship Store for complimentary laser circumference sizing.</p>
        </div>
        <button
          onClick={() => navigate('/store')}
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold tracking-wide transition-colors shrink-0"
        >
          View Store Hours & Map
        </button>
      </div>
    </article>
  );
};
