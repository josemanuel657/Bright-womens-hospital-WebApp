import { Character } from "./Character.ts";

const gabeFrames = [
  "/characterSprites/gabe1.png",
  "/characterSprites/gabe2.png",
  "/characterSprites/gabe3.png",
  "/characterSprites/gabe4.png",
  "/characterSprites/gabe5.png",
  "/characterSprites/gabe6.png",
];
const gabeHead = "/heads/gabeHead.png";
const gabePassive =
  "Extra Thick: Shields and Hearts spawn at a fixed, increased rate";
const gabeRole = "Backend Lead";
const gabeQuote =
  '"I be goofy, kinda funny. Acting stupid but they love me." - Mac Miller';
const gabeBackstory =
  "Dwelling in the most remote corners of campus, away from all civilization, his immune system has become very weak in his pursuit of networking and backend knowledge. It will take a lot to get him sick, but once he is, he'll fall hard.";
const Gabe = new Character(
  "Gabe",
  5,
  1,
  2,
  gabePassive,
  gabeFrames,
  gabeHead,
  gabeRole,
  gabeQuote,
  gabeBackstory,
);

const joseFrames = [
  "/characterSprites/jose1.png",
  "/characterSprites/jose2.png",
  "/characterSprites/jose3.png",
  "/characterSprites/jose4.png",
  "/characterSprites/jose5.png",
  "/characterSprites/jose6.png",
  "/characterSprites/jose7.png",
];
const joseHead = "/heads/joseHead.png";
const josePassive =
  "Ethereal Existence: Starts as a mortal cartographer with just one health point, but his health has infinite potential for expansion";
const joseRole = "Algorithms Lead";
const joseQuote = '"Un vaso es un vaso y un plato es un plato" - Mariano Rajoy';
const joseBackstory =
  "Physically detached from everyday interactions, nestled among ancient oak trees and class diagrams, this sage devoted his entire being to the intricate art of map-making. This enlightenment drove him to the brink of madness but also flung wide open the doors of his heart";
const Jose = new Character(
  "Jose",
  0,
  4,
  3,
  josePassive,
  joseFrames,
  joseHead,
  joseRole,
  joseQuote,
  joseBackstory,
);

const christianFrames = [
  "/characterSprites/christian1.png",
  "/characterSprites/christian2.png",
  "/characterSprites/christian3.png",
  "/characterSprites/christian4.png",
  "/characterSprites/christian5.png",
  "/characterSprites/christian6.png",
  "/characterSprites/christian7.png",
  "/characterSprites/christian8.png",
  "/characterSprites/christian9.png",
];
const christianHead = "/heads/christianHead.png";
const christianPassive =
  "Blue Sword, Blue Shields: Saved shields grant stacking speed";
const christianRole = "Lead Software Developer";
const christianQuote =
  "There's smoke in my iris. But I painted a sunny day on the insides of my eyelids - Aesop Rock";
const christianBackstory =
  "After too many all-nighters, his spirit became intertwined with the project. His thoughts and will completely consumed. He now bears the Brigham colors; a nomad in search of new delighters for team N's website.";
const Christian = new Character(
  "Christian",
  1,
  3,
  4,
  christianPassive,
  christianFrames,
  christianHead,
  christianRole,
  christianQuote,
  christianBackstory,
);

const sophiaFrames = [
  "/characterSprites/sophia1.png",
  "/characterSprites/sophia2.png",
];
const sophiaHead = "/heads/sophiaHead.png";
const sophiaPassive =
  "Woman in STEM: regenerate a heart every 20 seconds if not at full health";
const sophiaRole = "Frontend";
const sophiaQuote = "Fashion over function -Coco Chanel";
const sophiaBackstory =
  "Centuries of being a woman in a male dominated field have shaped her to become stronger than all her male peers. This strength is shown in her expert healing abilities.";
const Sophia = new Character(
  "Sofia",
  4,
  2,
  2,
  sophiaPassive,
  sophiaFrames,
  sophiaHead,
  sophiaRole,
  sophiaQuote,
  sophiaBackstory,
);

const timothyFrames = [
  "/characterSprites/timothy1.png",
  "/characterSprites/timothy2.png",
  "/characterSprites/timothy3.png",
  "/characterSprites/timothy4.png",
];
const timothyHead = "/heads/timothyHead.png";
const timothyPassive =
  "Professor Zoom: All controls are inverted but you are extremely fast";
