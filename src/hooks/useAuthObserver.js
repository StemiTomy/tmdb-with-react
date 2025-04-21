import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export const useAuthObserver = (onLogin, onLogout) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const token = localStorage.getItem('token');
        const apiKey = localStorage.getItem('userApiKey');

        if (token && apiKey) {
          console.log(`Usuario logeado: ${user.uid}`);
          onLogin(token, apiKey);
        } else {
          console.log('Usuario detectado pero sin token/apiKey: ignorado');
        }
      } else {
        console.log('Usuario deslogeado');
        onLogout();
      }
    });

    return () => unsubscribe();
  }, [onLogin, onLogout]);
};
