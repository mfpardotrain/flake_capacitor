import React, { useContext, useState } from 'react'
import { useMutation, useQuery, } from 'react-query'
import PocketBase from "pocketbase";
import "./styles/plans.css";
import { StatusContext } from './App.tsx';

const pb = new PocketBase(process.env.REACT_APP_FLAKE_API_URL);

type PlanType = {
    description: string,
    when: string,
    name: string,
    planId: string,
    planStatusId: string,
    planStatusStatus: string,
    friends: string[],
    planStatus: string,

}

function CurrentPlans() {
    const statuses = useContext(StatusContext);
    const [currentPlans, setCurrentPlans] = useState<PlanType[]>([]);
    const [userId, setUserId] = useState("");

    // User query
    useQuery({
        queryKey: ['selfData'],
        queryFn: () => pb.authStore.model,
        onSuccess(data) {
            if (data) {
                setUserId(data.id)
                currentPlansQuery.refetch()
            }
        },
    })

    const currentPlansQuery = useQuery([userId], {
        queryFn: () => {
            return pb.collection('planStatus').getFullList({
                filter: `addresseeId = "${userId}" && @now <= planId.when && (statusCode = "${statuses["Accepted"]}" || statusCode = "${statuses["Requested"]}" || statusCode = "${statuses["Cancelled"]}")`,
                sort: 'created',
                requestKey: null,
                expand: "planId,planId.addresseeId",
            })
        },
        onSuccess(data) {
            let plans = data.flatMap((item): PlanType | [] => {
                if (item.expand) {
                    let planId = item.expand.planId
                    return {
                        name: planId.name,
                        planId: planId.id,
                        planStatusId: item.id,
                        planStatusStatus: item.statusCode,
                        when: planId.when,
                        description: planId.description,
                        friends: planId.expand.addresseeId.map(el => el.name),
                        planStatus: planId.planStatus,
                    };
                }
                return [];
            });
            if (plans) {
                setCurrentPlans(plans)
            }
        },

    })

    type UpdatePlanStatusArgs = {
        planStatusId: string,
        statusCode: string
    }

    const updatePlanStatusMutation = useMutation({
        mutationFn: ({ planStatusId, statusCode }: UpdatePlanStatusArgs) => {
            return pb.collection("planStatus")
                .update(planStatusId, {
                    statusCode: statuses[statusCode]
                })
        },
        onSuccess(data, variables, context) {
            currentPlansQuery.refetch()
        },
    });

    const acceptRejectButton = ({ planStatusId, statusCode }: UpdatePlanStatusArgs) => {
        if (statusCode === "Cancelled") {
            return <button onClick={() => updatePlanStatusMutation.mutate({ planStatusId, statusCode: "Accepted" })}>Uncancel</button>
        } else if (statusCode === "Accepted") {
            return <button onClick={() => updatePlanStatusMutation.mutate({ planStatusId, statusCode: "Cancelled" })}>Cancel</button>
        } else {
            return (
                <>
                    <button onClick={() => updatePlanStatusMutation.mutate({ planStatusId, statusCode: "Accepted" })}>Accept?</button>
                    <button onClick={() => updatePlanStatusMutation.mutate({ planStatusId, statusCode: "Cancelled" })}>Cancel</button>
                </>
            )
        };
    };

    const plans = () => {
        return currentPlans.map(plan => {
            if (statuses[plan.planStatus] === "Cancelled") {
                return (
                    <div key={plan.planId} className="current-plan-item-container unclickable everyone-cancelled">
                        <div className='current-plan-descriptor-container'>
                            <div>{plan.name}</div>
                            <div>{plan.description}</div>
                            <div>{plan.when}</div>
                            <div>{statuses[plan.planStatusStatus]}</div>
                        </div>
                        <div>
                            You all flaked!
                        </div>
                    </div>
                )
            } else {
                return (
                    <div key={plan.planId} className='current-plan-item-container'>
                        <div className='current-plan-descriptor-container'>
                            <div>{plan.name}</div>
                            <div>{plan.description}</div>
                            <div>{plan.when}</div>
                            <div>{statuses[plan.planStatusStatus]}</div>
                        </div>
                        <div className='accept-reject-button-container'>
                            {acceptRejectButton({ planStatusId: plan.planStatusId, statusCode: statuses[plan.planStatusStatus] })}
                        </div>
                    </div>
                )
            }
        })
    }

    return (
        <div className='make-plans-query'>
            {plans()}
        </div>
    )
};

export default CurrentPlans;