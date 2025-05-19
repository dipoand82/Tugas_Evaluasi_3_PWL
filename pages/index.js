import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { data: session } = useSession();
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function fetchNews() {
      const sources = ['bbc-news', 'cnn', 'al-jazeera-english'];
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      const articles = [];

      for (const source of sources) {
        const res = await fetch(
          `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`
        );
        const data = await res.json();
        articles.push(
          ...data.articles.map((article) => ({
            id: `${source}-${article.publishedAt}-${article.title}`,
            title: article.title.slice(0, 100),
            image: article.urlToImage || '/placeholder.jpg',
            publishedAt: new Date(article.publishedAt).toLocaleString('id-ID', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            source: source,
            content: article.content,
            url: article.url,
          }))
        );
      }
      setNews(articles);
    }
    if (session) fetchNews();
  }, [session]);

  if (!session) {
    return (
      <div className={styles.container}>
        <h1>Portal Berita</h1>
        <button onClick={() => signIn('google')}>Login dengan Google</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Daftar Berita Utama</h1>
      <div className={styles.grid}>
        {news.map((article) => (
          <Link key={article.id} href={`/news/${encodeURIComponent(article.id)}`}>
            <div className={styles.card}>
              <img
                src={article.image}
                alt={article.title}
                style={{ width: '300px', height: '200px', objectFit: 'cover' }}
              />
              <h3>{article.title}</h3>
              <p>{article.publishedAt}</p>
              <p>Sumber: {article.source}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}