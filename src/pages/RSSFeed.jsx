import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import { GlassCard, Button } from '../components/UI';
import { Rss, Clipboard } from 'lucide-react';

// Function to generate the RSS feed XML
const generateRssFeed = (posts) => {
  const siteUrl = window.location.origin;
  const feedItems = posts
    .map(post => {
      // Basic HTML removal for description
      const description = post.content ? post.content.substring(0, 200).replace(/<[^>]+>/g, '') + '...' : '';
      return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${siteUrl}/post/${post.id}</link>
          <guid isPermaLink="true">${siteUrl}/post/${post.id}</guid>
          <pubDate>${new Date(post.createdAt?.toDate()).toUTCString()}</pubDate>
          <description><![CDATA[${description}]]></description>
        </item>
      `;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>BlogSphere - Latest Posts</title>
        <link>${siteUrl}</link>
        <description>The latest articles and stories from the BlogSphere community.</description>
        <language>en-us</language>
        <lastBuildDate>${new Date(posts[0]?.createdAt?.toDate()).toUTCString()}</lastBuildDate>
        <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
        ${feedItems}
      </channel>
    </rss>
  `;
};

// Simple parser for the generated XML
const parseRssFeed = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  const channel = xmlDoc.querySelector("channel");
  const items = Array.from(xmlDoc.querySelectorAll("item")).map(item => ({
    title: item.querySelector("title").textContent,
    link: item.querySelector("link").textContent,
    pubDate: item.querySelector("pubDate").textContent,
    description: item.querySelector("description").textContent,
  }));

  return {
    title: channel.querySelector("title").textContent,
    link: channel.querySelector("link").textContent,
    description: channel.querySelector("description").textContent,
    items,
  };
};

export default function RSSFeedPage() {
  const [rssXml, setRssXml] = useState('');
  const [parsedFeed, setParsedFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPostsAndGenerateFeed = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const feed = generateRssFeed(posts.length > 0 ? posts : []);
        setRssXml(feed);
        setParsedFeed(parseRssFeed(feed));

      } catch (error) {
        console.error("Error generating RSS feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndGenerateFeed();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(rssXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 text-slate-900 dark:text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Rss size={28} /> RSS Feed</h1>
        <Button onClick={handleCopy} className="flex items-center gap-2">
          <Clipboard size={16} />
          {copied ? 'Copied!' : 'Copy XML'}
        </Button>
      </div>

      {loading && <p className="text-slate-500 dark:text-white/50">Generating RSS Feed...</p>}

      {!loading && parsedFeed && (
        <GlassCard className="bg-white/60 dark:bg-slate-900/60 p-6 border-slate-200 dark:border-white/10">
          <div className="mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{parsedFeed.title}</h2>
            <p className="text-slate-600 dark:text-white/60">{parsedFeed.description}</p>
            <a href={parsedFeed.link} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">
              {parsedFeed.link}
            </a>
          </div>

          <div className="space-y-4">
            {parsedFeed.items.map((item, index) => (
              <div key={index} className="border-b border-slate-200 dark:border-white/5 pb-4 last:border-b-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {item.title}
                  </a>
                </h3>
                <p className="text-sm text-slate-500 dark:text-white/50 mb-2">{new Date(item.pubDate).toLocaleString()}</p>
                <p className="text-slate-700 dark:text-white/80">{item.description}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
      <div className="mt-6 text-sm text-slate-500 dark:text-white/40">
        <p>
          This page provides a human-readable version of the RSS feed. To subscribe, use the raw XML feed URL.
        </p>
        <p className="mt-2">
          In a real application, the XML content would be served from a dedicated endpoint like <code>/rss.xml</code> with an <code>application/xml</code> content type.
        </p>
      </div>
    </div>
  );
}