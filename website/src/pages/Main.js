import './Main.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//
//
function Main() {
    const [displayAdvancedBox, setDisplayAdvancedBox] = useState(false)
    const [maxUsesAdvancedBox, setMaxUsesAdvancedBox] = useState(0)
    const [expirationDateAdvancedBox, setExpirationDateAdvancedBox] = useState(getCurrentInputDate())
    const [alertBox, setAlertBox] = useState({ display: false, value: "", color: "" })
    const [shaking, setShaking] = useState(false)
    //
    const navigate = useNavigate();
    //
    function handleSumbit(event) {
        event.preventDefault()
        //
        const value = event.target["long-url-text-input"].value || ""
        //
        if(value.length === 0) {
            turnOnShake()
            setAlertBox({ display: true, value: "Enter the URL", color: "yellow" })
            clearAlertBox()
            return
        }
        //
        if(!validateURL(value)) {
            turnOnShake()
            setAlertBox({ display: true, value: "Invalid URL link", color: "red" })
            return clearAlertBox()
        }
        //
        let max_uses = false
        let expiration_timestamp = false
        if(!isNaN(maxUsesAdvancedBox) && maxUsesAdvancedBox > 0) max_uses = maxUsesAdvancedBox
        if(expirationDateAdvancedBox !== getCurrentInputDate()) {
            try {
                let timestamp = new Date(expirationDateAdvancedBox)
                timestamp.setHours(20)
                timestamp.setMinutes(0)
                timestamp.setSeconds(0)
                //
                timestamp = timestamp.getTime()
                if(!isNaN(timestamp) && timestamp > Date.now()) expiration_timestamp = timestamp
            } catch (error) { }
        }
        //
        fetch(`${process.env.REACT_APP_API_ADDRESS}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: value,
                max_uses: max_uses,
                expiration_timestamp: expiration_timestamp
            })
        }).then(response => response.json())
            .then(data => {
                setAlertBox({ display: true, value: data.message, color: data.success ? "green" : "red" })
                clearAlertBox()
                if(!data.success) return
                //
                navigate(`/stats?shorturl=${data.result}`)
            })
            .catch(error => {
                console.error(error)
                //
                turnOnShake()
                setAlertBox({ display: true, value: "An error occurred while sending a query to the API", color: "red" })
                clearAlertBox()
            })
        //
    }
    //
    function handleAdvancedBoxDisplay() {
        setDisplayAdvancedBox(!displayAdvancedBox)
    }
    function handleExpirationDateChange(event) {
        setExpirationDateAdvancedBox(event.target.value)
    }
    function handleMaxUsesChange(event) {
        setMaxUsesAdvancedBox(event.target.value)
    }
    function turnOnShake() {
        setShaking(true)
        setTimeout(() => {
            setShaking(false)
        }, 500);
    }
    //
    function clearAlertBox() {
        setTimeout(() => {
            setAlertBox({ display: false, value: "", color: "" })
        }, 2000);
    }
    //
    return (
        <div>
            <h1>
                <Link to="/">URL Shortener</Link>
            </h1>
            <form onSubmit={handleSumbit} className={shaking ? "shake-animation" : ""}>
                <input type="text" id="long-url-text-input" className="on-top-shadow" autoComplete="off"></input>
                <input type="submit" id="shorten-button" className="on-top-shadow" value="Shorten"></input>
            </form>

            <button id="advanced-button" className="on-top-shadow" onClick={handleAdvancedBoxDisplay}>Advanced</button>
            <div id="advanced-box-all" className={ displayAdvancedBox ? "advanced-box-fade-in" : "advanced-box-hidden" }>
                <div className="advanced-box-one">
                    <p>Max uses:</p>
                    <p>Expiration date:</p>
                </div>
                <div className="advanced-box-one">
                    <input type="number" id="advanced-max-uses-input" className="on-top-shadow" name="maxuses" min="0" max="100000" value={maxUsesAdvancedBox} onChange={handleMaxUsesChange}></input>
                    <input type="date" id="advanced-expiration-date-input" className="on-top-shadow" name="expirationdate" value={expirationDateAdvancedBox} onChange={handleExpirationDateChange}></input>
                </div>
            </div>

            <div id="alert-box" className={`on-top-shadow, alert-box-${alertBox.color}`} style={{ visibility: alertBox.display ? "unset" : "hidden" }}>
                {alertBox.value}
            </div>

            <footer>
                <div>
                    <Link to="/stats">Statistics</Link>
                </div>
                <div>
                    <Link to="/faq">FAQ</Link>
                </div>
            </footer>
            
        </div>
    )
}
//
export default Main
//
function validateURL(url) {
    if(!url) return false
    if(!url.includes(".")) return false
    if(url.split(".")[0].length === 0 || url.split(".")[1].length === 0) return false
    if(url.split(".").reverse()[0].length === 0) return false
    return true
}
//
function getCurrentInputDate() {
    const date = new Date()
    let date_txt = [date.getFullYear()+1, date.getMonth()+1, date.getDate()]
    //
    if(date_txt[1] < 10) date_txt[1] = `0${date_txt[1]}`
    if(date_txt[2] < 10) date_txt[2] = `0${date_txt[2]}`
    //
    return `${date_txt[0]}-${date_txt[1]}-${date_txt[2]}`
}
//