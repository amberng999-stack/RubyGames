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
       KEEP ONLY 30
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

function loadAdminMissions() {
    let acceptedMissions =
        JSON.parse(
            localStorage.getItem(
                "acceptedMissions"
            )
        ) || [];

    let output = "";
    acceptedMissions.forEach(function (item) {
        if (item.status !== "Pending Review") {
            return;
        }

        let mission =
            missionDatabase.find(function (m) {
                return m.id === item.id;
            });

        output += `

        <div class="col-lg-6">
            <div class="admin-mission-card">
                 <h3>
                    ${mission ? mission.title : "Unknown Mission"}
                </h3>

                <p>
                    Reward:
                    💎 ${mission ? mission.reward : 0} Points
                </p>

                <p>
                    Status:
                    ${item.status}
                </p>

                <p>
                    Proof:
                    ${item.proofFile || "No file"}
                </p>

                <p>
                    Submitted:
                    ${item.proofSubmittedAt
                ? new Date(item.proofSubmittedAt).toLocaleString(
                    "en-MY",
                    {
                        dateStyle: "medium",
                        timeStyle: "short"
                    }
                )
                : "Unknown"
            }
                </p>

                <div class="d-flex gap-2 mt-3">
                    <button
                        class="btn btn-success flex-fill approveMission"
                        data-id="${item.id}">

                        Approve

                    </button>

                    <button
                        class="btn btn-danger flex-fill rejectMission"
                        data-id="${item.id}">

                        Reject

                    </button>

                </div>

            </div>

        </div>

        `;

    });

    if (output === "") {
        output = `

        <div class="col-12">

            <div class="alert alert-secondary">

                No missions are waiting for review.

            </div>

        </div>

        `;
    }

    $("#adminMissionList").html(output);
}

loadAdminMissions();

/* ================================
   APPROVE MISSION
================================ */
$(document).on(
    "click",
    ".approveMission",
    function () {

        let missionId =
            parseInt(
                $(this).data("id")
            );


        let acceptedMissions =
            JSON.parse(
                localStorage.getItem(
                    "acceptedMissions"
                )
            ) || [];


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


        /* =============================
           CHECK STATUS
        ============================= */

        if (
            mission.status !== "Pending Review"
        ) {

            alert(
                "This mission is not waiting for review."
            );

            return;

        }


        /* =============================
           FIND MISSION INFORMATION
        ============================= */

        let missionInfo =
            missionDatabase.find(function (item) {

                return item.id === missionId;

            });


        if (!missionInfo) {

            alert(
                "Mission information not found."
            );

            return;

        }


        /* =============================
           CHANGE STATUS
        ============================= */

        mission.status = "Approved";


        /* =============================
           LOAD HISTORY
        ============================= */

        let missionHistory =
            JSON.parse(
                localStorage.getItem(
                    "missionHistory"
                )
            ) || [];


        /* =============================
           ADD TO HISTORY
        ============================= */

        missionHistory.push({

            id: mission.id,

            status: "Approved",

            acceptedDate:
                mission.acceptedDate,

            expireAt:
                mission.expireAt,

            proofFile:
                mission.proofFile,

            proofSubmittedAt:
                mission.proofSubmittedAt,

            completedAt:
                new Date().toISOString()

        });


        /* =============================
        KEEP ONLY LATEST 30
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


        missionHistory =
            missionHistory.slice(0, 30);


        /* =============================
           SAVE HISTORY
        ============================= */

        localStorage.setItem(

            "missionHistory",

            JSON.stringify(
                missionHistory
            )

        );

        console.log(
            "HISTORY SAVED:",
            localStorage.getItem("missionHistory")
        );


        /* =============================
           REMOVE FROM ACTIVE MISSIONS
        ============================= */

        acceptedMissions =
            acceptedMissions.filter(function (item) {

                return item.id !== missionId;

            });


        localStorage.setItem(

            "acceptedMissions",

            JSON.stringify(
                acceptedMissions
            )

        );


        /* =============================
           ADD REWARD POINTS
        ============================= */

        let memberPoints =
            parseInt(
                localStorage.getItem(
                    "memberPoints"
                )
            ) || 0;


        memberPoints +=
            missionInfo.reward;


        localStorage.setItem(

            "memberPoints",

            memberPoints

        );


        /* =============================
           SUCCESS
        ============================= */

        alert(
            "Mission approved! +" +
            missionInfo.reward +
            " Points"
        );


        /* =============================
           REFRESH ADMIN
        ============================= */

        loadAdminMissions();

    }
);


/* =================================
   REJECT MISSION
================================= */

$(document).on(
    "click",
    ".rejectMission",
    function () {

        let missionId =
            parseInt(
                $(this).data("id")
            );


        let acceptedMissions =
            JSON.parse(
                localStorage.getItem(
                    "acceptedMissions"
                )
            ) || [];


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
            mission.status !== "Pending Review"
        ) {

            alert(
                "This mission is not waiting for review."
            );

            return;

        }


        /* =============================
           SAVE TO HISTORY
        ============================= */

        saveMissionToHistory(
            mission,
            "Rejected"
        );


        /* =============================
           REMOVE FROM ACTIVE
        ============================= */

        acceptedMissions =
            acceptedMissions.filter(function (item) {

                return item.id !== missionId;

            });


        localStorage.setItem(

            "acceptedMissions",

            JSON.stringify(
                acceptedMissions
            )

        );


        alert(
            "Mission rejected."
        );


        loadAdminMissions();

    }
);
