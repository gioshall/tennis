import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function ProfileForm() {
  const [profile, setProfile] = useState({
    name: '',
    experience: '',
    level: '',
    location: ''
  });

  const uid = auth.currentUser?.uid;

  // 讀取使用者資料
  useEffect(() => {
    const fetchProfile = async () => {
      if (!uid) return;
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    };
    fetchProfile();
  }, [uid]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!uid) return;
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, profile);
    alert('個人資料已儲存！');
  };

  console.log('使用者個人資料：', profile);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">編輯個人資料</h2>
      <input
        className="border p-2 rounded mb-2 w-full"
        name="name"
        placeholder="暱稱"
        value={profile.name}
        onChange={handleChange}
      />
      <input
        className="border p-2 rounded mb-2 w-full"
        name="experience"
        placeholder="球齡"
        value={profile.experience}
        onChange={handleChange}
      />

      <input
        className="border p-2 rounded mb-2 w-full"
        name="level"
        placeholder="程度"
        value={profile.level}
        onChange={handleChange}
      />
      
      <input
        className="border p-2 rounded mb-4 w-full"
        name="location"
        placeholder="常打地點"
        value={profile.location}
        onChange={handleChange}
      />
      <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
        儲存
      </button>
    </div>
  );
}