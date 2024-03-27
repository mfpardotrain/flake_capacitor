import React, { useEffect, useState } from 'react';
import "./styles/selectFriends.css";

type Items = { name: string, id: string }[]
type SelectFriendsProps = {
    items: Items,
    setSelectedFriends: (selectedFriends: Items) => void;
}

const SelectFriends = ({ items, setSelectedFriends }: SelectFriendsProps) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleCheckboxToggle = (id) => {
        setSelectedItems((prevSelectedItems: string[]) => {
            if (prevSelectedItems.includes(id)) {
                return prevSelectedItems.filter(itemId => itemId !== id);
            } else {
                return [...prevSelectedItems, id];
            }
        });
    };

    useEffect(() => {
        let filteredFriends = items.filter((item => selectedItems.includes(item.id)))
        setSelectedFriends(filteredFriends)
    }, [selectedItems, items, setSelectedFriends])

    return (
        <div className='select-friends-container'>
            <h4>Friends</h4>
            <div className='select-friends-items-container'>
                {items.map(({ name, id }) => (
                    <div key={id} className='select-friends-item'>
                        <input
                            type="checkbox"
                            className='select-friends-item-checkbox'
                            id={id}
                            checked={selectedItems.includes(id)}
                            onChange={() => handleCheckboxToggle(id)}
                        />
                        <label htmlFor={id} className='select-friends-item-label'>{name}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SelectFriends;
