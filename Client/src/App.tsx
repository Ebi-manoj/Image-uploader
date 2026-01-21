import { useEffect } from 'react';
import { axiosInstance } from './utils/axios';

function App() {
  useEffect(() => {
    (async () => {
      const res = await axiosInstance.get('/health');
      console.log(res.data);
    })();
  }, []);
  return (
    <div>
      <h1 className="text-red-500">Hello world</h1>
    </div>
  );
}

export default App;
