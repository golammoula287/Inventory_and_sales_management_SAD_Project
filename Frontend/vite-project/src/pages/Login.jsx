

import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import TextInput from '../components/TextInput.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const validate = () => {
    const e = {}
    if (!email) e.email = 'ইমেইল দেওয়া আবশ্যক'
    if (!password) e.password = 'পাসওয়ার্ড দেওয়া আবশ্যক'
    return e
  }

  const onSubmit = async (evt) => {
    evt.preventDefault()
    setApiError('')
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return

    try {
      setSubmitting(true)
      await login(email, password)
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (err) {
      setApiError(err?.response?.data?.message || 'লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আপনার প্রমাণপত্র চেক করুন।')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-b from-green-500 via-green-400 to-green-300">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 space-y-6">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold text-green-600">লগইন করুন</h1>
          <p className="text-lg text-gray-600">ড্যাশবোর্ডে প্রবেশ করতে আপনার অ্যাকাউন্ট ব্যবহার করুন</p>
        </div>
        {apiError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {apiError}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-5">
          <TextInput
            label="ইমেইল"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="আপনার ইমেইল"
            autoComplete="email"
            required
            error={errors.email}
            className="rounded-lg border-gray-300 shadow-md"
          />
          <TextInput
            label="পাসওয়ার্ড"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            error={errors.password}
            className="rounded-lg border-gray-300 shadow-md"
          />
          <Button type="submit" disabled={submitting} className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white py-2">
            {submitting ? 'সাইন ইন হচ্ছে…' : 'সাইন ইন করুন'}
          </Button>
        </form>
        <div className="flex justify-center space-x-4 text-sm text-gray-500">
          
        </div>
      </div>
    </div>
  )
}
