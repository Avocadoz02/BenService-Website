'use client'

import { useEffect, useState } from "react"
import Modal from "@/app/components/modal"
import Swal from "sweetalert2"
import config from "@/app/config"
import axios from "axios"
import dayjs from "dayjs"

export default function Page() {
    const [devices, setDevices] = useState([]);
    const [repairRecords, setRepairRecords] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [deviceBarcode, setDeviceBarcode] = useState('');
    const [deviceSerial, setDeviceSerial] = useState('');
    const [problem, setProblem] = useState('');
    const [solving, setSolving] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [id, setId] = useState(0);
    const [loading, setLoading] = useState(false);

    // รับเครื่อง
    const [showModalReceive, setShowModalReceive] = useState(false);
    const [recieveCustomerName, setRecieveCustomerName] = useState('');
    const [recieveAmount, setRecieveAmount] = useState(0);
    const [recieveId, setRecieveId] = useState(0);
    const [SolvingReceive, setSolvingRecieve] = useState('');
    const [payDate, setPayDate] = useState('');

    useEffect(() => {
        fetchDevices();
        fetchRepairRecord();
    }, []);

    const fetchDevices = async () => {
        const response = await axios.get(`${config.apiUrl}/api/device/list`);
        setDevices(response.data);
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setId(0);
        setCustomerName('');
        setCustomerPhone('');
        setDeviceId('');
        setDeviceName('');
        setDeviceBarcode('');
        setDeviceSerial('');
        setExpireDate('');
        setProblem('');
    }

    const fetchRepairRecord = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.apiUrl}/api/repairRecord/list`);
            setRepairRecords(response.data);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        } finally {
            setLoading(false);
        }
    }

    const handleDeviceChange = (deviceId: string) => {
        const device = (devices as any).find((device: any) => device.id === parseInt(deviceId));

        if (device) { // if device is found.
            setDeviceId(device.id);
            setDeviceName(device.name);
            setDeviceBarcode(device.barcode);
            setDeviceSerial(device.serial);
            setExpireDate(dayjs(device.expire_date).format('YYYY-MM-DD'));
        } else {
            setDeviceId('');
            setDeviceName('');
            setDeviceBarcode('');
            setDeviceSerial('');
            setExpireDate('');
        }
    }

    const handleSave = async () => {
        const payload = {
            customerName: customerName,
            customerPhone: customerPhone,
            deviceId: deviceId == '' ? undefined : deviceId,
            deviceName: deviceName,
            deviceBarcode: deviceBarcode,
            deviceSerial: deviceSerial,
            expireDate: expireDate == '' ? undefined : new Date(expireDate),
            problem: problem,
            solving: solving
        }

        try {

            if (id == 0) {
                await axios.post(`${config.apiUrl}/api/repairRecord/create`, payload);
            } else {
                await axios.put(`${config.apiUrl}/api/repairRecord/update/${id}`, payload);
                setId(0);
            }
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูล',
                text: 'บันึกข้อมูลเรียบร้อย',
                timer: 2000
            });

            closeModal();
            fetchRepairRecord();
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }

    const getStatusName = (status: string) => {
        switch (status) {
            case 'active':
                return 'รอซ่อม';
            case 'pending':
                return 'รอลูกค้ายืนยัน';
            case 'repairing':
                return 'กำลังซ่อม';
            case 'cancle':
                return 'ยกเลิก';
            case 'done':
                return 'ซ่อมเสร็จแล้ว';
            case 'complete':
                return 'ลูกค้ามารับอุปกรณ์';
            default:
                return 'รอซ่อม';
        }
    }

    const handleEdit = async (repairRecord: any) => {
        setId(repairRecord.id);
        setCustomerName(repairRecord.customerName);
        setCustomerPhone(repairRecord.customerPhone);
        if (repairRecord.deviceId) {
            setDeviceId(repairRecord.deviceId); 
        }
        setDeviceName(repairRecord.deviceName);
        setDeviceBarcode(repairRecord.deviceBarcode);
        setDeviceSerial(repairRecord.deviceSerial);
        setExpireDate(dayjs(repairRecord.expireDate).format('YYYY-MM-DD'));
        setProblem(repairRecord.problem);

        openModal();
    }

    const handleDelete = async (id: number) => {
        const button = await config.confirmDialog();
        if (button.isConfirmed) {
            await axios.delete(`${config.apiUrl}/api/repairRecord/remove/${id}`);
            fetchRepairRecord();
        }
    }

    const openModalReceive = (repairRecord: any) => {
        setShowModalReceive(true);
        setRecieveCustomerName(repairRecord.customerName);
        setRecieveAmount(repairRecord.amount ?? 0);
        setRecieveId(repairRecord.id);
        setSolvingRecieve(repairRecord.solving);
        setPayDate(dayjs(repairRecord.payDate).format('YYYY-MM-DD'));
    }
    const closeModalReceive = () => {
        setShowModalReceive(false);
        setRecieveId(0); // clear Id
    }

    const handleReceive = async () => {
        const payload = {
            id: recieveId,
            amount: recieveAmount
        }

        await axios.put(`${config.apiUrl}/api/repairRecord/receive`, payload);

        fetchRepairRecord();
        closeModalReceive();
    }

    return (
        <div className="card">
            <h1>บันทึกการซ่อม</h1>
            <div className="card-body">
                <button className="btn btn-primary" onClick={openModal}>
                    <i className="fa-solid fa-plus mr-2"></i>
                        เพิ่มข้อมูลการซ่อม
                </button>
                
                {loading ? <div className="skeleton min-h-[800px] mt-5"></div> :
                    <table className="table mt-5">
                        <thead>
                            <tr>
                                <th>ชื่อลูกค้า</th>
                                <th>เบอร์โทรศัพท์</th>
                                <th style={{width: "300px"}}>อุปกรณ์</th>
                                <th>อาการ</th>
                                <th>วันที่รับซ่อม</th>
                                <th>วันที่ซ่อมเสร็จ</th>
                                <th>สถานะ</th>
                                <th style={{width: "110px"}}>ค่าบริการ</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {repairRecords.map((repairRecord: any, index: number) => (
                                <tr key={index}>
                                    <td>{repairRecord.customerName}</td>
                                    <td>{repairRecord.customerPhone}</td>
                                    <td>{repairRecord.deviceName}</td>
                                    <td>{repairRecord.problem}</td>
                                    <td>{dayjs(repairRecord.createdAt).format('DD/MM/YYYY')}</td>
                                    <td>{repairRecord.endJobDate ? dayjs(repairRecord.endJobDate).format('DD/MM/YYYY') : '-'}</td>
                                    <td>{getStatusName(repairRecord.status)}</td>
                                        {repairRecord.amount ? <td className="text-right!">{repairRecord.amount?.toLocaleString()} ฿</td> : <td>-</td>}
                                    <td className="grid grid-cols-2 gap-2 min-w-[240px]">
                                        <button className="btn-receive col-span-2" onClick={() => openModalReceive(repairRecord)}>
                                            <i className="fa-solid fa-check mr-2"></i>
                                            รับเครื่อง
                                        </button>
                                        <button className="btn-edit" onClick={() => handleEdit(repairRecord)}>
                                            <i className="fa-solid fa-edit mr-2"></i>
                                            แก้ไข
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(repairRecord.id)}>
                                            <i className="fa-solid fa-trash mr-2"></i>
                                            ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>

            <Modal title="เพิ่มข้อมูลการซ่อม" isOpen={showModal} onClose={() => closeModal()} size="xl">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <div>ชื่อลูกค้า</div>
                        <input type="text" 
                        value={customerName} 
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="form-control" />
                    </div>
                    <div className="w-1/2">
                        <div>เบอร์โทรศัพท์</div>
                        <input type="text" 
                        value={customerPhone} 
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="form-control" />
                    </div>
                </div>

                <div className="mt-4">ชื่ออุปกรณ์ (ในระบบ)</div>
                <select className="form-control" value={deviceId} onChange={(e) => handleDeviceChange(e.target.value)}>
                    <option value="">--- เลือกอุปกรณ์ ---</option>
                    {devices.map((device: any) => (
                        <option value={device.id} key={device.id}>
                            {device.name}
                        </option>
                    ))}
                </select>
                
                <div className="mt-4">ชื่ออุปกรณ์ (นอกระบบ)</div>
                <input type="text" 
                value={deviceName} 
                onChange={(e) => setDeviceName(e.target.value)}
                className="form-control" />

                <div className="flex gap-4 mt-4">
                    <div className="w-1/2">
                        <div>Barcode</div>
                        <input type="text"
                        value={deviceBarcode} 
                        onChange={(e) => setDeviceBarcode(e.target.value)}
                        className="form-control"/>
                    </div>
                    <div className="w-1/2">
                        <div>Serial</div>
                        <input type="text"
                        value={deviceSerial} 
                        onChange={(e) => setDeviceSerial(e.target.value)}
                        className="form-control"/>
                    </div>
                </div>
                
                <div className="mt-4">วันหมดประกัน</div>
                <input type="date" 
                value={expireDate} 
                onChange={(e) => setExpireDate(e.target.value)}
                className="form-control" />
                
                <div className="mt-4">อาการเสีย</div>
                <input type="textarea"
                value={problem} 
                onChange={(e) => setProblem(e.target.value)}
                className="form-control" />

                <button className="btn-primary mt-4" onClick={handleSave}>
                    <i className="fa-solid fa-check mr-3"></i>
                    บันทึก
                </button>
            </Modal>

            <Modal title="รับเครื่อง" isOpen={showModalReceive} onClose={() => closeModalReceive()} size="xl">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <div>ชื่อลูกค้า</div>
                        <input type="text" className="form-control"
                        value={recieveCustomerName} readOnly/>
                    </div>
                    <div className="w-1/2">
                        <div>ค่าบริการ</div>
                        <input type="number" className="form-control text-right"
                        value={recieveAmount} 
                        onChange={(e) => setRecieveAmount(Number(e.target.value))} />
                    </div>
                </div>
                <div className="mt-4">
                    <div>การแก้ไข</div>
                    <textarea rows={5} className="form-control" value={SolvingReceive ?? '-'} readOnly/>
                </div>
                <div className="mt-4">
                    <div>วันที่ชำระเงิน</div>
                    <input type="date" className="form-control" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
                </div>
                <button className="btn-primary mt-4" onClick={handleReceive}>
                    <i className="fa-solid fa-check mr-3"></i>
                    บันทึก
                </button>
            </Modal>
        </div>
    )
}