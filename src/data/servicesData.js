/* eslint-disable */
import { FaVideo, FaChalkboardTeacher, FaHeartbeat, FaDumbbell } from "react-icons/fa";
import { GiBrain, GiBullseye, GiFire } from "react-icons/gi";
import gameStrategy from '../assets/services/game strategy and practice.png';
import gamePlay from '../assets/services/exercise.png';
import serviceReceive from '../assets/services/service receive and techniques.png';
import sequencePractice from '../assets/services/sequence practice.png';
import videoAnalysis from '../assets/services/physical and metal fitness.png';
import conditioning from '../assets/services/conditioning and strenghthening.png';
import machinePractice from '../assets/services/machine practice.JPG';
import mentalFitness from '../assets/services/physical and metal fitness.png';

export const servicesData = [
     {
         id: 1,
         title: 'Game Strategy',
         icon: <GiBrain />,
         image: gameStrategy
    },
    {
        id: 2,
        title: 'Game Practice',
        icon: <FaDumbbell />,
        image: gamePlay
    },
    {
        id: 3,
        title: 'Service and Receive Techniques',
        icon: <GiBullseye />,
        image: serviceReceive
    },
    {
        id: 4,
        title: 'Sequence Practice',
        icon: <FaChalkboardTeacher />,
        image: sequencePractice
    },
    {
        id: 5,
        title: 'Video Analysis',
        icon: <FaVideo />,
        image: videoAnalysis
    },
    {
        id: 6,
        title: 'Conditioning and Strengthening',
        icon: <FaHeartbeat />,
        image: conditioning
    },
    {
        id: 7,
        title: 'Multiball Training and Machine Practice',
        icon: <GiFire />,
        image: machinePractice
    },
    {
        id: 8,
        title: 'Psychology and Mental Fitness Sessions',
        icon: <GiBrain />,
        image: mentalFitness
    },

]

// Uncomment your required service.
// Couldn't find the required services? Raise an issue on github at https://github.com/hhhrrrttt222111/developer-portfolio/issues/new
// You can also add on your own 😉.