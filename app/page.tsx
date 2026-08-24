'use client';
import Swal from "sweetalert2";
import { config } from "./config";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ loading, setLoading ] = useState(false);

  const loadingOvelay = () => {
    if (loading === true) {
      return (
        <div className="overlay">
        <div className="overlayDoor"></div>
        <div className="overlayContent">
          <div className="loader">
            <div className="inner"></div>
          </div>
        </div>
      </div>
      );
    } else {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      if (username === '' || password === '') {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: 'Username and Password are required'
        });

        setLoading(false);
        return;
      }

      const payload = {
        username,
        password
      }

      const response = await axios.post(`${config.apiUrl}/api/user/signin`, payload);

      if (response.data.token !== undefined) {
        localStorage.setItem(config.tokenKey, response.data.token);
        localStorage.setItem('bun_service_name',response.data.user.username)
        localStorage.setItem('bun_service_level',response.data.user.level)

        if (response.data.user.level === 'admin') {
          router.push('/backoffice/dashboard');
        } else if (response.data.user.level === 'user') {
          router.push('/backoffice/repair-record');
        } else if (response.data.user.level === 'engineer') {
          router.push('/backoffice/repair-status');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: 'Invalid Username or Password'
        })
        setLoading(false);
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: error.message
      });
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-gray-800 to-gray-950">
      {loadingOvelay()}
      <div className="text-gray-400 text-4xl font-bold mb-10">ระบบ Ben Service</div>
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white"><div>เข้าสู่ระบบ</div></h1>
        <form className="flex flex-col gap-2 mt-10 w-full" onSubmit={handleSubmit}>
          <div>
            <i className="fa fa-user mr-2"></i>
            Username
          </div>
          <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <div className="mt-5">
            <i className="fa fa-lock mr-2"></i>
            Password
          </div>
          <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="btn mt-5 text-xl">
            <i className="fa fa-sign-in-alt mr-2"></i>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
