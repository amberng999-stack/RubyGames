function loadMissionCards() {

    let html = "";

    let now = new Date();


    missionDatabase.forEach(function (mission) {

        /* =================================
           FIND EXISTING MISSION RECORD
        ================================= */

        let existingMission =
            acceptedMissions.find(function (item) {

                return item.id === mission.id;

            });


        /* =================================
           SHOULD SHOW IN AVAILABLE?
        ================================= */

        let canShow = true;


        if (existingMission) {

            /* =============================
               IN PROGRESS
            ============================= */

            if (
                existingMission.status === "In Progress"
            ) {

                canShow = false;

            }


            /* =============================
               PENDING REVIEW
            ============================= */

            if (
                existingMission.status === "Pending Review"
            ) {

                canShow = false;

            }


            /* =============================
               REJECTED
               ALWAYS AVAILABLE AGAIN
            ============================= */

            if (
                existingMission.status === "Rejected"
            ) {

                canShow = true;

            }


            /* =============================
               APPROVED
            ============================= */

            if (
                existingMission.status === "Approved"
            ) {

                /*
                   No expiry
                   → available again
                */

                if (mission.expiry === null) {

                    canShow = true;

                }
                else {

                    /*
                       Has expiry
                       → wait until expiry
                    */

                    let expiry =
                        new Date(
                            mission.expiry
                        );


                    if (now < expiry) {

                        canShow = false;

                    }
                    else {

                        canShow = true;

                    }

                }

            }


            /* =============================
               CANCELLED
            ============================= */

            if (
                existingMission.status === "Cancelled"
            ) {

                if (mission.expiry === null) {

                    canShow = true;

                }
                else {

                    let expiry =
                        new Date(
                            mission.expiry
                        );


                    canShow =
                        now >= expiry;

                }

            }


            /* =============================
               EXPIRED
            ============================= */

            if (
                existingMission.status === "Expired"
            ) {

                canShow = true;

            }

        }


        /* =================================
           CHECK MISSION EXPIRY
        ================================= */

        if (
            mission.expiry !== null &&
            now >= new Date(mission.expiry)
        ) {

            /*
               Fixed expiry has ended.
               Mission should no longer be
               available if the event itself
               has expired.
            */

            canShow = false;

        }


        if (!canShow) {

            return;

        }


        /* =================================
           CREATE CARD
        ================================= */

        html += `

        <div class="col-lg-4 col-md-6">

            <div class="mission-card">

                <div class="mission-header">

                    <h3>
                        ${mission.title}
                    </h3>

                    <div class="countdown-box">

                        ⏳

                        <span
                            class="countdown"
                            data-expire="${calculateExpireAt(mission)}">
                        </span>

                    </div>

                </div>


                <p>

                    ${mission.description}

                </p>


                <p>

                    Category :
                    ${mission.missionCategory}

                </p>


                <p>

                    Difficulty :
                    ${mission.difficulty}

                </p>


                <div class="mission-reward">

                    💎 ${mission.reward}

                    Points

                </div>


                <button

                    class="btn mission-btn acceptMission"

                    data-id="${mission.id}">

                    Accept Mission

                </button>

            </div>

        </div>

        `;

    });


    /* =================================
       NO AVAILABLE MISSIONS
    ================================= */

    if (html === "") {

        html = `

        <div class="col-12">

            <div class="text-center py-4">

                <p class="mb-0">

                    No missions available.

                </p>

            </div>

        </div>

        `;

    }


    $("#missionContainer").html(html);


    startCountdown();

}

let acceptedMissions =
    JSON.parse(
        localStorage.getItem("acceptedMissions")
    ) || [];


let missionHistory =
    JSON.parse(
        localStorage.getItem("missionHistory")
    ) || [];


/* =================================
   MISSION TABS
================================= */

let currentMissionTab = "inprogress";


$(document).on(
    "click",
    ".mission-tab",
    function () {

        let selectedTab =
            $(this).data("tab");


        currentMissionTab =
            selectedTab;


        // Change active tab

        $(".mission-tab")
            .removeClass("active");


        $(this)
            .addClass("active");


        // Refresh missions

        loadMyMissions();

    }
);


/*=========================================*
* CALCULATE MISSION EXPIRY
*=========================================*/

