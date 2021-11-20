import { Avatar } from "@material-ui/core";
import { FolderOpen, PermContactCalendar } from "@material-ui/icons";
import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { useLocalContext } from "../../context/context";
import MovingIcon from '@mui/icons-material/Moving';
const MyClass = ({ classData }) => {

    const { createTabs, setCreateTabs } = useLocalContext();
    setCreateTabs(false);

    //for login
    const [tokenData, setTokenData] = useState(
        localStorage.getItem('tokenData')
            ? JSON.parse(localStorage.getItem('tokenData'))
            : null
    );
    const [loginData, setLoginData] = useState(
        localStorage.getItem('loginData')
            ? JSON.parse(localStorage.getItem('loginData'))
            : null
    );
    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
      };


    const [owner, setOwner] = useState(false);


    useEffect(() => {
        if (loginData) {
            if (classData.owner == loginData.email) {
                setOwner(true);
            }
        }
    }, [loginData]
    );
    useEffect(() => {
        if (tokenData) {
            if (classData.owner == parseJwt(tokenData).email) {
                setOwner(true);
            }
        }
    }, [tokenData]
    );

    // if (loginData && classData.owner == loginData.email) {
    //     setOwner(true);
    // }
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
