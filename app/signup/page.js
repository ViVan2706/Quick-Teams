'use client'
import { useState } from 'react';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth, db} from '@/app/lib/firebase/firebase'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async () => {
    try {
        const res = await createUserWithEmailAndPassword(email, password)
        if (!res || !res.user) throw new Error('User creation failed')

        // Bootstrap user profile doc
        const user = res.user
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email || email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          name: '',
          skill: '',
          role: '',
          gender: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true })

        sessionStorage.setItem('user', 'true')
        setEmail('');
        setPassword('')

        // Redirect to profile form for first-time completion
        router.push('/profile')

    } catch(e){
        console.error(e)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96" suppressHydrationWarning>
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button 
          onClick={handleSignUp}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;