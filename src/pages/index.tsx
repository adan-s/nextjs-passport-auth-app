import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(path);
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => handleClick('/login')}>Login</button>
      <button onClick={() => handleClick('/signup')}>Signup</button>
      <button onClick={() => handleClick('/profile')}>Profile</button>
    </div>
  );
};

export default HomePage;
