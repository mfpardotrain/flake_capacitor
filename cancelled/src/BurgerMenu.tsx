import React, { useState } from 'react';
import './styles/burgerMenu.css';
import PlansOptions from './PlansOptions.tsx';
import FindFriends from './FindFriends.tsx';
import SettingsPage from './Settings.tsx';
import LoggedIn from './LoggedIn.tsx';

const BurgerMenu = ({ setLoggedIn, }: { setLoggedIn: (loggedIn: boolean) => void; }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(<PlansOptions />);

    const options = [
        { label: "Plans", component: <PlansOptions /> },
        { label: "Friends", component: <FindFriends /> },
        { label: "Settings", component: <SettingsPage /> },
    ]

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (component) => {
        setSelectedComponent(component);
        setIsOpen(false);
    };

    return (
        <div className='main-container'>
            <button className="burger-menu-button" onClick={toggleMenu}>
                {isOpen ? '✕' : '☰'}
            </button>
            <div className={`burger-menu-container ${isOpen ? 'open' : ''}`}>
                <div className="burger-menu-options">
                    {options.map((option, index) => (
                        <div key={index} className="burger-menu-option" onClick={() => handleOptionClick(option.component)}>
                            {option.label}
                        </div>
                    ))}
                </div>
                <LoggedIn setLoggedIn={setLoggedIn} key={"logged-in"} />
            </div>
            <div className="selected-component-container">
                {selectedComponent && selectedComponent}
            </div>
        </div>
    );
};

export default BurgerMenu;
