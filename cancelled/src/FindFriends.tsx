import React, { useState } from 'react'
import { useQuery, } from 'react-query'
import PocketBase from "pocketbase";
import "./styles/friends.css";
import FriendRequest from './FriendRequest.tsx';
import { ENV } from './env/env'

const pb = new PocketBase(ENV.REACT_APP_FLAKE_API_URL);

function FindFriends() {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [userId, setUserId] = useState("");

    useQuery({
        queryKey: ['selfData'],
        queryFn: () => pb.authStore.model,
        onSuccess(data) {
            if (data) {
                setUserId(data.id)
            }
        },
    })

    const { isLoading, error, data, isFetching, refetch } = useQuery([page], {
        queryFn: () => {
            return pb.collection("users").getList(page, 7, {
                filter: pb.filter(
                    "id ~ {:search} || name ~ {:search} || username ~ {:search} || email ~ {:search}",
                    { search: searchTerm }
                )
            })
        },
    })

    if (isLoading) return 'Loading...'

    if (error && error instanceof Error) return 'An error has occurred: ' + error.message


    const records = () => {
        if (data && data.totalItems > 0) {
            return data.items.map((record) =>
            (
                <div className='friend-record' key={record.username}>
                    {record.username}
                    <FriendRequest key="record.id" friendId={record.id} userId={userId} />
                </div>
            )
            )
        } else {
            return <div>No Records</div>
        }
    }

    const pageSelectors = () => {
        if (data && data.page) {
            return (
                <div className='page-select-container'>
                    <div onClick={() => setPage(page - 1)} className='page-chevron-left'></div>
                    {data.page > 1 && <div onClick={() => setPage(page - 1)} className='page-number'>{data.page - 1}</div>}
                    <div className='page-number'>{data.page}</div>
                    {data.totalPages > data.page && <div onClick={() => setPage(page + 1)} className='page-number'>{data.page + 1}</div>}
                    {data.totalPages > data.page && <div onClick={() => setPage(page + 1)} className='page-chevron-right'></div>}
                </div>
            )
        }
    }

    return (
        <div onSubmit={(e) => e.preventDefault()} className='find-friends-container'>
            <div className='searchbar-container'>
                <input
                    className='searchbar'
                    placeholder='Search'
                    type="text"
                    name="searchTerm"
                    id="searchTerm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => {
                    if (page !== 1) {
                        setPage(1)
                    } else { refetch() }
                }}>Submit</button>
            </div>
            {records()}
            {pageSelectors()}
            {isFetching && <div>'Searching...'</div>}
        </div >

    )
};

export default FindFriends;