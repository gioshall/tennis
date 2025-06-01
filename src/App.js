import React from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AuthForm from './components/AuthForm';
import ProfileForm from './components/ProfileForm';


function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {user ? <ProfileForm /> : <AuthForm />}
    </div>
  );
}
export default App;