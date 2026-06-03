import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function Passbook() {
    const { accountNumber } = useParams()
    const navigate = useNavigate()
    const [transactions, setTransactions] = useState([])
    const [account, setAccount] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(async () => {
        try {
            const [accRes, txRes] = await Promise.all([
                api.get(`/api/accounts/${accountNumber}`),
                api.get(`/api/accounts/${accountNumber}/transactions`)
            ])
            setAccount(accRes.data)
            setTransactions(txRes.data)
        } catch {
            toast.error('Failed to load transactions')
            navigate('/dashboard')
        } finally {
            setLoading(false)
        }
    }, [accountNumber, navigate])

    useEffect(() => {
        if (accountNumber) {
            fetchData()
        } else {
            navigate('/dashboard')
        }
    }, [accountNumber, fetchData, navigate])

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <>
            <Navbar />
            <main className="app-page">
                <div className="content-wrap">
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <button className="btn-soft" onClick={() => navigate('/dashboard')}>
                            Back
                        </button>
                        <div className="page-title mb-0">
                            <h1>Passbook</h1>
                            <p>{accountNumber}</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" />
                        </div>
                    ) : (
                        <>
                            {account && (
                                <section className="hero-panel mb-4">
                                    <div className="d-flex align-items-center justify-content-between gap-3">
                                        <div>
                                            <p className="mb-1">Account number</p>
                                            <h3 className="fw-bold mb-0">{account.accountNumber}</h3>
                                        </div>
                                        <div className="balance-box">
                                            <span>Balance</span>
                                            <strong>Rs {account.balance.toFixed(2)}</strong>
                                        </div>
                                    </div>
                                </section>
                            )}

                            <section className="table-shell">
                                <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                                    <div>
                                        <h4 className="fw-bold mb-1">Transaction History</h4>
                                        <p className="muted-text mb-0 small">
                                            {transactions.length} transaction records
                                        </p>
                                    </div>
                                </div>

                                {transactions.length === 0 ? (
                                    <div className="text-center py-5">
                                        <h5 className="fw-bold">No transactions yet</h5>
                                        <p className="muted-text mb-0">Deposits and withdrawals will appear here.</p>
                                    </div>
                                ) : (
                                    <div>
                                        {transactions.map((tx, i) => (
                                            <div key={tx.id || i} className="transaction-row">
                                                <div className="d-flex align-items-center gap-3">
                                                    <span className={`card-symbol ${tx.type === 'DEPOSIT' ? '' : 'bg-danger-subtle text-danger'}`}>
                                                        {tx.type === 'DEPOSIT' ? 'IN' : 'OUT'}
                                                    </span>
                                                    <div>
                                                        <p className="fw-bold mb-1">{tx.type}</p>
                                                        <p className="muted-text small mb-0">{formatDate(tx.createdAt)}</p>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <p className={`fw-bold mb-1 ${tx.type === 'DEPOSIT' ? 'text-success' : 'text-danger'}`}>
                                                        {tx.type === 'DEPOSIT' ? '+' : '-'} Rs {tx.amount.toFixed(2)}
                                                    </p>
                                                    <p className="muted-text small mb-0">
                                                        Balance: Rs {tx.balanceAfter.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </div>
            </main>
        </>
    )
}