const timothyRole = "Frontend";
const timothyQuote =
  "I don't really care about fame or recognition. I just totally dig on advancing knowledge! -Jimmy Lightning Peggle";
const timothyBackstory =
  "After many years as a successful scientist he tried to teleport himself with his pet llama. The experiment went horribly wrong, fusing the two together and causing him to lose his sight.";
const Timothy = new Character(
  "Timothy",
  3,
  6,
  3,
  timothyPassive,
  timothyFrames,
  timothyHead,
  timothyRole,
  timothyQuote,
  timothyBackstory,
);

const peterFrames = [
  "/characterSprites/peter1.png",
  "/characterSprites/peter2.png",
  "/characterSprites/peter3.png",
];
const peterHead = "/heads/peterHead.png";
const peterPassive =
  "Atomic Sneeze: after taking damage send out a sneeze that destroys all diseases on screen";
const peterRole = "Frontend";
const peterQuote =
  "Real G's move in silence like lasagna -Lil Wayne 6 Foot 7 Foot";
const peterBackstory =
  "Emerging from the shadows with seemingly no origins, he roams campus in his trusty black hat. No one has ever seen him without his hat. Everyone wonders what is under it.";
const Peter = new Character(
  "Peter",
  2,
  3,
  3,
  peterPassive,
  peterFrames,
  peterHead,
  peterRole,
  peterQuote,
  peterBackstory,
);

const madduxFrames = [
  "/characterSprites/maddux1.png",
  "/characterSprites/maddux2.png",
  "/characterSprites/maddux3.png",
  "/characterSprites/maddux4.png",
  "/characterSprites/maddux5.png",
];
const madduxHead = "/heads/madduxHead.png";
const madduxPassive = "Powerlifting: Shields last longer when activated.";
const madduxRole = "Algorithms";
const madduxQuote =
  "If possible, as far as it depends on you, live at peace with everyone. - Romans";
const madduxBackstory =
  "If wandering around the gym, you may be able to find him moving tons of weight at a time. He intimidates lesser individuals with his deep smolder.";
const Maddux = new Character(
  "Maddux",
  4,
  3,
  1,
  madduxPassive,
  madduxFrames,
  madduxHead,
  madduxRole,
  madduxQuote,
  madduxBackstory,
);

const seanFrames = [
  "/characterSprites/sean1.png",
  "/characterSprites/sean2.png",
  "/characterSprites/sean3.png",
  "/characterSprites/sean4.png",
  "/characterSprites/sean5.png",
];
const seanHead = "/heads/seanHead.png";
const seanPassive =
  "Regeneration: After 5 seconds of inactivity, you gain a shield";
const seanRole = "Backend";
const seanQuote = "I smoked away my brain -A$AP Rocky";
const seanBackstory =
  "No one is sure where he came from, but he's here and people think he's chill. It seems his hair has a mind of its own.";
const Sean = new Character(
  "Sean",
  2,
  2,
  4,
  seanPassive,
  seanFrames,
  seanHead,
  seanRole,
  seanQuote,
  seanBackstory,
);

const lorenzoFrames = [
  "/characterSprites/lorenzo1.png",
  "/characterSprites/lorenzo2.png",
  "/characterSprites/lorenzo3.png",
  "/characterSprites/lorenzo4.png",
  "/characterSprites/lorenzo5.png",
  "/characterSprites/lorenzo6.png",
  "/characterSprites/lorenzo7.png",
  "/characterSprites/lorenzo8.png",
  "/characterSprites/lorenzo9.png",
  "/characterSprites/lorenzo10.png",
];
const lorenzoHead = "/heads/lorenzoHead.png";
const lorenzoPassive = "Short Circuit: Speed increases as health decreases";
const lorenzoRole = "Backend";
const lorenzoQuote =
  "I visualize a time when we will be to robots what dogs are to humans, and I'm rooting for the machines -Claude Shannon";
const lorenzoBackstory =
  "Obsessed with immortality, he transferred his brain into an android body, granting him the eternity he sought but at the cost of his humanity.";