function calculateExpireAt(mission) {

    if (mission.resetRule === "daily") {

        let today = new Date();

        today.setHours(
            23,
            59,
            59,
            999
        );

        return today.toISOString();
    }

    if (mission.resetRule === "never") {

        return mission.expiry;
    }
    return null;

}


/* =================================
   LOAD MEMBER POINTS
================================= */


let memberPoints = localStorage.getItem("memberPoints");


// First time user

if (memberPoints === null) {

    memberPoints = 500;

    localStorage.setItem(
        "memberPoints",
        memberPoints
    );

}

function checkDailyRefresh() {

    let today =
        new Date().toDateString();


    let lastRefresh =
        localStorage.getItem(
            "dailyRefreshDate"
        );

    if (today !== lastRefresh) {

        acceptedMissions =
            acceptedMissions.filter(function (item) {

                let mission =
                    missionDatabase.find(function (m) {

                        return m.id === item.id;

                    });

                if (
                    mission &&
                    mission.resetRule === "daily"
                ) {
                    if (item.status === "Pending Review") {
                        return true;
                    }
                    return false;
                }

                return true;
            });
    }

    localStorage.setItem(

        "acceptedMissions",

        JSON.stringify(
            acceptedMissions
        )
    );



    localStorage.setItem(
        "dailyRefreshDate",
        today
    );
}


// Display Points

$("#memberPoints").text(memberPoints);
checkDailyRefresh();
checkExpiredMissions();
loadMissionCards();
loadMyMissions();
//startCountdown();




/*=========================================
    MEMBER DATA
=========================================*/


$(document).on(
    "click",
    ".acceptMission",
    function () {

        let missionId =
            parseInt(
                $(this).data("id")
            );

        if (!sessionStorage.getItem("username")) {

            sessionStorage.setItem(
                "rubyPendingAction",
                JSON.stringify({
                    type: "acceptMission",
                    returnUrl: window.location.pathname + window.location.search,
                    missionId: missionId
                })
            );

            alert("Please sign in to accept this mission.");
            window.location.href = "signin.html";
            return;

        }

        console.log("Accept Mission button clicked");

        console.log("Mission ID:", missionId);


        let mission =
            missionDatabase.find(function (item) {

                return item.id === missionId;

            });


        if (!mission) {

            console.log(
                "Mission not found:",
                missionId
            );

            return;

        }


        let existingMission =
            acceptedMissions.find(function (item) {

                return item.id === missionId;

            });


        if (existingMission) {

            /* =============================
            IN PROGRESS
            ============================= */

            if (
                existingMission.status === "In Progress"
            ) {

                alert(
                    "Mission already accepted."
                );

                return;

            }


            /* =============================
            PENDING REVIEW
            ============================= */

            if (
                existingMission.status === "Pending Review"
            ) {

                alert(
                    "Mission is currently under review."
                );

                return;

            }


            /* =============================
            REJECTED
            CAN ACCEPT AGAIN IMMEDIATELY
            ============================= */

            if (
                existingMission.status === "Rejected"
            ) {

                // Allowed

            }


            /* =============================
            APPROVED
            ============================= */

            if (
                existingMission.status === "Approved"
            ) {

                /*
                No expiry:
                Can accept again immediately.
                */

                if (mission.expiry === null) {

                    // Allowed

                }
                else {

                    /*
                    Has expiry:
                    Must wait until expiry.
                    */

                    let now = new Date();

                    let expiry =
                        new Date(
                            mission.expiry
                        );


                    if (now < expiry) {

                        alert(
                            "This mission is not available yet."
                        );

                        return;

                    }

                }

            }


            /* =============================
            CANCELLED
            ============================= */

            if (
                existingMission.status === "Cancelled"
            ) {

                /*
                No expiry:
                Can accept again immediately.
                */

                if (mission.expiry === null) {

                    // Allowed

                }
                else {

                    let now = new Date();

                    let expiry =
                        new Date(
                            mission.expiry
                        );


                    if (now < expiry) {

                        alert(
                            "This mission is not available yet."
                        );

                        return;

                    }

                }

            }


            /* =============================
            EXPIRED
            ============================= */

            if (
                existingMission.status === "Expired"
            ) {

                // Allowed because expiry has ended

            }

        }


        let expireAt =
            calculateExpireAt(mission);


        /* =============================
        REMOVE OLD HISTORY RECORD
        ============================= */

        acceptedMissions =
            acceptedMissions.filter(function (item) {

                return item.id !== mission.id;

            });


        /* =============================
        ADD NEW ACCEPTED MISSION
        ============================= */

        acceptedMissions.push({

            id: mission.id,

            status: "In Progress",

            acceptedDate:
                new Date().toISOString(),

            expireAt:
                expireAt

        });


        localStorage.setItem(

            "acceptedMissions",

            JSON.stringify(
                acceptedMissions
            )

        );

        alert(
            "Mission accepted!"
        );


        loadMyMissions();

    }
);


