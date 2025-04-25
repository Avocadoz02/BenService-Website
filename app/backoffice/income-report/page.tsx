'use client'

import { useEffect, useState } from "react"
import dayjs from "dayjs"
import config from "@/app/config";
import axios from "axios";

export default function Page() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [listIncome, setListIncome] = useState<any[]>([]);

    useEffect(() => {
        fetchAllIncome();
    }, []);

    const fetchAllIncome = async () => {
        const response = await axios.get(`${config.apiUrl}/api/income/report/list`);
        setListIncome(response.data);
        setStartDate('');
        setEndDate('');
    }

    const fetchSelectedIncome = async () => {
        const response = await axios.get(`${config.apiUrl}/api/income/report/${startDate}/${endDate}`);
        setListIncome(response.data);
    }

    return (
        <div className="card">
            <h1>รายงานรายได้</h1>
            <div className="card-body">
                <div className="flex gap-4 items-end">
                    <div className="flex gap-4 w-[400px]">
                        <div className="w-full">
                            <div>จากวันที่</div>
                            <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                        </div>
                        <div className="w-full">
                            <div>ถึงวันที่</div>
                            <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                        </div>
                    </div>
                    <button className="btn-primary" onClick={fetchSelectedIncome}>
                        <i className="fa-solid fa-search mr-3"></i>
                        ค้นหา
                    </button>
                    <button className="btn-primary bg-indigo-500! hover:bg-indigo-600!" onClick={fetchAllIncome}>
                        <i className="fa-solid fa-rotate-right mr-3"></i>
                        รีเซ็ท
                    </button>
                </div>

                <table className="table mt-5">
                    <thead>
                        <tr>
                            <th>ชื่อลูกค้า</th>
                            <th>เบอร์โทรศัพท์</th>
                            <th>อุปกรณ์</th>
                            <th>อาการ</th>
                            <th>วันที่แจ้งซ่อม</th>
                            <th>วันที่ชำระเงิน</th>
                            <th>จำนวนเงิน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listIncome.length > 0 && listIncome.map((item, index) => (
                            <tr key={index}>
                                <td>{item.customerName}</td>
                                <td>{item.customerPhone}</td>
                                <td>{item.deviceName}</td>
                                <td>{item.problem}</td>
                                <td>{dayjs(item.createdAt).format('DD/MM/YYYY')}</td>
                                <td>{dayjs(item.payDate).format('DD/MM/YYYY')}</td>
                                <td>{item.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}