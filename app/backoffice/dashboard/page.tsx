'use client';

import { useState, useEffect, useRef } from 'react';
import config from '@/app/config';
import axios from 'axios';
import Swal from 'sweetalert2';
import Chart from 'apexcharts';
import dayjs from 'dayjs';

export default function Page() {
    const [totalRepairRecord, setTotalRepairRecord] = useState(0);
    const [totalRepairRecordRepairing, setTotalRepairRecordRepairing] = useState(0);
    const [totalRepairRecordComplete, setTotalRepairRecordComplete] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [listYear, setListYear] = useState<number[]>([]);
    const [listMonth, setListMonth] = useState([
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedChartIncomePerMonth, setSelectedChartIncomePerMonth] = useState(new Date().getFullYear());
    const [listIncomePerMonth, setListIncomePerMonth] = useState<number[]>([]);

    
    const didFetch = useRef(false);
      
    useEffect(() => {
        if (didFetch.current) return; // ถ้า fetch แล้ว ไม่ต้องทำอีก
        didFetch.current = true;

        //year 5 years ago to now
        const currentYear = dayjs().year();
        const currentMonth = dayjs().month();
        const listYear = Array.from({ length: 5 }, (_, i) => currentYear - i);
        setListYear(listYear);
        setSelectedYear(currentYear);
        setSelectedMonth(currentMonth);
        setSelectedChartIncomePerMonth(currentYear);

        fetchData();

        fetchDataChartIncomePerMonth(); // fetch พร้อม render chart      
    }, []);

    const fetchData = async () => {
        const params = {
            year: selectedYear,
            month: selectedMonth + 1
        }
        const response = await axios.get(`${config.apiUrl}/api/repairRecord/dashboard`, {
            params: params
        });

        setTotalRepairRecord(response.data.totalRepairRecord);
        setTotalRepairRecordRepairing(response.data.totalRepairRecordRepairing);
        setTotalRepairRecordComplete(response.data.totalRepairRecordComplete);
        setTotalAmount(response.data.totalAmount);

        let listIncomePerDay = [];
        for (let i = 0; i < response.data.listIncomePerDay.length; i++) {
            listIncomePerDay.push(response.data.listIncomePerDay[i].amount);
        }
        
        renderChartIncomePerDays(listIncomePerDay);
        renderChartTotalRepairRecord(
            response.data.totalRepairRecordComplete,
            response.data.totalRepairRecordRepairing,
            response.data.totalRepairRecord
        );
    };


    const renderChartIncomePerDays = ( data: number[] ) => {
        const options = {
            chart: { type: 'bar', height: 320, background: 'white' },
            series: [{ data: data }],
            xaxis: {
                categories: Array.from({ length: data.length }, (_, i) => `${i + 1}`)
            },
            fill: {
                colors: ['#E91E63']
            }
        };
        const chartIncomePerDays = document.getElementById('chartIncomePerDays');
        const chart = new Chart(chartIncomePerDays, options);
        chart.render();
    };

    const renderChartIncomePerMonth = ( data: number[] ) => {
        // const data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10000));
        const options = {
            chart: { type: 'bar', height: 320, background: 'white' },
            series: [{ data: data }],
            xaxis: {
                categories: [
                    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
                ]
            },
        };
        const chartIncomePerMonth = document.getElementById('chartIncomePerMonth');
        const chart = new Chart(chartIncomePerMonth, options);
        chart.render();
    };

    const renderChartTotalRepairRecord = (
        totalRepairRecordComplete: number,
        totalRepairRecordRepairing: number,
        totalRepairRecord: number
    ) => {
        const data = [totalRepairRecordComplete, totalRepairRecordRepairing, totalRepairRecord];
        const options = {
            chart: { 
                type: 'pie', 
                height: 317, 
                background: 'white' },
            series: data,
            labels: ['งานซ่อมเสร็จ', 'งานกำลังซ่อม', 'งานทั้งหมด'],
            fill: {
                colors: ['#ff6467', '#fcc800', '#7ccf00']
            }
        };
        const chartPie = document.getElementById('chartPie');
        const chart = new Chart(chartPie, options);
        chart.render();
    };

    const fetchDataChartIncomePerMonth = async () => {
        try {
            const params = {
                year: selectedChartIncomePerMonth
            }
            const response = await axios.get(`${config.apiUrl}/api/repairRecord/incomePerMonth`, {
                params: params
            });

            let listIncomePerMonth = [];
            for (let i = 0; i < response.data.length; i++) {
                listIncomePerMonth.push(response.data[i].amount);
            }

            renderChartIncomePerMonth(listIncomePerMonth);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'ดึงข้อมูลล้มเหลว',
                text: error.message
            });
        }
    }

    return (
        <div className="card">
            <div className="text-2xl font-bold">Dashboard</div>
            <div className="flex mt-5 gap-4">
                <div className="w-1/4 bg-indigo-500 p-4 rounded-lg text-right">
                    <div className="text-xl font-bold">งานซ่อมทั้งหมด</div>
                    <div className="text-4xl font-bold">{totalRepairRecord}</div>
                </div>
                <div className="w-1/4 bg-red-400 p-4 rounded-lg text-right">
                    <div className="text-xl font-bold">งานซ่อมเสร็จ</div>
                    <div className="text-4xl font-bold">{totalRepairRecordComplete}</div>
                </div>
                <div className="w-1/4 bg-yellow-500 p-4 rounded-lg text-right">
                    <div className="text-xl font-bold">งานกำลังซ่อม</div>
                    <div className="text-4xl font-bold">{totalRepairRecordRepairing}</div>
                </div>
                <div className="w-1/4 bg-lime-500 p-4 rounded-lg text-right">
                    <div className="text-xl font-bold">รายได้ทั้งหมด</div>
                    <div className="text-4xl font-bold">{totalAmount.toLocaleString()}</div>
                </div>
            </div>

            <div className="text-2xl font-bold mt-5 mb-2">รายได้รายวัน</div>
            <div className="flex items-end gap-4 mb-3 mt-2">
                <div className="min-w-[150px]">
                    <div>ปี</div>
                    <select className='form-control' onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                        {listYear.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="min-w-[150px]">
                    <div>เดือน</div>
                    <select className='form-control' value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                        {listMonth.map((month, index) => (
                            <option key={index} value={index}>{month}</option>
                        ))}
                    </select>
                </div>
                <button className="btn-primary" onClick={fetchData}>
                    <i className='fa-solid fa-magnifying-glass mr-2'></i>
                    แสดงข้อมูล
                </button>
            </div>
            <div id="chartIncomePerDays" className="text-gray-800 rounded-lg overflow-hidden"></div>

            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <div className="text-2xl font-bold mt-5 mb-2">รายได้รายเดือน</div>
                    <div className="flex items-center gap-4 mb-3 mt-2">
                        <div className="flex items-center gap-4 min-w-[150px]">
                            <div>ปี</div>
                            <select className='form-control mt-0!' onChange={(e) => setSelectedChartIncomePerMonth(parseInt(e.target.value))}>
                                {listYear.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <button className="btn-primary mt-0!" onClick={fetchDataChartIncomePerMonth}>
                            <i className='fa-solid fa-magnifying-glass mr-2'></i>
                            แสดงข้อมูล
                        </button>
                    </div>
                </div>
                
                <div className="text-2xl font-bold mt-5 mb-2">งานทั้งหมด</div>
                
                <div id="chartIncomePerMonth" className="text-gray-800 rounded-lg overflow-hidden col-span-2"></div>
                
                <div id="chartPie" className='rounded-t-lg overflow-hidden'></div>
            </div>
        </div>
    );
}