import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/');
    return null;
  }

  return (
    <div className={styles.container}>
      <h1>Login ke Portal Berita</h1>
      <button onClick={() => signIn('google')}>Login dengan Google</button>
    </div>
  );
}