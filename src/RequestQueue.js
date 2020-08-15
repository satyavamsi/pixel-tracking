import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

import './RequestQueue.css';

function RequestQueue() {

    let [requests, setRequests] = useState([]);

    let [db, setDB] = useState();

    useEffect(() => {
        let request = indexedDB.open("requests");

        request.onupgradeneeded = function (event) {
            // Save the IDBDatabase interface 
            let dbUpgrade = event.target.result;

            console.log("creating object store");

            // Create an objectStore for this database
            var objectStore = dbUpgrade.createObjectStore("api", { autoIncrement: true });
        };
        request.onerror = function (event) {
            console.log("DB Error", event.target.errorCode);
        };
        request.onsuccess = function (event) {
            setDB(event.target.result);
        };

        return () => { }
    }, [])

    useEffect(() => {
        let dbInterval = setInterval(() => {
            if (db) {
                getData()
                    .then((data) => {
                        setRequests(data);
                    })
            }
        }, 5000)
        return () => { clearInterval(dbInterval) }
    }, [db]);

    const getData = () => {
        let result = [];
        return new Promise((resolve, reject) => {
            let objectStore = db.transaction("api", "readwrite").objectStore("api");

            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    let url = new URL(cursor.value.url);
                    let params = url.searchParams;
                    result.push({ type: params.get('utm_source'), time: moment(cursor.value.date).tz('Asia/Kolkata').format('MMMM Do, YYYY - h:mm:ss A') });
                    cursor.continue();
                }
                else {
                    resolve(result);
                }
            };
        });
    }
    console.log("requests-----", ...requests);
    return (
        <div className="requestQueue">
            <h2>RequestQueue</h2>
            <div className="requestQueue_body">
                {requests.map((request) => {
                    return (
                        <p>{request.type} is clicked at {request.time}</p>
                    )
                })}
            </div>
        </div>
    )
}

export default RequestQueue
