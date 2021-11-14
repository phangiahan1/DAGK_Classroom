import React from 'react'
import { useLocalContext } from "../../context/context";
import { Header } from '..';

const MainClassUser = ({classData}) => {
    const { createTabs, setCreateTabs } = useLocalContext();
    setCreateTabs(true);
    console.log('mainClass' + {classData});
    return (
        <>
            <div>
                <h1>Main Class People</h1>
            </div>
        </>
    )
}

export default MainClassUser;
