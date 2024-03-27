import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar';
import './styles/calendar.css';
import './styles/selectDatetime.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function SelectDateTime({ setWhen }: { setWhen: (when: string) => void; }) {
    const [selectedDate, setSelectedDate] = useState<Value>(new Date());
    const [selectedTimestamp, setSelectedTimestamp] = useState("");

    const hoursOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const minutesOptions = ['00', '15', '30', '45'];
    const amPmOptions = ['AM', 'PM'];

    const [selectedHour, setSelectedHour] = useState(hoursOptions[0]);
    const [selectedMinute, setSelectedMinute] = useState(minutesOptions[0]);
    const [selectedAmPm, setSelectedAmPm] = useState(amPmOptions[0]);

    const handleHourChange = (e) => {
        setSelectedHour(e.target.value);
    };

    const handleMinuteChange = (e) => {
        setSelectedMinute(e.target.value);
    };

    const handleAmPmChange = (e) => {
        setSelectedAmPm(e.target.value);
    };

    useEffect(() => {
        if (selectedDate && selectedDate) {
            const newDate = new Date(selectedDate.toLocaleString());
            let hour24 = parseInt(selectedHour, 10);
            if (selectedAmPm === 'PM' && hour24 !== 12) {
                hour24 += 12;
            } else if (selectedAmPm === 'AM' && hour24 === 12) {
                hour24 = 0;
            }
            newDate.setHours(hour24, parseInt(selectedMinute, 10));
            setSelectedTimestamp(newDate.toLocaleString());
            setWhen(newDate.toUTCString())
        }
    }, [selectedDate, selectedHour, selectedMinute, selectedAmPm, setWhen]);


    return (
        <div className='select-datetime-container'>
            <h4>Date</h4>
            <Calendar onChange={(date) => setSelectedDate(date)} value={selectedDate} />
            <h4>Time</h4>
            <select value={selectedHour} onChange={handleHourChange}>
                {hoursOptions.map((hour, index) => (
                    <option key={index} value={hour}>{hour}</option>
                ))}
            </select>
            <select value={selectedMinute} onChange={handleMinuteChange}>
                {minutesOptions.map((minute, index) => (
                    <option key={index} value={minute}>{minute}</option>
                ))}
            </select>
            <select value={selectedAmPm} onChange={handleAmPmChange}>
                {amPmOptions.map((amPm, index) => (
                    <option key={index} value={amPm}>{amPm}</option>
                ))}
            </select>
            <p>Selected DateTime: {selectedTimestamp}</p>
        </div>
    )
};

export default SelectDateTime;