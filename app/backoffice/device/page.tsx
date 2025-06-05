'use client'

import { useState, useEffect, useRef } from "react"
import config from "@/app/config"
import clsx from "clsx"
import Swal from "sweetalert2"
import axios from "axios"
import Modal from "@/app/components/modal"
import dayjs from "dayjs"

export default function Page() {
    const [devices, setDevices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [serial, setSerial] = useState('');
    const [name, setName] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [remark, setRemark] = useState('');
    const [id, setId] = useState(0);

    // pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [totalPage, setTotalPage] = useState(0);
    const [totalPageList, setTotalPageList] = useState<number[]>([]); //array ไว้เก็บเลขหน้าว่าอยู่หน้าที่เท่าไหร่

    const didFetch = useRef(false);

    useEffect(() => {
        if (didFetch.current) return; // ถ้า fetch แล้ว ไม่ต้องทำอีก
        didFetch.current = true;

        fetchData(page);
    }, []);

    const fetchData = async (page: number) => {
        try {
            const params = {
                page: page,
                pageSize: pageSize
            }
            const response = await axios.get(`${config.apiUrl}/api/device/listDevicesPage`, { params: params });
            setDevices(response.data.results);

            if (totalPage === 0) {
                setTotalPage(response.data.totalPage);

                for (let i = 1; i <= response.data.totalPage; i++) {
                    totalPageList.push(i);
                }
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleSave = async () => {
        try {
            const payload = {
                barcode: barcode,
                serial: serial,
                name: name,
                expireDate: new Date(expireDate),
                remark: remark
            }

            if (id === 0) {
                await axios.post(`${config.apiUrl}/api/device/create`, payload);
            } else{
                await axios.put(`${config.apiUrl}/api/device/update/${id}`, payload);
            }

            setShowModal(false);
            setBarcode('');
            setSerial('');
            setName('');
            setExpireDate('');
            setRemark('');
            setId(0);

            fetchData(page);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }

    const handleEdit = (item: any) => {
        setId(item.id);
        setBarcode(item.barcode);
        setSerial(item.serial)
        setName(item.name)
        setExpireDate(item.expireDate)
        setRemark(item.remark)

        setShowModal(true);
    }

    const handleDelete = async (id: string) => {
        try {
            const button = await config.confirmDialog();

            if (button.isConfirmed) {
                await axios.delete(`${config.apiUrl}/api/device/remove/${id}`);
                fetchData(page);
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }


    // pagination btn
    const handlePreviousPage = () => {
        if (page > 1) {
            const newPrePage = page - 1;
            setPage(newPrePage);
            fetchData(newPrePage);
        }
    }

    const handleNextPage = () => {
        if (page < totalPage) {
            const newNextPage = page + 1;
            setPage(newNextPage);
            fetchData(newNextPage);
        }
    }
    
    const handleChangePage = (pageChanged: number) => {
        setPage(pageChanged);
        fetchData(pageChanged);
    }


    return (
        <div className="card">
            <h1>ทะเบียนวัสดุ อุปกรณ์</h1>
            <div className="card-body">
                <button className="btn btn-primary" onClick={handleShowModal}>
                    <i className="fa-solid fa-plus mr-2"></i>
                    เพิ่มข้อมูล
                </button>

                <table className="table">
                    <thead>
                        <tr>
                            <th>ชื่อวัสดุ</th>
                            <th>Barcode</th>
                            <th>Serial</th>
                            <th>วันหมดอายุ</th>
                            <th>หมายเหตุ</th>
                            <th style={{ width: '220px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((item: any) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.barcode}</td>
                                <td>{item.serial}</td>
                                <td>{dayjs(item.expireDate).format('DD/MM/YYYY')}</td>
                                <td>{item.remark}</td>
                                <td className="flex gap-2 justify-center">
                                    <button className="btn-edit" onClick={() => handleEdit(item)}>
                                        <i className="fa-solid fa-pen-to-square mr-2"></i>
                                        แก้ไข
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                                        <i className="fa-solid fa-trash mr-2"></i>
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* pagination */}
                <div className="flex justify-end gap-2 mt-5">
                    <button className="prev-page" onClick={handlePreviousPage}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    {totalPageList.map((item: number) => (
                        <button key={item} className={clsx("number-page", page === item ? "active" : "")} onClick={() => handleChangePage(item)}>
                            {item}
                        </button>
                    ))}
                    <button className="next-page" onClick={handleNextPage}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            <Modal title="ทะเบียนวัสดุ อุปกรณ์" isOpen={showModal} onClose={handleCloseModal}>
                    <div>Barcodes</div>
                    <input type="text" className="form-control" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                    
                    <div className="mt-3">Serial</div>
                    <input type="text" className="form-control" value={serial} onChange={(e) => setSerial(e.target.value)} />
                    
                    <div className="mt-3">ชื่อวัสดุ อุปกรณ์</div>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                    
                    <div className="mt-3">วันที่หมดอายุ</div>
                    <input type="date" className="form-control" value={expireDate} onChange={(e) => setExpireDate(e.target.value)} />
                    
                    <div className="mt-3">หมายเหตุ</div>
                    <input type="text" className="form-control" value={remark} onChange={(e) => setRemark(e.target.value)} />

                    <button className="btn btn-primary mt-4" onClick={handleSave}>
                        <i className="fa-solid fa-check mr-3"></i>
                        บันทึกข้อมูล
                    </button>
            </Modal>
        </div>
    ); 

}