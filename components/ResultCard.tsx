import { View, Text } from "react-native";

type ThreatLevel = 'safe' | 'okay' | 'dangerous' | 'standby';

interface ResultCardProps{
    status: ThreatLevel;
    message: string;
}

//Still didn't decide the color yet
const getGradientColors = (status: ThreatLevel) =>{
    switch(status){
        case 'safe': return [];
        case 'okay': return [];
        case 'dangerous': return [];
        default: return [];
    }
}

