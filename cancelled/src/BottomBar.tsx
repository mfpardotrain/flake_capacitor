import React, { useState } from "react";
import FindFriends from "./FindFriends.tsx";
import "./styles/bottombar.css";
import SettingsPage from "./Settings.tsx";
import PlansOptions from "./PlansOptions.tsx";

type BottombarItemType = {
    id: number,
    label: string,
    component: React.JSX.Element,
}

const BottomBar = () => {
    const bottombarItem = [
        { id: 1, label: 'Plans', component: <PlansOptions /> },
        { id: 2, label: 'Find Friends', component: <FindFriends /> },
        { id: 3, label: 'Settings', component: <SettingsPage /> },
    ];

    const [selectedItem, setSelectedItem] = useState(bottombarItem[0]);


    const handleItemClick = (item: BottombarItemType) => {
        setSelectedItem(item);
    };

    return (
        <div className="main-container">
            <div className="component-container">
                {selectedItem && selectedItem.component}
            </div>
            <div className="bottombar-container">
                {bottombarItem.map((item) => (
                    <div
                        className="bottombar-item"
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        style={{
                            cursor: 'pointer',
                            backgroundColor: selectedItem && selectedItem.id === item.id ? '#ccc' : 'inherit',
                        }}
                    >{item.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BottomBar;