import React, { useState } from "react";
import "./Game.css"; // Optional: Add styles here

const quests = [
  { id: 1, name: "Catch a Puni Fish", description: "Fish in the Puni River.", points: 50 },
  { id: 2, name: "Trade with Nooki", description: "Sell 5 items to the shop.", points: 75 },
  { id: 3, name: "Plant a Tree", description: "Grow a tree in the village.", points: 30 },
];

const Game = () => {
  const [user, setUser] = useState({ id: "Player1", points: 0, completedQuests: [] });
  const [users, setUsers] = useState([
    { id: "Player1", points: 0 },
    { id: "Player2", points: 120 },
    { id: "Player3", points: 80 },
  ]); // Simulated leaderboard data
  const [message, setMessage] = useState("");

  // Quest System 🎮
  const completeQuest = (quest) => {
    if (!user.completedQuests.includes(quest.id)) {
      const newPoints = user.points + quest.points;
      setUser({
        ...user,
        points: newPoints,
        completedQuests: [...user.completedQuests, quest.id],
      });
      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, points: newPoints } : u
        )
      );
      setMessage(`Quest "${quest.name}" completed! +${quest.points} points`);
    } else {
      setMessage("You've already completed this quest!");
    }
  };

  // Leaderboard 🏆
  const getLeaderboard = () => {
    return users
      .sort((a, b) => b.points - a.points)
      .slice(0, 5); // Top 5 players
  };

  // Mystery Box Airdrop 🎁
  const openMysteryBox = () => {
    if (Math.random() < 0.4) {
      const rewards = [50, 100, "Puni Bell", "Golden Leaf", "Mystery Fruit"];
      const reward = rewards[Math.floor(Math.random() * rewards.length)];
      if (typeof reward === "number") {
        const newPoints = user.points + reward;
        setUser({ ...user, points: newPoints });
        setUsers(
          users.map((u) =>
            u.id === user.id ? { ...u, points: newPoints } : u
          )
        );
        setMessage(`🎁 Mystery Box opened! You won ${reward} points!`);
      } else {
        setMessage(`🎁 Mystery Box opened! You won a ${reward}!`);
      }
    } else {
      setMessage("🎁 The Mystery Box was empty... Try again later!");
    }
  };

  return (
    <div className="game-container">
      <h1>Punetanooki Village</h1>
      <p>Welcome, {user.id}! Points: {user.points}</p>
      {message && <p className="message">{message}</p>}

      {/* Quest System */}
      <section>
        <h2>🎮 Quests</h2>
        <ul>
          {quests.map((quest) => (
            <li key={quest.id}>
              {quest.name}: {quest.description} ({quest.points} points)
              <button
                onClick={() => completeQuest(quest)}
                disabled={user.completedQuests.includes(quest.id)}
              >
                {user.completedQuests.includes(quest.id) ? "Done" : "Complete"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Leaderboard */}
      <section>
        <h2>🏆 Leaderboard</h2>
        <ol>
          {getLeaderboard().map((player, index) => (
            <li key={index}>
              {player.id} - {player.points} points
            </li>
          ))}
        </ol>
      </section>

      {/* Mystery Box */}
      <section>
        <h2>🎁 Mystery Box</h2>
        <button onClick={openMysteryBox}>Open a Mystery Box!</button>
      </section>
    </div>
  );
};

export default Game;