/* Resume a mission selected before sign-in. */
if (sessionStorage.getItem("username")) {

    try {

        let pendingAction =
            JSON.parse(
                sessionStorage.getItem("rubyPendingAction") || "null"
            );

        let currentUrl =
            window.location.pathname + window.location.search;

        if (
            pendingAction?.type === "acceptMission" &&
            pendingAction.returnUrl === currentUrl
        ) {

            sessionStorage.removeItem("rubyPendingAction");

            let pendingButton =
                $(`.acceptMission[data-id="${Number(pendingAction.missionId)}"]`);

            if (pendingButton.length) {

                pendingButton.trigger("click");

            }

        }

    }
    catch (error) {

        sessionStorage.removeItem("rubyPendingAction");

    }

}



/* =================================
   SUBMIT PROOF
================================= */

const proofInput = $('<input>', {
    type: 'file',
    accept: 'image/*, .pdf'
});

proofInput.css('display', 'none');

$('body').append(proofInput);

proofInput.on(
    "change",
    function () {

        let file =
            this.files[0];


        // User cancelled file selection
        if (!file) {

            return;

        }


        let missionId =
            parseInt(
                sessionStorage.getItem(
                    "proofMission"
                )
            );


        let mission =
            acceptedMissions.find(function (item) {

                return item.id === missionId;

            });


        if (!mission) {

            alert(
                "Mission not found."
            );

            return;

        }


        // Change mission status
        mission.status =
            "Pending Review";


        // Save proof information
        mission.proofFile =
            file.name;


        mission.proofSubmittedAt =
            new Date().toISOString();


        // Save updated missions
        localStorage.setItem(

            "acceptedMissions",

            JSON.stringify(
                acceptedMissions
            )

        );


        // Refresh mission cards
        loadMyMissions();
        startCountdown();


        alert(
            "Proof submitted. Waiting for admin review."
        );

    }
);

$(document).on(
    "click",
    ".submitMission",
    function () {

        let missionId =
            parseInt(
                $(this).data("id")
            );


        let mission =
            acceptedMissions.find(function (item) {

                return item.id === missionId;

            });


        if (!mission) {

            alert(
                "Mission not found."
            );

            return;

        }


        if (mission.status === "Pending Review") {

            alert(
                "Mission is already under review."
            );

            return;

        }


        sessionStorage.setItem(
            "proofMission",
            missionId.toString()
        );


        proofInput.val("");

        proofInput.click();

    }
);



/* =================================
   CANCEL MISSION
================================= */

$(document).on(
    "click",
    ".cancelMission",
    function () {

        let missionId =
            parseInt(
                $(this).data("id")
            );


        let mission =
            acceptedMissions.find(function (item) {

                return item.id === missionId;

            });


        if (!mission) {

            alert(
                "Mission not found."
            );

            return;

        }


        if (
            mission.status === "Pending Review"
        ) {

            alert(
                "Mission is under review and cannot be cancelled."
            );

            return;

        }


        /* =============================
           SAVE TO HISTORY
        ============================= */

        saveMissionToHistory(
            mission,
            "Cancelled"
        );


        /* =============================
           REMOVE FROM ACTIVE
        ============================= */

        acceptedMissions =
            acceptedMissions.filter(function (item) {

                return item.id !== missionId;

            });


        /* =============================
           SAVE
        ============================= */

        localStorage.setItem(

            "acceptedMissions",

            JSON.stringify(
                acceptedMissions
            )

        );


        alert(
            "Mission cancelled."
        );


        loadMyMissions();

    }
);



