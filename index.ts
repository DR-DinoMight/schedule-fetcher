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
  {
    name: "brattdamon",
    id: "254737658",
  },
  {
    name: "cadillacjack1",
    id: "501793804",
  },
  {
    name: "canhorn",
    id: "60218113",
  },
  {
    name: "codejuration",
    id: "25116716",
  },
  {
    name: "lucecarter",
    id: "199566394",
  },
  {
    name: "contentfuldevs",
    id: "576507866",
  },
  {
    name: "dr_dinomight",
    id: "25347823",
  },
  {
    name: "exegeteio",
    id: "40856022",
  },
  {
    name: "gacbl",
    id: "120572949",
  },
  {
    name: "laylacodesit",
    id: "260151116",
  },
  {
    name: "matty_twoshoes",
    id: "556670211",
  },
  {
    name: "rawwwrs",
    id: "166942660",
  },
  {
    name: "ryantupo",
    id: "158165150",
  },
  {
    name: "ryan_the_rhg",
    id: "154364425",
  },
  {
    name: "sadmoody",
    id: "28493092",
  },
  {
    name: "sketchni",
    id: "64115778",
  },
  {
    name: "sociablesteve",
    id: "76884091",
  },
  {
    name: "thatn00b__",
    id: "235952406",
  },
  {
    name: "toefrog",
    id: "50336378",
  },
  {
    name: "greg_holmes",
    id: "93948214",
  },
  {
    name: "aurorasmadhouse",
    id: "132113595",
  },
  {
    name: "whitep4nth3r",
    id: "000000000",
  },
];

Promise.all(users.map((u) => getSchedule(u.name))).then(() => {
  fs.writeFile('./public/scripts/output.js', 'var schedule = ' + JSON.stringify(schedule),  function(err) {
      if (err) {
          return console.error(err);
      }
      console.log("File created!");
  });
});