const Lorenzo = new Character(
  "Lorenzo",
  4,
  2,
  3,
  lorenzoPassive,
  lorenzoFrames,
  lorenzoHead,
  lorenzoRole,
  lorenzoQuote,
  lorenzoBackstory,
);

const ethanFrames = [
  "/characterSprites/ethan1.png",
  "/characterSprites/ethan2.png",
  "/characterSprites/ethan3.png",
  "/characterSprites/ethan4.png",
];
const ethanHead = "/heads/ethanHead.png";
const ethanPassive =
  "Chorus Conundrum: Randomly teleports to an unoccupied space";
const ethanRole = "Frontend";
const ethanQuote =
  "And such were some of you: but ye are washed, but ye are sanctified, but ye are justified in the name of the Lord Jesus, and by the Spirit of our God. - 1 Corinthians 6:11";
const ethanBackstory =
  "A diet of a few too many chorus fruits has turned him into a block-like creature. It's hard for him to control his powers.";
const Ethan = new Character(
  "Ethan",
  3,
  2,
  3,
  ethanPassive,
  ethanFrames,
  ethanHead,
  ethanRole,
  ethanQuote,
  ethanBackstory,
);

const wongFrames = [
  "/characterSprites/wong1.png",
  "/characterSprites/wong2.png",
  "/characterSprites/wong3.png",
  "/characterSprites/wong4.png",
  "/characterSprites/wong5.png",
];
const wongHead = "/heads/wongHead.png";
const wongPassive =
  "Knowledgeable: Through his wealth of Knowledge in CS, he hacked into the code and found a way to give himself max stats. But as a just man, has disallowed his scores to be on the leaderboard";
const wongRole = "Professor";
const wongQuote =
  "The application of a systematic, disciplined quantifiable approach to the development operation, and maintenance of software -IEEE";
const wongBackstory =
  "Purchasing an ancient pottery work off a sketchy website caused him to be cursed. He must keep his glasses on to avoid shooting lasers wherever he is looking.";
const Wong = new Character(
  "Wong",
  5,
  5,
  5,
  wongPassive,
  wongFrames,
  wongHead,
  wongRole,
  wongQuote,
  wongBackstory,
);

const josephFrames = [
  "/characterSprites/joseph1.png",
  "/characterSprites/joseph2.png",
  "/characterSprites/joseph3.png",
  "/characterSprites/joseph4.png",
];
const josephHead = "/heads/josephHead.png";
const josephPassive =
  "Boring: No specific passive, but more stat points because of it.";
const josephRole = "Team Coach";
const josephQuote =
  "That's life bro. Everybody is not going to like you -Eric Bledsoe";
const josephBackstory =
  "Years of wandering through the library, led him to Team N. With his wisdom and guidance, they thrived completing all tasks and becoming the best team";
const Joseph = new Character(
  "Joseph",
  3,
  4,
  4,
  josephPassive,
  josephFrames,
  josephHead,
  josephRole,
  josephQuote,
  josephBackstory,
);

const gusFrames = ["/characterSprites/gus1.png", "/characterSprites/gus2.png"];
const gusHead = "/heads/gusHead.png";
const gusPassive =
  "War Scream: All diseases are smaller due to his piercing repetition of house music";
const gusRole = "Frontend";
const gusQuote =
  "In theory there's no difference between theory and practice. In practice there is -Yogi Berra";
const gusBackstory =
  "His true origins are a mystery, some say he appeared on day in the basement of SAE. Too much house music has affected his mind.";
const Gus = new Character(
  "Gus",
  3,
  4,
  1,
  gusPassive,
  gusFrames,
  gusHead,
  gusRole,
  gusQuote,
  gusBackstory,
);

export const allCharacters = [
  Gabe,
  Jose,
  Christian,
  Sophia,
  Timothy,
  Peter,
  Maddux,
  Joseph,
  Lorenzo,
  Ethan,
  Gus,
  Sean,
  Wong,
];

export enum Characters {
  Gabe = 0,
  Jose = 1,
  Christian = 2,
  Sofia = 3,
  Timothy = 4,
  Peter = 5,
  Maddux = 6,
  Joseph = 7,
  Lorenzo = 8,
  Ethan = 9,
  Gus = 10,
  Sean = 11,
  Wong = 12,
}
