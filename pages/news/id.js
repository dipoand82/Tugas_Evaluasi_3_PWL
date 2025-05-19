import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/News.module.css';

export default function NewsDetail() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      const sources = ['bbc-news', 'cnn', 'al-jazeera-english'];
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      let foundArticle = null;

      for (const source of sources) {
        const res = await fetch(
          `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`
        );
        const data = await res.json();
        const article = data.articles.find(
          (a) => `${source}-${a.publishedAt}-${a.title}` === id
        );
        if (article) {
          foundArticle = {
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
            content: article.content || 'Konten tidak tersedia.',
            url: article.url,
          };
          break;
        }
      }
      setArticle(foundArticle);
    }
    if (id && session) fetchNews();
  }, [id, session]);

  if (!session) {
    return <div>Harap login terlebih dahulu.</div>;
  }

  if (!article) {
    return <div>Berita tidak ditemukan.</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{article.title}</h1>
      <img
        src={article.image}
        alt={article.title}
        style={{ width: '600px', height: '400px', objectFit: 'cover' }}
      />
      <p>Waktu: {article.publishedAt}</p>
      <p>Sumber: {article.source}</p>
      <p>{article.content}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        Baca selengkapnya
      </a>
    </div>
  );
}