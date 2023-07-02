'use client'

import { useState } from "react"

export default function TestPage() {
    const [isSearching, setIsSearching] = useState(false);

    const handleSearchFocus = () => {
        setIsSearching(true);
    }

    const handleSearchBlur = () => {
        setIsSearching(false);
    }

    const [isChatting, setIsChatting] = useState(false);
    const handleChatClick = () => {
        setIsChatting(true);
    }

    const [isViewConvo, setIsViewConvo] = useState(false);
    const handleViewConvoClick = () => {
        if(!isViewConvo) setIsViewConvo(true)
        else setIsViewConvo(false)
    }

    return (
        <>
            {/* <button className="md:hidden">
                Open
            </button> */}
            {!isChatting ? (
                <div className="flex h-full w-full">
                    <div className="flex flex-col flex-2 h-full w-full border-0 gap-4 p-4 sm:w-1/6 sm:h-full sm:border-2">
                        <div className="flex items-center justify-between">
                            <h1 className="md:block text-2xl font-bold tracking-tight text-gray-900"> Chats </h1>
                            <svg className="w-[34px] shrink-0 h-[34px] text-gray-800 rounded-lg bg-slate-200 p-2 md:block dark:text-white hover:bg-slate-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                                <path d="M7.324 9.917A2.479 2.479 0 0 1 7.99 7.7l.71-.71a2.484 2.484 0 0 1 2.222-.688 4.538 4.538 0 1 0-3.6 3.615h.002ZM7.99 18.3a2.5 2.5 0 0 1-.6-2.564A2.5 2.5 0 0 1 6 13.5v-1c.005-.544.19-1.072.526-1.5H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h7.687l-.697-.7ZM19.5 12h-1.12a4.441 4.441 0 0 0-.579-1.387l.8-.795a.5.5 0 0 0 0-.707l-.707-.707a.5.5 0 0 0-.707 0l-.795.8A4.443 4.443 0 0 0 15 8.62V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.12c-.492.113-.96.309-1.387.579l-.795-.795a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .707l.8.8c-.272.424-.47.891-.584 1.382H8.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.12c.113.492.309.96.579 1.387l-.795.795a.5.5 0 0 0 0 .707l.707.707a.5.5 0 0 0 .707 0l.8-.8c.424.272.892.47 1.382.584v1.12a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1.12c.492-.113.96-.309 1.387-.579l.795.8a.5.5 0 0 0 .707 0l.707-.707a.5.5 0 0 0 0-.707l-.8-.795c.273-.427.47-.898.584-1.392h1.12a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5ZM14 15.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
                            </svg>
                        </div>

                        <div className="flex items-center gap-2">
                            {isSearching && (
                                <svg className="w-[18px] h-[18px] text-gray-800 dark:text-white hover:bg-slate-200 hover:w-[36px] hover:h-[36px] hover:p-2 rounded-lg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                                </svg>
                            )}
                            <input type="text" 
                                className="rounded-lg text-gray-900 border-none bg-gray-200 w-full block focus:ring-0 " 
                                onFocus={handleSearchFocus}
                                onBlur={handleSearchBlur} 
                                placeholder="Search" />
                        </div>

                        <div className="overflow-auto flex flex-col gap-2">
                            <div className="overflow-x-hidden flex flex-col hover:bg-slate-100 hover:cursor-pointer hover:rounded-xs" onClick={handleChatClick} >
                                <h2 className="text-base font-bold mx-2 text-gray-900">Nami</h2>
                                <h3 className="text-sm font-bold mx-2 text-gray-400">nami@gmail.com</h3>
                            </div>
                            <div className="overflow-x-hidden flex flex-col hover:bg-slate-100 hover:cursor-pointer hover:rounded-xs "onClick={handleChatClick}>
                                <h2 className="text-base font-bold mx-2 text-gray-900">Nami</h2>
                                <h3 className="text-sm font-bold mx-2 text-gray-400">nami@gmail.com</h3>
                            </div>
                            <div className="overflow-x-hidden flex flex-col hover:bg-slate-100 hover:cursor-pointer hover:rounded-xs "onClick={handleChatClick}>
                                <h2 className="text-base font-bold mx-2 text-gray-900">Nami</h2>
                                <h3 className="text-sm font-bold mx-2 text-gray-400">nami@gmail.com</h3>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center w-0 h-0 md:w-full md:h-full">
                        <h1 className="hidden md:block text-2xl font-bold tracking-tight text-blue-500 rounded-lg bg-slate-100 py-1.5 px-3"> Start a conversation </h1>
                        {/* <div className="hidden border-y-2 w-full items-center justify-between md:flex">
                            <h1 className=" text-lg font-bold text-gray-900 m-3"> Nami </h1>
                            <svg className="hidden md:block w-[34px] h-[34px] text-gray-800 dark:text-white rounded-lg p-2 bg-slate-200 mx-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                            </svg>
                        </div>

                        <div className="w-full h-full overflow-auto flex flex-col">
                            <div className="w-full flex">
                                <div className="flex items-center text-white gap-2 p-3 ">
                                    <svg className="w-[32px] h-[32px] shrink-0 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                                    </svg>
                                    <p className="bg-blue-500 rounded-lg px-4 py-2 whitespace-pre-wrap">
                                        Lorem ipsum dolor sit amet, consectetur     adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        <br />
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </p>
                                </div>
                            </div>
                            <div className="w-full flex flex-row-reverse">
                                <div className="flex items-center text-white gap-2 p-3 ">
                                    <p className="bg-blue-500 rounded-lg px-4 py-2 whitespace-pre-wrap">
                                        Lorem ipsum dolor sit amet, consectetur     adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        <br />
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </p>
                                    <svg className="w-[32px] h-[32px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="hidden border-y-2 h-16 p-2 md:flex md:flex-row-reverse">
                            <button type="submit">  
                                <svg className="hidden md:block w-[38px] h-[38px] text-gray-800 dark:text-white rounded-lg p-2 bg-blue-200 mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                                    <path stroke="blue" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
                                </svg>
                            </button>
                            <input type="text"
                                className="hidden w-0 rounded-lg text-gray-900 border-none bg-gray-200 md:w-full md:block focus:ring-0 "  />
                        </div> */}
                    </div>
                </div>
            ) : (
                <div className="flex h-full w-full">
                    <div className="hidden sm:flex sm:flex-col sm:flex-2 h-0 w-0 border-0 gap-4 p-4  sm:w-1/6 sm:h-full sm:border-2">
                        <div className="flex items-center justify-between">
                            <h1 className="md:block text-2xl font-bold tracking-tight text-gray-900"> Chats </h1>
                            <svg className="w-[34px] shrink-0 h-[34px] text-gray-800 rounded-lg bg-slate-200 p-2 md:block dark:text-white hover:bg-slate-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                                <path d="M7.324 9.917A2.479 2.479 0 0 1 7.99 7.7l.71-.71a2.484 2.484 0 0 1 2.222-.688 4.538 4.538 0 1 0-3.6 3.615h.002ZM7.99 18.3a2.5 2.5 0 0 1-.6-2.564A2.5 2.5 0 0 1 6 13.5v-1c.005-.544.19-1.072.526-1.5H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h7.687l-.697-.7ZM19.5 12h-1.12a4.441 4.441 0 0 0-.579-1.387l.8-.795a.5.5 0 0 0 0-.707l-.707-.707a.5.5 0 0 0-.707 0l-.795.8A4.443 4.443 0 0 0 15 8.62V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.12c-.492.113-.96.309-1.387.579l-.795-.795a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .707l.8.8c-.272.424-.47.891-.584 1.382H8.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.12c.113.492.309.96.579 1.387l-.795.795a.5.5 0 0 0 0 .707l.707.707a.5.5 0 0 0 .707 0l.8-.8c.424.272.892.47 1.382.584v1.12a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1.12c.492-.113.96-.309 1.387-.579l.795.8a.5.5 0 0 0 .707 0l.707-.707a.5.5 0 0 0 0-.707l-.8-.795c.273-.427.47-.898.584-1.392h1.12a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5ZM14 15.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
                            </svg>
                        </div>

                        <div className="flex items-center gap-2">
                            {isSearching && (
                                <svg className="w-[18px] h-[18px] text-gray-800 dark:text-white hover:bg-slate-200 hover:w-[36px] hover:h-[36px] hover:p-2 rounded-lg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                                </svg>
                            )}
                            <input type="text" 
                                className="rounded-lg text-gray-900 border-none bg-gray-200 w-full block focus:ring-0 " 
                                onFocus={handleSearchFocus}
                                onBlur={handleSearchBlur} 
                                placeholder="Search" />
                        </div>

                        <div className="overflow-auto flex flex-col gap-2">
                            <div className="overflow-x-hidden flex flex-col hover:bg-slate-100 hover:cursor-pointer hover:rounded-xs" onClick={handleChatClick} >
                                <h2 className="text-base font-bold mx-2 text-gray-900">Nami</h2>
                                <h3 className="text-sm font-bold mx-2 text-gray-400">nami@gmail.com</h3>
                            </div>
                            <div className="overflow-x-hidden flex flex-col hover:bg-slate-100 hover:cursor-pointer hover:rounded-xs "onClick={handleChatClick}>
                                <h2 className="text-base font-bold mx-2 text-gray-900">Nami</h2>
                                <h3 className="text-sm font-bold mx-2 text-gray-400">nami@gmail.com</h3>
                            </div>
                            <div className="overflow-x-hidden flex flex-col hover:bg-slate-100 hover:cursor-pointer hover:rounded-xs "onClick={handleChatClick}>
                                <h2 className="text-base font-bold mx-2 text-gray-900">Nami</h2>
                                <h3 className="text-sm font-bold mx-2 text-gray-400">nami@gmail.com</h3>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-full h-full">
                        <div className="flex border-y-2 w-full items-center justify-between">
                            <div className="flex items-center mx-3">
                                <svg onClick={handleViewConvoClick} className="w-[34px] h-[34px] text-gray-800 dark:text-white sm:hidden rounded-lg p-2 bg-slate-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                                </svg>
                                <h1 className=" text-lg font-bold text-gray-900 m-3"> Nami </h1>
                            </div>
                            <svg className="sm:block w-[34px] h-[34px] text-gray-800 dark:text-white rounded-lg p-2 bg-slate-200 mx-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                            </svg>
                        </div>

                        <div className="w-full h-full overflow-auto flex flex-col">
                            <div className="w-full flex">
                                <div className="flex items-center text-white gap-2 p-3">
                                    <svg className="w-[32px] h-[32px] shrink-0 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                                    </svg>
                                    <p className="bg-blue-500 rounded-lg px-4 py-2 whitespace-pre-wrap">
                                        Lorem ipsum dolor sit amet, consectetur     adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        <br />
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </p>
                                </div>
                            </div>
                            <div className="w-full flex flex-row-reverse">
                                <div className="flex items-center text-white gap-2 p-3 ">
                                    <p className="bg-blue-500 rounded-lg px-4 py-2 whitespace-pre-wrap">
                                        Lorem ipsum dolor sit amet, consectetur     adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        <br />
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </p>
                                    <svg className="w-[32px] h-[32px] shrink-0 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row-reverse border-y-2 h-16 p-2">
                            <button type="submit">  
                                <svg className="block w-[38px] h-[38px] text-gray-800 dark:text-white rounded-lg p-2 bg-blue-200 mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                                    <path stroke="blue" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
                                </svg>
                            </button>
                            <input type="text"
                                className="rounded-lg text-gray-900 border-none bg-gray-200 w-full block focus:ring-0 "  />
                        </div>
                    </div>

                    {isViewConvo && (
                        <div className="absolute h-full sm:hidden">
                            <div className="flex flex-col flex-2 h-full w-full border-2 gap-4 p-4 md:w-1/6 md:h-full md:border-2 bg-white ">
                                <div className="flex items-center justify-between">
                                    <h1 className="md:block text-2xl font-bold tracking-tight text-gray-900"> Chats </h1>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-[34px] h-[34px] text-gray-800 rounded-lg bg-slate-200 p-2 md:block dark:text-white hover:bg-slate-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                                            <path d="M7.324 9.917A2.479 2.479 0 0 1 7.99 7.7l.71-.71a2.484 2.484 0 0 1 2.222-.688 4.538 4.538 0 1 0-3.6 3.615h.002ZM7.99 18.3a2.5 2.5 0 0 1-.6-2.564A2.5 2.5 0 0 1 6 13.5v-1c.005-.544.19-1.072.526-1.5H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h7.687l-.697-.7ZM19.5 12h-1.12a4.441 4.441 0 0 0-.579-1.387l.8-.795a.5.5 0 0 0 0-.707l-.707-.707a.5.5 0 0 0-.707 0l-.795.8A4.443 4.443 0 0 0 15 8.62V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.12c-.492.113-.96.309-1.387.579l-.795-.795a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .707l.8.8c-.272.424-.47.891-.584 1.382H8.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.12c.113.492.309.96.579 1.387l-.795.795a.5.5 0 0 0 0 .707l.707.707a.5.5 0 0 0 .707 0l.8-.8c.424.272.892.47 1.382.584v1.12a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1.12c.492-.113.96-.309 1.387-.579l.795.8a.5.5 0 0 0 .707 0l.707-.707a.5.5 0 0 0 0-.707l-.8-.795c.273-.427.47-.898.584-1.392h1.12a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5ZM14 15.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
                                        </svg>
                                        <svg onClick={handleViewConvoClick} className="w-[34px] h-[34px] bg-slate-200 p-2 rounded-lg text-gray-800 dark:text-white hover:bg-slate-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
                                            <path d="M8.766.566A2 2 0 0 0 6.586 1L1 6.586a2 2 0 0 0 0 2.828L6.586 15A2 2 0 0 0 10 13.586V2.414A2 2 0 0 0 8.766.566Z"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {isSearching && (
                                        <svg className="w-[18px] h-[18px] text-gray-800 dark:text-white hover:bg-slate-200 hover:w-[36px] hover:h-[36px] hover:p-2 rounded-lg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                                        </svg>
                                    )}
                                    <input type="text" 
                                        className="rounded-lg text-gray-900 border-none bg-gray-200 w-full block focus:ring-0 " 
                                        onFocus={handleSearchFocus}
                                        onBlur={handleSearchBlur} 
                                        placeholder="Search" />
                                </div>

                        <div className="overflow-auto flex flex-col gap-2">
                            <div className="overflow-x-hidden flex flex-col hover:bg-slate-100 hover:cursor-pointer hover:rounded-xs" onClick={handleChatClick} >
                                <h2 className="text-base font-bold mx-2 text-gray-900">Nami</h2>
                                <h3 className="text-sm font-bold mx-2 text-gray-400">nami@gmail.com</h3>
                            </div>
                            <div className="overflow-x-hidden flex flex-col hover:bg-slate-100 hover:cursor-pointer hover:rounded-xs "onClick={handleChatClick}>
                                <h2 className="text-base font-bold mx-2 text-gray-900">Nami</h2>
                                <h3 className="text-sm font-bold mx-2 text-gray-400">nami@gmail.com</h3>
                            </div>
                            <div className="overflow-x-hidden flex flex-col hover:bg-slate-100 hover:cursor-pointer hover:rounded-xs "onClick={handleChatClick}>
                                <h2 className="text-base font-bold mx-2 text-gray-900">Nami</h2>
                                <h3 className="text-sm font-bold mx-2 text-gray-400">nami@gmail.com</h3>
                            </div>
                        </div>
                    </div>
                        </div>
                    )}
                </div>
            )}
            
        </>
    )
}