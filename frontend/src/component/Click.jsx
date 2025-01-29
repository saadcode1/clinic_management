import React from 'react'
import { useNavigate } from 'react-router-dom';
function Click() {
// Initialize the navigate function
const navigate = useNavigate();
   const redirectFunc=()=>{
     navigate("/doctorsList")
   }

  return (
    <div><button onClick={()=>redirectFunc()}>Click</button></div>
  )
}

export default Click