import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children, value }) {
  const [currentUser, setCurrentUser] = useState(value?.user || null);
  const [loading, setLoading] = useState(true);

  // Registrar com email e senha (+ nome e foto opcional)
  async function register(email, password, name, photoURL) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar o perfil do usuário com nome e foto
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL || userCredential.user.photoURL || null,
      });
      
      // Criar documento do usuário no Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        photoURL: photoURL || userCredential.user.photoURL || null,
        createdAt: new Date()
      });
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Login com email e senha
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Login com Google
  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Verificar se o usuário já existe no Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      // Se não existir, criar um novo documento
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          createdAt: new Date()
        });
      }
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  function logout() {
    return signOut(auth);
  }

  // Atualizar o usuário atual quando o estado de autenticação mudar
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const valueCtx = {
    currentUser,
    register,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={valueCtx}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;