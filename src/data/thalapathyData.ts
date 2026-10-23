import { DialogueItem, ThalapathySticker, TwoOptionQuestion } from '../types';

import dogMascotImg from '../assets/images/thalapathy_cute_dog_mascot_1792766266586.jpg';
import crownPuppyImg from '../assets/images/thalapathy_leo_puppy_1792766282528.jpg';

export const MASCOT_IMAGES = {
  dogWithShades: dogMascotImg,
  crownPuppy: crownPuppyImg
};

export const THALAPATHY_DIALOGUES: DialogueItem[] = [
  {
    id: 'd1',
    quote: 'Bloody Sweet!',
    transliteration: 'Bloody Sweet!',
    movie: 'Leo (2023)',
    year: '2023',
    tag: 'mass'
  },
  {
    id: 'd2',
    quote: 'I am waiting!',
    transliteration: 'I am waiting!',
    movie: 'Thuppakki (2012) & Master (2021)',
    year: '2012',
    tag: 'punch'
  },
  {
    id: 'd3',
    quote: 'Oru murai mudivu pannita, en pecha naaney keka maaten!',
    transliteration: 'Once I decide, I will not even listen to my own words!',
    movie: 'Pokkiri (2007)',
    year: '2007',
    tag: 'punch'
  },
  {
    id: 'd4',
    quote: 'Vaathi Coming othuru!',
    transliteration: 'The Master has arrived, step aside!',
    movie: 'Master (2021)',
    year: '2021',
    tag: 'mass'
  },
  {
    id: 'd5',
    quote: 'All is well! Life-la tension edhuvum venam nanba!',
    transliteration: 'All is well! No tension in life, my friend!',
    movie: 'Nanban (2012)',
    year: '2012',
    tag: 'motivation'
  },
  {
    id: 'd6',
    quote: 'Verithanam! Verithanam! Michael Rayappan da!',
    transliteration: 'Pure madness & passion! Michael Rayappan here!',
    movie: 'Bigil (2019)',
    year: '2019',
    tag: 'mass'
  },
  {
    id: 'd7',
    quote: 'Ketta payan sir indha Kathiresan!',
    transliteration: 'He is a dangerous guy, sir!',
    movie: 'Kaththi (2014)',
    year: '2014',
    tag: 'punch'
  },
  {
    id: 'd8',
    quote: 'Peace bro! Kill them with your success, bury them with your smile.',
    transliteration: 'Kill them with your success, bury them with your smile.',
    movie: 'Thalapathy Speech',
    year: '2019',
    tag: 'motivation'
  },
  {
    id: 'd9',
    quote: 'Naa ready dhaa varava, Annan erangi thavala?!',
    transliteration: 'I am ready to enter the battleground!',
    movie: 'Leo (2023)',
    year: '2023',
    tag: 'mass'
  },
  {
    id: 'd10',
    quote: 'Kanna, namma bayapadradhu orutharukku therinjiduchi na, adhu avangaluku thunivu!',
    transliteration: 'If people know our fear, it becomes their courage!',
    movie: 'Mersal (2017)',
    year: '2017',
    tag: 'classic'
  }
];

export const THALAPATHY_GIFS = [
  {
    title: 'Leo Bloody Sweet Swagger',
    movie: 'Leo',
    category: 'vijay',
    url: 'https://media.giphy.com/media/V80GjL8097jeyEwU03/giphy.gif',
    fallback: '🍫'
  },
  {
    title: 'Master JD Kada Spin',
    movie: 'Master',
    category: 'vijay',
    url: 'https://media.giphy.com/media/rD62fdKGwIg8Pb45G3/giphy.gif',
    fallback: '🕶️'
  },
  {
    title: 'Vaathi Coming Signature Step',
    movie: 'Master',
    category: 'vijay',
    url: 'https://media.giphy.com/media/Xj0pIka0ZUbW8/giphy.gif',
    fallback: '🔥'
  },
  {
    title: 'Ghilli Chellame Kabaddi',
    movie: 'Ghilli',
    category: 'vijay',
    url: 'https://media.giphy.com/media/l41JRsph73VokN6ik/giphy.gif',
    fallback: '🏆'
  },
  {
    title: 'Cute Dancing Puppy in Shades',
    movie: 'Pet Squad',
    category: 'dog',
    url: 'https://media.giphy.com/media/bbshzgyFQDqPHXBo4c/giphy.gif',
    fallback: '🐶'
  },
  {
    title: 'Golden Puppy Wagging Tail',
    movie: 'Good Boy',
    category: 'dog',
    url: 'https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif',
    fallback: '🐕'
  },
  {
    title: 'Puppy High-Five Celebration',
    movie: 'Paw Team',
    category: 'dog',
    url: 'https://media.giphy.com/media/mG0GFZ1w445VO/giphy.gif',
    fallback: '🐾'
  },
  {
    title: 'Cool Doggo Wearing Sunglasses',
    movie: 'Mass Doggie',
    category: 'dog',
    url: 'https://media.giphy.com/media/3o7527pa7qs9kCG78A/giphy.gif',
    fallback: '🕶️🐶'
  }
];

export const THALAPATHY_STICKERS: ThalapathySticker[] = [
  { id: 'st-dog1', name: 'Shades Pup', icon: '🐶🕶️', movie: 'Leo Dog Squad', color: 'from-amber-500 to-amber-700' },
  { id: 'st-dog2', name: 'Crown Doggie', icon: '👑🐕', movie: 'Thalapathy Pup', color: 'from-yellow-400 to-amber-600' },
  { id: 'st-dog3', name: 'High Five Paw', icon: '🐾✨', movie: 'Nanba Paws', color: 'from-rose-500 to-pink-700' },
  { id: 'st1', name: 'Master Kada', icon: '⛓️', movie: 'Master', color: 'from-amber-600 to-amber-900' },
  { id: 'st2', name: 'Leo Coffee Mug', icon: '☕', movie: 'Leo', color: 'from-[#800517] to-red-950' },
  { id: 'st3', name: 'Rayappan Whistle', icon: '📢', movie: 'Bigil', color: 'from-red-600 to-orange-700' },
  { id: 'st4', name: 'JD Aviators', icon: '🕶️', movie: 'Master', color: 'from-blue-600 to-indigo-900' },
  { id: 'st5', name: 'Thalapathy Crown', icon: '👑', movie: 'Mersal', color: 'from-yellow-500 to-amber-700' },
  { id: 'st6', name: 'Thuppakki Bullet', icon: '💥', movie: 'Thuppakki', color: 'from-zinc-600 to-zinc-900' },
  { id: 'st7', name: 'Ghilli Kabaddi', icon: '⚡', movie: 'Ghilli', color: 'from-orange-500 to-amber-600' },
  { id: 'st8', name: 'Bloody Sweet Flame', icon: '🔥', movie: 'Leo', color: 'from-red-500 to-[#800517]' }
];

// Curated 2-Option question ideas including cute dog & Thalapathy options
export const STARTER_TWO_OPTION_QUESTIONS: Omit<TwoOptionQuestion, 'id'>[] = [
  {
    question: 'If I could adopt any pet right now, which one would I pick?',
    optionA: 'A playful Golden Retriever Puppy 🐶🐾',
    optionB: 'A cool chill Husky with blue eyes 🐺❄️',
    correctOption: 0
  },
  {
    question: 'What is my favorite hot drink to kickstart the day?',
    optionA: 'Chai / Masala Tea ☕',
    optionB: 'South Indian Filter Coffee ☕',
    correctOption: 0
  },
  {
    question: 'If we are watching a Thalapathy Vijay movie, which vibe do I prefer?',
    optionA: 'Raw Mass & Action (Leo / Master) 🕶️🔥',
    optionB: 'Feel-Good & Dance (Nanban / Ghilli) 🕺🎉',
    correctOption: 0
  },
  {
    question: 'How do I react whenever I see a cute dog on the street?',
    optionA: 'Must stop and pet the doggo immediately! 🐕💖',
    optionB: 'Wave and say &ldquo;Who&apos;s a good boy!&rdquo; from distance 🐶👋',
    correctOption: 0
  },
  {
    question: 'How do I spend my ideal Sunday evening?',
    optionA: 'Chilling at home with my pet & movies 🛌🐶',
    optionB: 'Going out exploring with gang / friends 🚗✨',
    correctOption: 0
  },
  {
    question: 'When I get angry or upset, what cheers me up fastest?',
    optionA: 'Playing with cute puppies & good food 🍕🐶',
    optionB: 'Listening to Thalapathy mass songs loud 🎧🔥',
    correctOption: 0
  },
  {
    question: 'My sleeping pattern?',
    optionA: 'Night Owl (Awake till 2 AM) 🦉🌙',
    optionB: 'Early Bird (Up with the sun) 🌅☀️',
    correctOption: 0
  },
  {
    question: 'Do I usually remember birthdays and anniversaries?',
    optionA: 'Yes, sharp memory! 🎂🧠',
    optionB: 'Always need a reminder / Facebook! 📅😅',
    correctOption: 0
  }
];
