import React, {useRef,useState} from 'react';
import {View,Button,Text} from 'react-native';

export default function App(){

  const audioCtx = useRef(null);
  const [notes,setNotes]=useState([]);
  const [start,setStart]=useState(null);

  function ctx(){
    if(!audioCtx.current){
      audioCtx.current=new AudioContext();
    }
    return audioCtx.current;
  }

  function play(freq){

    const c=ctx();

    const osc=c.createOscillator();
    osc.frequency.value=freq;
    osc.connect(c.destination);

    osc.start();
    osc.stop(c.currentTime+0.5);
  }

  function press(freq){

    if(start===null) setStart(Date.now());

    const t=Date.now()-(start??Date.now());

    setNotes(n=>[...n,{freq,time:t}]);

    play(freq);
  }

  function playback(){

    if(notes.length===0) return;

    const base=notes[0].time;

    notes.forEach(n=>{
      setTimeout(()=>play(n.freq),n.time-base);
    });
  }

  const keys=[261,294,329,349,392,440,493];

  return(
    <View style={{marginTop:80}}>

      <Text style={{fontSize:30,textAlign:'center'}}>
      Music Recorder
      </Text>

      {keys.map((k,i)=>
        <Button
         key={i}
         title={"Key "+i}
         onPress={()=>press(k)}
        />
      )}

      <Button title="PLAY RECORDING" onPress={playback}/>

    </View>
  );
}