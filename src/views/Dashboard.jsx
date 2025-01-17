import React from 'react'
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import useProtectedData from '../hooks/useProtectedData';
function Dashboard() {
  useProtectedData();
  
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard