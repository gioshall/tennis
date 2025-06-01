import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';


export default function ProfileForm() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    experience: '',
    level: '',
    location: '',
    courtName: ''
  });
  const [selectedCity, setSelectedCity] = useState(profile.location || '');
  const [selectedCourt, setSelectedCourt] = useState('');
  const [customCourt, setCustomCourt] = useState('');

  //   const taiwanCities = [
//   "台北市", "新北市", "基隆市", "桃園市", "新竹市", "新竹縣",
//   "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市",
//   "嘉義縣", "台南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣",
//   "台東縣", "澎湖縣", "金門縣", "連江縣"
// ];

const taiwanCities = {
  "台北市": ["大安運動中心", "天母網球場", "青年公園網球場"],
  "新北市": ["新莊體育場", "板橋第一運動場", "三重運動中心"],
  "台中市": ["台中網球中心", "北區國民運動中心"],
  "高雄市": ["高雄市立網球場", "楠梓運動中心"],
  "其他": []
};

  const uid = auth.currentUser?.uid;

  // 讀取使用者資料

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setSelectedCity(data.location || '');
          setSelectedCourt(data.courtName || '');
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  
  const handleChange = (e) => {
  const { name, value } = e.target;
  setProfile({ ...profile, [name]: value });

  if (name === 'location') {
    setSelectedCity(value);
    setSelectedCourt('');
    setCustomCourt('');
  }

  if (name === 'courtName') {
    setSelectedCourt(value);
    if (value !== '其他') {
      setCustomCourt('');
    }
  }
};



  const handleSave = async () => {
  if (!uid) return;

  const newProfile = {
    ...profile,
    location: selectedCity,
    courtName: selectedCourt === '其他' ? customCourt : selectedCourt
  };

  await setDoc(doc(db, 'users', uid), newProfile);
  setProfile(newProfile);
  alert('個人資料已儲存！');
};



const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('已登出');
    } catch (err) {
      alert('登出失敗: ' + err.message);
    }
  };


  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">編輯個人資料</h2>

      {user && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">登入帳號：{user.email}</p>
          <button onClick={handleLogout} className="text-red-500 text-sm underline">登出</button>
        </div>
      )}

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
      
      {/* 縣市選擇 */}
<select
  className="border p-2 rounded w-full"
  name="location"
  value={selectedCity}
  onChange={handleChange}
>
  <option value="">請選擇常打縣市</option>
  {Object.keys(taiwanCities).map((city) => (
    <option key={city} value={city}>{city}</option>
  ))}
</select>

{/* 球場選擇 */}
{selectedCity && taiwanCities[selectedCity]?.length > 0 && (
  <select
    className="border p-2 rounded w-full"
    name="courtName"
    value={selectedCourt}
    onChange={handleChange}
  >
    <option value="">請選擇球場</option>
    {taiwanCities[selectedCity].map((court) => (
      <option key={court} value={court}>{court}</option>
    ))}
    <option value="其他">其他</option>
  </select>
)}

{/* 使用者自填球場名稱 */}
{selectedCourt === '其他' && (
  <input
    className="border p-2 rounded w-full"
    placeholder="請輸入球場名稱"
    value={customCourt}
    onChange={(e) => setCustomCourt(e.target.value)}
  />
)}

      <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
        儲存
      </button>
    </div>
  );
}