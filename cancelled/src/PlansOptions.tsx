import React, { useState } from "react";
import MakePlans from "./MakePlans.tsx";
import "./styles/planOptions.css";
import CurrentPlans from "./CurrentPlans.tsx";

const PlansOptions = () => {
    const [activeComponent, setActiveComponent] = useState(null);

    const renderComponent = (component) => {
        setActiveComponent(component);
    };

    const goBack = () => {
        setActiveComponent(null);
    };


    return (
        <>
            {activeComponent === null ? (
                <div className="plan-option-container">
                    <button className="plan-option-button" onClick={() => renderComponent(<CurrentPlans />)}>Current Plans</button>
                    <button className="plan-option-button" onClick={() => renderComponent(<MakePlans setActiveComponent={(item) => setActiveComponent(item)} />)}>Make Plan</button>
                </div>
            ) : (
                <div className="plan-option-active-container">
                    <button className="plan-back-button" onClick={goBack}>Back</button>
                    {activeComponent}
                </div>
            )}
        </>
    );
};

export default PlansOptions;