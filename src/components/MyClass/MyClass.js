import { Avatar } from "@material-ui/core";
import { FolderOpen, PermContactCalendar } from "@material-ui/icons";
import { React, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { useLocalContext } from "../../context/context";
import MovingIcon from '@mui/icons-material/Moving';

import { AuthContext } from "../../context/AuthContext"

const MyClass = ({ classData }) => {
    //context
    const {
        authState: {
            user
        }
    } = useContext(AuthContext)

    const { createTabs, setCreateTabs } = useLocalContext();
    setCreateTabs(false);
 
    const [owner, setOwner] = useState(false);
    useEffect(() => {
        if (classData.owner == user[0].email) {
            setOwner(true);
        }
    }, []
    );

    return (
        <li className="joined__list">
            <div className="joined__wrapper">
                <div className="joined__container">
                    <div className="joined__imgWrapper" />
                    <div className="joined__image" />
                    <div className="joined__content">
                        <Link className="joined__title"
                            to={`/${classData._id}`}
                        >
                            <h2>{classData.classname}</h2>
                        </Link>
                        <h3 className="joined__owner">{classData.section}</h3>
                        {owner ? null
                            : <p className="joined__owner">{classData.owner}</p>
                        }
                    </div>
                </div>
                {owner ? null :
                    <Avatar
                        className="joined__avatar"
                        src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s75-c-fbw=1/photo.jpg"
                    />}
            </div>
            <div className="joined__bottom">
                {owner ? <MovingIcon />
                    : <PermContactCalendar />}
                <FolderOpen />
            </div>
        </li>
    );
};

export default MyClass;
