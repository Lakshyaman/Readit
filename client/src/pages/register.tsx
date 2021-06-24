import { FormEvent, useState } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import Axios from 'axios';
import classNames from 'classnames'
import InputGroup from '../components/inputGroup'

export default function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [agreement, setAgreement] = useState(false)
  const [errors, setErrors] = useState<any>({})

  const submitForm = async(event: FormEvent) => {
    event.preventDefault();

    try{
      const res = await Axios.post('/auth/register', {
        email, username, password
      })
      console.log(res.data)
    }catch(error){
      console.log(error)
      setErrors(error.response.data);
    }
  }

  return (
    <div className="flex">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>

      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
        </div>
        <form onSubmit={submitForm}>
          <div className="mb-6">
            <input
              type="checkbox"
              className="mr-1 cursor-pointer"
              id="agreement"
              checked={agreement}
              onChange={(e) => setAgreement(e.target.checked)}
            />
            <label htmlFor="agreement" className="text-xs cursor-pointer">
              I agree to get emails about cool stuff on Readit
            </label>
          </div>
          <InputGroup
            className="mb-2"
            value={email}
            setValue={setEmail}
            placeholder="EMAIL"
            error={errors.email}
            type="email"
          />
          <InputGroup
            className="mb-2"
            value={username}
            setValue={setUsername}
            placeholder="USERNAME"
            error={errors.username}
            type="text"
          />
          <InputGroup
            className="mb-4"
            value={password}
            setValue={setPassword}
            placeholder="PASSWORD"
            error={errors.password}
            type="password"
          />
          <button className="w-full px-3 py-2 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
            Sign Up
          </button>
        </form>
        <small>
          Already a Readitor?
          <Link href="/login">
            <a className="ml-1 text-blue-500 uppercase">Log In</a>
          </Link>
        </small>
      </div>
    </div>
  );
}
