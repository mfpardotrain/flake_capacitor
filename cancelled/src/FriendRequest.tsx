import React, { useContext, useState } from 'react'
import { useMutation, useQuery, } from 'react-query'
import PocketBase from "pocketbase";
import "./styles/friends.css";
import { StatusContext } from './App.tsx';
import { ENV } from './env/env'

const pb = new PocketBase(ENV.REACT_APP_FLAKE_API_URL);

type FriendRequestProps = {
    friendId: string,
    userId: string,
}

function FriendRequest({ friendId, userId }: FriendRequestProps) {
    const statuses = useContext(StatusContext);
    const [currentStatus, setCurrentStatus] = useState("");
    const [friendshipId, setFriendshipId] = useState("");
    const [requesterId, setRequesterId] = useState("");

    const currentStatusQuery = useQuery([friendId, userId], {
        queryFn: () => {
            return pb.collection("friendshipStatus").getList(1, 1,
                {
                    requestKey: null,
                    sort: '-created',
                    filter: pb.filter("(requesterId = {:userId} && addresseeId = {:friendId}) || (requesterId = {:friendId} && addresseeId = {:userId})",
                        { userId: userId, friendId: friendId }),
                }
            )
        },
        onSuccess(data) {
            if (data.totalItems > 0) {
                setFriendshipId(data.items[0].friendship)
                setRequesterId(data.items[0].requesterId)
                setCurrentStatus(data.items[0].statusCode)
            }
        },
    });

    const createFriendMutation =
        useMutation((_: string) => {
            return pb.collection("friendship")
                .create({
                    requesterId: userId,
                    addresseeId: friendId
                })
        },
        );

    type CreateFriendArgs = {
        friendshipId: string,
        statusCode: string,
    };

    const createFriendshipStatusMutation =
        useMutation({
            mutationFn: ({ friendshipId, statusCode }: CreateFriendArgs) => {
                return pb.collection("friendshipStatus")
                    .create({
                        friendship: friendshipId,
                        specifierId: userId,
                        statusCode: statusCode,
                        requesterId: userId,
                        addresseeId: friendId
                    })
            },
            onSuccess(data, variables, context) {
                currentStatusQuery.refetch()
            },
        }
        );

    const requestInitialFriendship = (status: string) => {
        createFriendMutation.mutateAsync("", {
            onSuccess(data, variables, context) {
                let friendshipId = data.id;
                let statusCode = statuses[status];
                setFriendshipId(friendshipId);
                setRequesterId(data.requesterId)

                createFriendshipStatusMutation.mutate({ friendshipId, statusCode })
            },
        });
    };

    const acceptedButton = (
        <button
            className='unfriend-button'
            onClick={() => createFriendshipStatusMutation.mutate({ friendshipId, statusCode: statuses["Unfriended"] })}
        >Unfriend
        </button>
    )

    const friendRequested = (
        requesterId === userId ? (
            <div>
                Friend requested
            </div>
        ) : (
            <div className='accept-deny-container'>
                <button
                    className='accept-request-button'
                    onClick={() => createFriendshipStatusMutation.mutate({ friendshipId, statusCode: statuses["Accepted"] })}
                >Accept request?
                </button>
                <button
                    className='deny-request-button'
                    onClick={() => createFriendshipStatusMutation.mutate({ friendshipId, statusCode: statuses["Declined"] })}
                >Decline request?
                </button>
            </div>
        )
    )

    const friendDeclined = (
        <div>
            Friend request declined
            <button
                className='refriend-request-button'
                onClick={() => createFriendshipStatusMutation.mutate({ friendshipId, statusCode: statuses["Requested"] })}
            >Request again?
            </button>
        </div>
    )

    const blockedRequest = (
        requesterId === userId ? (
            <button
                className='unblock-request-button'
                onClick={() => createFriendshipStatusMutation.mutate({ friendshipId, statusCode: statuses["Unblocked"] })}
            >Unblock?
            </button>
        ) : (
            <div>You are blocked</div>
        )
    )

    const defaultRequest = (
        <div className='default-request-container'>
            <button
                className="request-button"
                onClick={() => requestInitialFriendship("Requested")}
            >Add Friend
            </button>
            <button
                className="block-request-button"
                onClick={() => {
                    if (friendshipId !== "") {
                        createFriendshipStatusMutation.mutate({ friendshipId, statusCode: statuses["Blocked"] })
                    } else {
                        requestInitialFriendship("Blocked")
                    }
                }
                }
            >Block?
            </button>
        </div>
    )

    const currentFriendStatus = (statusCode: string) => {
        let humanStatus = statuses[statusCode]
        switch (humanStatus) {
            case ("Accepted"):
                return acceptedButton
            case ("Blocked"):
                return blockedRequest
            case ("Requested"):
                return friendRequested
            case ("Declined"):
                return friendDeclined
            default:
                return defaultRequest
        }
    }

    return (
        <div className='friend-status-container'>
            {currentFriendStatus(currentStatus)}
        </div>

    )
};

export default FriendRequest;