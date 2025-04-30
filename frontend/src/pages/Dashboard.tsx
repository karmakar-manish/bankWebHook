import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"

type TransactionType = {
    id: number,
    amount: number,
    provider: string,
    startTime: string,
    status: string,
    token: string,
    userId: number
}

export default function Dashboard(){
    const [onRampData, setOnRampData] = useState<TransactionType[]>([])
    const [showModal, setShowModal] = useState(false)
    const [selectedToken, setSelectedToken] = useState<string | null>(null)
    const [selectedAmount, setSelectedAmount] = useState(0)
    const [selectedUserId, setSelecteduserId] = useState(0)

    //fetch all the processing onRampData from backend
    useEffect(()=>{
        axios.post("https://bankwebhook-2.onrender.com/api/v1/getOnRampTxns")
        .then(response => {
            setOnRampData(response.data.data)
        })
    }, [])
    

    return <div className="p-5">
        <div className="rounded-lg flex flex-col justify-center text-center p-5 bg-[#d8e8ec]">
            <div className="font-bold text-3xl font-serif text-slate-700">
                Pending Transactions
            </div>
            <div className="font-medium text-md text-slate-600">
                Review the status of recent bank transactions
            </div>
        </div>
        <div className="grid grid-cols-6 p-4 rounded-lg mt-10 mb-4 bg-[#a0ddec] font-semibold text-blue-950">
            {/* <div>Transaction ID</div> */}
            <div>Date</div>
            <div>Token</div>
            <div className="ml-4">Provider</div>
            <div>Amount</div>
            <div>UserId</div>
            <div>Status</div>
        </div>
        <div className="overflow-x-auto h-screen">
            {onRampData.map((t,ind)=>(<DashboardComponent key={ind} data={t} onClickStatus = {()=>{
                setShowModal(true)
                setSelectedToken(t.token);
                setSelectedAmount(t.amount)
                setSelecteduserId(t.userId)
            }}/>))}

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-xs z-50">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
                    <h2 className="text-lg font-semibold mb-4 text-center text-slate-800">
                        Mark the selected transaction as completed?
                    </h2>
                    <div className="flex justify-center gap-5 font-bold">
                        <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                        >Cancel</button>

                        <button
                        onClick={async () => {
                            setShowModal(false);    //state variable
                            try {
                                await axios.post("https://bankwebhook-2.onrender.com/api/v1/bankWebHook/webHook", {
                                    token: selectedToken,
                                    userId: selectedUserId,
                                    amount: selectedAmount
                                });
                                // refresh data
                                axios.post("https://bankwebhook-2.onrender.com/api/v1/getOnRampTxns")
                                .then(response => {
                                    setOnRampData(response.data.data)
                                })
                            } catch (err) {
                            console.error("Failed to complete txn", err);
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                        >
                        Confirm
                        </button>
                    </div>
                    </div>
                </div>
                )}

        </div>
    </div>
}


function DashboardComponent({data, onClickStatus}: {
    data:{
        id: number,
        amount: number,
        provider: string,
        startTime: string,
        status: string,
        token: string,
        userId: number
    }, 
    onClickStatus: ()=> void
}){
    return <div>
        <div className="grid grid-cols-6 p-4 text-sm font-light border-b border-slate-200">
            <div className="flex flex-col justify-center">
                <div>{new Date(data.startTime).toDateString()}</div>
                <div>{new Date(data.startTime).toLocaleTimeString("en-IN")}</div>
            </div>
            <div>{data.token}</div>
            <div className="ml-4">{data.provider}</div>
            <div>₹ {(data.amount/100).toLocaleString("en-IN")}</div>
            <div>{data.userId}</div>
            <div>
                <div className="text-[#d12b2b] cursor-pointer bg-[#eed0d0] font-bold text rounded-md w-20 p-1 text-center" onClick={onClickStatus}>Pending</div>
            </div>
        </div>
    </div>
}
