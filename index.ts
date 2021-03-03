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


  if (response.data[0].data.user && response.data[0].data.user.channel && response.data[0].data.user.channel.schedule && response.data[0].data.user.channel.schedule.segments ) {
    var items = response.data[0].data.user.channel.schedule.segments;
    items.sort((a,b) => { a.startAt - b.startAt});
    for (const s of items) {
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
}


const users = [
  "brattdamon",
  "cadillacjack1",
  "canhorn",
  "codejuration",
  "lucecarter",
  "contentfuldevs",
  "cowboy_salmon",
  "dr_dinomight",
  "exegeteio",
  "gacbl",
  "jwalter",
  "laylacodesit",
  "matty_twoshoes",
  "rawwwrs",
  "ryantupo",
  "ryan_the_rhg",
  "sadmoody",
  "sketchni",
  "sociablesteve",
  "thatn00b__",
  "toefrog",
  "greg_holmes",
  "madhouseminers",

];

Promise.all(users.map((u) => getSchedule(u))).then(() => {
  fs.writeFile('./public/scripts/output.js', 'var schedule = ' + JSON.stringify(schedule),  function(err) {
      if (err) {
          return console.error(err);
      }
      console.log("File created!");
  });
});

