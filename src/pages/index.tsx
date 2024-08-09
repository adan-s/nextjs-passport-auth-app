import { useRouter } from 'next/router';
import LoginPage from './login';

const HomePage = () => {
  const router = useRouter();

  return (
    <div>
      <LoginPage/>
    </div>
  );
};

export default HomePage;
