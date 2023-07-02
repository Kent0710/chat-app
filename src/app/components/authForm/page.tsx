'use client'

import { useState } from "react"
import React from "react"
import { useRouter } from "next/navigation";

// component
function AuthFormComponent(props : any) {
    const apiPath = props.apiPath;

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isAuthClicked, setIsAuthClicked] = useState(false);

    const router = useRouter();

    const apiMethod = async (e : React.SyntheticEvent, apiPath : string) => {
        e.preventDefault();
        setIsAuthClicked(true);
        try {
            const userType = "user";
            const response = await fetch (apiPath, {
                method : "POST",
                headers : {"Content-Type" : "appication/json"},
                body : JSON.stringify({email, name, userType})
            });
            const data = await response.json();
            if (data.message === "register user") router.push("/dashboard")
        } catch (err) {
            console.error(err);
        }
    }

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        apiMethod(e, 'api/register')
    }

    return (
        <>
            {!isAuthClicked ? (
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            {props.title}  
                        </h2>    
                    </div>    

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 px-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 " />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Username
                                </label>
                                <div className="mt-2">
                                    <input type="name"
                                        id="name"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoComplete="name"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 px-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 " />
                                </div>
                            </div>

                            <div>
                                <button type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    {props.mainFunc}
                                </button>
                            </div>
                        </form>
                        <p className="mt-5 text-center text-sm text-gray-500">
                          {props.altMsg}
                          <button onClick={props.handleAltFunc} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1">
                            {props.altFunc}
                          </button>
                         </p>
                    </div>
                </div>        
            ) : (
                <div className="flex items-center justify-center h-full w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
        </>
    )
}

// main page to rendered
export default function AuthFormPage() {
    const [isNew, setIsNew] = useState(false);

    const handleAltFunc = () => {
        if (!isNew) setIsNew(true);
        else setIsNew(false)
    }

    return (
        <>
            {!isNew ? (
                <AuthFormComponent apiPath="api/register" title="Create your account" mainFunc="Sign up" altMsg="Already have an account?" altFunc="Sign in" handleAltFunc={handleAltFunc} />
            ) : (
                <AuthFormComponent apiPath="api/signIn" title="Log into your account" mainFunc="Sign in" altMsg="Doesn't have an account yet?" altFunc="Sign up" handleAltFunc={handleAltFunc}/>
            )}
        </>
    )
}
