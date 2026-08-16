/* Shared mission catalogue used by both the member and admin pages. */
const missionDatabase = [
  { id: 1, title: "Win 3 Ranked Matches", description: "Complete 3 ranked matches today.", reward: 200, difficulty: "Easy", missionCategory: "Daily", resetRule: "daily", expiry: null },
  { id: 2, title: "Join Community Event", description: "Participate in the community event.", reward: 500, difficulty: "Easy", missionCategory: "Event", resetRule: "never", expiry: "2026-09-20T23:59:59" },
  { id: 3, title: "Invite One Friend", description: "Invite one friend into the esports club.", reward: 400, difficulty: "Easy", missionCategory: "Community", resetRule: "never", expiry: null },
  { id: 4, title: "Team With Our Club Member", description: "Complete 3 ranked matches with at least one club member.", reward: 300, difficulty: "Easy", missionCategory: "Community", resetRule: "daily", expiry: null },
  { id: 5, title: "Match MVP", description: "Obtain MVP in 1 ranked match.", reward: 300, difficulty: "Medium", missionCategory: "Daily", resetRule: "daily", expiry: null }
];