function loadMyMissions() {

    let output = "";


    /* =================================
       LOAD ACTIVE MISSIONS
    ================================= */

    let acceptedMissions =
        JSON.parse(
            localStorage.getItem(
                "acceptedMissions"
            )
        ) || [];


    /* =================================
       LOAD HISTORY
    ================================= */

    let missionHistory =
        JSON.parse(
            localStorage.getItem(
                "missionHistory"
            )
        ) || [];


    /* =================================
       SELECT DATA BASED ON TAB
    ================================= */

    let missionsToDisplay = [];


    /* =============================
       IN PROGRESS
    ============================= */

    if (currentMissionTab === "inprogress") {

        missionsToDisplay =
            acceptedMissions.filter(function (item) {

                return item.status === "In Progress";

            });

    }


    /* =============================
       PENDING
    ============================= */

    if (currentMissionTab === "pending") {

        missionsToDisplay =
            acceptedMissions.filter(function (item) {

                return item.status === "Pending Review";

            });

    }


    /* =============================
       HISTORY
    ============================= */

    if (currentMissionTab === "history") {

        missionsToDisplay =
            missionHistory;

    }


    /* =================================
    SORT - NEWEST FIRST
    ================================= */

    missionsToDisplay.sort(function (a, b) {

        let dateA =
            a.completedAt ||
            a.proofSubmittedAt ||
            a.acceptedDate ||
            0;

        let dateB =
            b.completedAt ||
            b.proofSubmittedAt ||
            b.acceptedDate ||
            0;


        return new Date(dateB) - new Date(dateA);

    });


    /* =================================
       NOTHING FOUND
    ================================= */

    if (missionsToDisplay.length === 0) {

        $("#myMissionList").html(`

            <div class="text-center py-4">

                <p class="mb-0">

                    No missions here.

                </p>

            </div>

        `);

        return;

    }


    /* =================================
       CREATE MISSION ROWS
    ================================= */

    missionsToDisplay.forEach(function (item) {


        let mission =
            missionDatabase.find(function (m) {

                return m.id === item.id;

            });


        if (!mission) {

            return;

        }


        let actionButtons = "";


        /* =============================
           IN PROGRESS BUTTONS
        ============================= */

        if (item.status === "In Progress") {

            actionButtons = `

                <div class="my-mission-actions">

                    <button
                        class="btn btn-success submitMission"
                        data-id="${mission.id}">

                        Submit

                    </button>


                    <button
                        class="btn btn-danger cancelMission"
                        data-id="${mission.id}">

                        Cancel

                    </button>

                </div>

            `;

        }


        /* =============================
           PENDING
        ============================= */

        if (item.status === "Pending Review") {

            actionButtons = `

                <div class="my-mission-status">

                    Pending Review

                </div>

            `;

        }


        /* =============================
           HISTORY
        ============================= */

        if (
            item.status === "Approved" ||
            item.status === "Rejected" ||
            item.status === "Cancelled" ||
            item.status === "Expired"
        ) {

            let statusClass = "";


            if (item.status === "Approved") {

                statusClass =
                    "history-approved";

            }


            if (item.status === "Rejected") {

                statusClass =
                    "history-rejected";

            }


            if (item.status === "Cancelled") {

                statusClass =
                    "history-cancelled";

            }


            if (item.status === "Expired") {

                statusClass =
                    "history-expired";

            }


            let rewardText = "";

            if (item.status === "Approved") {

                let missionInfo =
                    missionDatabase.find(function (m) {

                        return m.id === item.id;

                    });

                if (missionInfo) {

                    rewardText =
                        `<span class="history-reward">
                            +${missionInfo.reward} Points
                        </span>`;

                }

            }


            actionButtons = `

                <div class="my-mission-status ${statusClass}">

                    ${item.status}

                    ${rewardText}

                </div>

            `;

        }


        /* =================================
           COUNTDOWN
           ONLY IN PROGRESS
        ================================= */

        let countdownHTML = "";


        if (item.status === "In Progress") {

            countdownHTML = `

                <div class="my-mission-countdown">

                    Remaining:

                    <span
                        class="countdown"
                        data-expire="${item.expireAt}">
                    </span>

                </div>

            `;

        }


        /* =================================
           MISSION ROW
        ================================= */

        output += `

            <div class="my-mission-row">

                <div class="my-mission-info">

                    <h3 class="my-mission-title">

                        ${mission.title}

                    </h3>


                    ${countdownHTML}

                </div>


                ${actionButtons}

            </div>

        `;

    });


    /* =================================
       DISPLAY
    ================================= */

    $("#myMissionList").html(output);


    startCountdown();

}


