'use client'

import { useState } from "react"
import dayjs from "dayjs"

export default function Page() {
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));

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
                    <button className="btn-primary">
                        <i className="fa-solid fa-search mr-3"></i>
                        ค้นหา
                    </button>
                </div>
            </div>
        </div>
    )
}