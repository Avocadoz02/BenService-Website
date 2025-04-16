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

    useEffect(() => {
        fetchDevices();
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
            expireDate: expireDate == '' ? undefined : expireDate,
            problem: problem,
            solving: solving
        }

        try {
            await axios.post(`${config.apiUrl}/api/repairRecord/create`, payload);
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูล',
                text: 'บันึกข้อมูลเรียบร้อย',
                timer: 2000
            });

            closeModal();
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }

    return (
        <div className="card">
            <h1>บันทึกการซ่อม</h1>
            <div className="card-body">
                <button className="btn btn-primary" onClick={openModal}>
                    <i className="fa-solid fa-plus mr-2"></i>
                        เพิ่มข้อมูลการซ่อม
                </button>
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
        </div>
    )
}