/* =================================
   SAVE MISSION TO HISTORY
================================= */

function saveMissionToHistory(mission, status) {

    let missionHistory =
        JSON.parse(
            localStorage.getItem(
                "missionHistory"
            )
        ) || [];


    /* =============================
       ADD HISTORY RECORD
    ============================= */

    missionHistory.push({

        id:
            mission.id,

        status:
            status,

        acceptedDate:
            mission.acceptedDate,

        expireAt:
            mission.expireAt,

        proofFile:
            mission.proofFile || null,

        proofSubmittedAt:
            mission.proofSubmittedAt || null,

        completedAt:
            new Date().toISOString()

    });


    /* =============================
       NEWEST FIRST
    ============================= */

    missionHistory.sort(function (a, b) {

        return new Date(
            b.completedAt ||
            b.proofSubmittedAt ||
            b.acceptedDate
        ) -

            new Date(
                a.completedAt ||
                a.proofSubmittedAt ||
                a.acceptedDate
            );

    });


    /* =============================
       KEEP ONLY LATEST 30
    ============================= */

    missionHistory =
        missionHistory.slice(0, 30);


    /* =============================
       SAVE
    ============================= */

    localStorage.setItem(

        "missionHistory",

        JSON.stringify(
            missionHistory
        )

    );

}


function startCountdown() {


    $(".countdown").each(function () {


        let expireValue =
            $(this).data("expire");


        if (!expireValue) {

            $(this).text(
                "No Expiry"
            );

            return;

        }


        let expire =
            new Date(expireValue);


        let now =
            new Date();


        let diff =
            expire - now;

        if (diff <= 0) {

            $(this).text(
                "Expired"
            );

            return;
        }

        let hours =
            Math.floor(
                diff / (1000 * 60 * 60)
            );

        let minutes =
            Math.floor(
                (diff % (1000 * 60 * 60)) / (1000 * 60)
            );

        let seconds =
            Math.floor(
                (diff % (1000 * 60)) / 1000
            );


        $(this).text(

            hours + "h "
            +
            minutes + "m "
            +
            seconds + "s"

        );


    });

};

setInterval(
    startCountdown,
    1000
);

setInterval(
    checkExpiredMissions,
    1000
);



function checkExpiredMissions() {

    let now =
        new Date();


    let changed =
        false;


    acceptedMissions =
        acceptedMissions.filter(function (item) {

            /* =============================
               PENDING REVIEW
               NEVER AUTO EXPIRE
            ============================= */

            if (
                item.status === "Pending Review"
            ) {

                return true;

            }


            /* =============================
               NO EXPIRY
            ============================= */

            if (
                item.expireAt === null ||
                !item.expireAt
            ) {

                return true;

            }


            /* =============================
               STILL ACTIVE
            ============================= */

            let expire =
                new Date(
                    item.expireAt
                );


            if (expire > now) {

                return true;

            }


            /* =============================
               EXPIRED
               SAVE TO HISTORY
            ============================= */

            saveMissionToHistory(
                item,
                "Expired"
            );


            changed = true;


            return false;

        });


    /* =============================
       SAVE ACTIVE MISSIONS
    ============================= */

    if (changed) {

        localStorage.setItem(

            "acceptedMissions",

            JSON.stringify(
                acceptedMissions
            )

        );


        loadMyMissions();

    }

}


/* =================================
   ADMIN ACCESS
================================= */

$("#adminAccess").on(
    "click",
    function (e) {

        e.preventDefault();

        let password = prompt(
            "Enter Admin Password:"
        );

        if (password === "admin") {

            window.location.href =
                "admin.html";

        }
        else if (password !== null) {

            alert(
                "Incorrect password."
            );

        }

    }
);
