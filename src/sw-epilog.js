
let db;

function createDB() {

    console.log("creating db");
    var request = indexedDB.open("requests");
    request.onupgradeneeded = function (event) {
        // Save the IDBDatabase interface 
        let dbUpgrade = event.target.result;

        console.log("creating object store");

        // Create an objectStore for this database
        var objectStore = dbUpgrade.createObjectStore("api", { autoIncrement: true });
    };
    request.onerror = function (event) {
        console.log("Why didn't you allow my web app to use IndexedDB?!", event.target.errorCode);
    };
    request.onsuccess = function (event) {
        db = event.target.result;
    };
}

function addData(url) {
    console.log("adding data");

    return new Promise((resolve, reject) => {

        let tran = db.transaction('api', "readwrite");
        let objStore = tran.objectStore('api');
        objStore.add({ url: url, date: new Date().getTime() }).onsuccess =
            () => { resolve("ok") }
    });
};

function readDB() {
    let result = [];
    return new Promise((resolve, reject) => {
        let objectStore = db.transaction("api", "readwrite").objectStore("api");

        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                result.push({ key: cursor.key, value: cursor.value });
                cursor.continue();
            }
            else {
                resolve(result);
            }
        };
    });
}

function removeData(key) {
    console.log("removing data");
    return new Promise((resolve, reject) => {
        let tran = db.transaction('api', "readwrite");
        let objStore = tran.objectStore('api');
        objStore.delete(key).onsuccess = () => { resolve("ok") };
    });
};

self.addEventListener('activate', function (event) {
    event.waitUntil(
        createDB()
    );
});


self.addEventListener('fetch', function (event) {
    if (/.gif/.test(event.request.url)) {
        console.log("inside fetch here");
        event.respondWith(
            function () {
                let url = new URL(event.request.url);
                let params = url.searchParams;
                let finalUrl = event.request.url.split('?')[0] + `?event=${params.get('interaction')}&customer=${params.get('client')}` +
                    `&operating_system_name=${params.get('os_name')}&utm_source=${params.get('x1')}&utm_medium=${params.get('x2')}` +
                    `&utm_campaign=${params.get('x3')}&campaign_url=${params.get('landing_url')}`;
                if (navigator.onLine) {
                    console.log("network available");
                    fetch(finalUrl)
                        .then((response) => { })
                        .catch((err) => {
                            addData(finalUrl);
                        });
                } else {
                    addData(finalUrl);
                    console.log("network unavailable");
                }

                return new Response({})
            }()
        );
    }
});

self.addEventListener('sync', async function (event) {
    if (event.tag === 'onlineSync') {
        console.log("online now")
        readDB()
            .then(async (data) => {
                for (let i = 0; i < data.length; i++) {
                    console.log("sending data for key", data[i].key)
                    await fetch(data[i].value.url)
                        .then(async (res) => {
                            await removeData(data[i].key);
                        })
                        .catch((err) => { });
                }
            });

    }
});

