import React from 'react'
import { useLocalContext } from "../../context/context";


export const MainClassClassWork = () => {
    //set tab header
    const { createTabs, setCreateTabs } = useLocalContext();
    setCreateTabs(true);
    //tab value
    const { tabValue, setTabValue } = useLocalContext()
    setTabValue(1)
    return (
        <div>
            <h1>Class Work</h1>
        </div>
    )
}

export default MainClassClassWork;

