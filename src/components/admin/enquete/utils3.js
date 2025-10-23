import Avatar2 from '/images2/users/avatar-2.jpg'
import Avatar3 from '/images2/users/avatar-3.jpg'
import Avatar4 from '/images2/users/avatar-4.jpg'

const chatData = [
  {
    id: 1,
    image: Avatar2,
    name: 'John Howard',
    message: "Hey! there I'm available",
    time: '02 min',
    status: 'online',
  },
  {
    id: 2,
    name: 'Galen Rizor',
    message: "I've finished it! See you so",
    time: '10 min',
    status: 'online',
  },
  {
    id: 3,
    image: Avatar3,
    name: 'Bernard Spencer',
    message: 'This theme is awesome!',
    time: '22 min',
    status: 'away',
  },
  {
    id: 4,
    image: Avatar4,
    name: 'Annie Holder',
    message: 'Nice to meet you',
    time: '01 hr',
  },
  {
    id: 5,
    name: 'Vernon Smith',
    message: "Wow that's great",
    time: '04 Hrs',
    status: 'online',
  },
]

const groupData = [
  {
    id: 1,
    name: 'General',
    member: 5,
    membername: 'Alman',
  },
  {
    id: 2,
    name: 'Designers',
    icon: 'uil-edit-alt',
    member: 7,
    membername: 'Smith',
  },
  {
    id: 3,
    name: 'Meeting',
    icon: 'uil-users-alt',
    member: 12,
    membername: 'Christa',
  },
]

const chatMessagesData = [
  {
    id: 1,
    name: 'John Howard',
    message: 'Good morning everyone !',
    time: '10:00',
  },
  {
    id: 2,
    align: 'right',
    name: 'Marcus',
    message: 'Good morning everyone !',
    time: '10:02',
  },
  {
    id: 3,
    name: 'Galen Rizo',
    message: 'Hello!',
    time: '10:04',
  },
  {
    id: 4,
    name: 'Galen Rizo',
    message: 'What about our next meeting?',
    time: '10:04',
  },
  {
    id: 5,
    name: 'John Howard',
    message: 'Next meeting tomorrow 10.00AM',
    time: '10:06',
  },
  {
    id: 6,
    align: 'right',
    name: 'Marcus',
    message: "Wow that's great",
    time: '10:07',
  },
]

export { chatData, chatMessagesData, groupData }
