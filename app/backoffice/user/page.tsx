'use client'

import { useState,useEffect } from "react"
import axios from "axios"
import config from "@/app/config"
import Modal from "@/app/components/modal"
import Swal from "sweetalert2"

export default function Page() {
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [levels, setLevels ] = useState(['admin', 'user', 'engineer']);
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [level, setLevel] = useState('admin')

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await axios.get(`${config.apiUrl}/api/user/list`);
        setUsers(response.data);
        console.log(response.data);
    }

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleSave = async () => {
        try {
            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'รหัสผ่านไม่ตรงกัน'
                });
                return;
            }

            const payload = {
                username: username,
                password: password,
                level: level
            }

            if (id == '') {
                await axios.post(`${config.apiUrl}/api/user/create`, payload);
            } else {
                await axios.put(`${config.apiUrl}/api/user/updateUser/${id}`, payload);
                setId('')
            }

            fetchUsers();
            handleCloseModal();

            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setLevel('admin');
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            })
        }
    }

    const handleEdit = (user: any) => {
        setId(user.id);
        setUsername(user.username);
        setPassword('');
        setConfirmPassword('');
        setLevel(user.level);
        setShowModal(true);
    }

    const handleDelete = async (id: string) => {
        try {
            const button = await config.confirmDialog();
            if (button.isConfirmed) {
                await axios.delete(`${config.apiUrl}/api/user/remove/${id}`);
                fetchUsers();
            }
        } catch (e: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: e.message
            })
        }
    }

    return (
        <div className="card">
            <h1>พนังงานร้าน</h1>
            <div className="card-body">
                <button className="btn btn-primary" onClick={handleShowModal}>
                    <i className="fa-solid fa-plus mr-2"></i>
                    เพิ่มข้อมูล
                </button>

                <table className="table table-striped mt-5">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th style={{ width: '150px'}}>Level</th>
                            <th style={{width: '220px'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.level}</td>
                                <td className="text-center">
                                    <button className="btn-edit" 
                                        onClick={() => handleEdit(user)}>
                                        <i className="fa-solid fa-edit mr-2"></i>
                                        แก้ไข
                                    </button>
                                    <button className="btn-delete"
                                        onClick={() => handleDelete(user.id)}>
                                        <i className="fa-solid fa-trash mr-2"></i>
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal title="เพิ่มข้อมูลพนักงาน" isOpen={showModal} onClose={() => handleCloseModal()}>
                <div>Username</div>
                <input 
                    type="text" 
                    className="form-control" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} />

                <div className="mt-3">Password</div>
                <input 
                    type="password" 
                    className="form-control" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} />

                <div className="mt-3">Confirm Password</div>
                <input 
                    type="password" 
                    className="form-control" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}/>

                <div className="mt-3">Level</div>
                <select 
                    className="form-control" 
                    onChange={(e) => setLevel(e.target.value)}>
                    {levels.map((level: any) => (
                        <option key={level} value={level}>{level[0].toUpperCase() + level.slice(1)}</option>
                    ))}
                </select>
                
                <button className="btn btn-primary mt-4" onClick={handleSave}>
                    <i className="fa-solid fa-check mr-3"></i>
                    บันทึกข้อมูล
                </button>
            </Modal>
        </div>
    )
}