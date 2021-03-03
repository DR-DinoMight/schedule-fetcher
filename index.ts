import axios from "axios";
import * as fs from 'fs';

let schedule = {};

async function getSchedule(user: string) {
  const current = new Date();
  const response = await axios.post(
    "https://gql.twitch.tv/gql",
    [
      {
        operationName: "StreamSchedule",
        variables: {
          login: user,
          startingWeekday: "MONDAY",
          utcOffsetMinutes: 0,
          startAt: current,
          endAt: current.getDate()+30,
        },
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash:
              "e9af1b7aa4c4eaa1655a3792147c4dd21aacd561f608e0933c3c5684d9b607a6",
          },
        },
      },
    ],
    { headers: { "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko" } }
  );
  for (const s of response.data[0].data.user.channel.schedule.segments) {
    if (!schedule[s.startAt.substr(0, 10)]) {
      schedule[s.startAt.substr(0, 10)] = [];
    }
    schedule[s.startAt.substr(0, 10)].push({
      who: user,
      start: s.startAt,
      end: s.endAt,
      title: s.title,
    });
  }
}

const users = ["sociablesteve", "whitep4nth3r", "dr_dinomight"];

Promise.all(users.map((u) => getSchedule(u))).then(() => {
  console.log(schedule)
  fs.writeFile('./public/scripts/output.js', 'var schedule = ' + JSON.stringify(schedule),  function(err) {
      if (err) {
          return console.error(err);
      }
      console.log("File created!");
  });
});

