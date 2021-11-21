import { createContext, useContext, useEffect, useState } from "react";

const AddContext = createContext();
export function useLocalContext() {
    return useContext(AddContext);
}

export function ContextProvider({ children }) {
    const [createClassDialog, setCreateClassDialog] = useState(false);
    const [joinClassDialog, setJoinClassDialog] = useState(false);
    const [loginDialog, setLoginDialog] = useState(false);
    const [registerDialog, setRegisterDialog] = useState(false);
    const [createTabs, setCreateTabs] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [createInviteTeacherDialog, setcreateInviteTeacherDialog] = useState(false);
    const [createInviteStudentDialog, setcreateInviteStudentDialog] = useState(false);
    const [profileDialog, setProfileDialog] = useState(false);
    const [openDialogCofirmInvite, setOpenDialogCofirmInvite] = useState(false);
    const [openDialogCofirmInviteStudent, setOpenDialogCofirmInviteStudent] = useState(false);
    const [CofirmInvite, setCofirmInvite]= useState(false);
    const [idC, setidC] = useState("");

    const value = {
        createClassDialog, setCreateClassDialog,
        joinClassDialog, setJoinClassDialog,
        loginDialog, setLoginDialog,
        registerDialog, setRegisterDialog,
        createTabs, setCreateTabs,
        tabValue, setTabValue,
        createInviteTeacherDialog, setcreateInviteTeacherDialog,
        profileDialog, setProfileDialog,
        openDialogCofirmInvite, setOpenDialogCofirmInvite,
        CofirmInvite, setCofirmInvite,
        idC, setidC,
        createInviteStudentDialog, setcreateInviteStudentDialog,
        openDialogCofirmInviteStudent, setOpenDialogCofirmInviteStudent
    };
    return (
        <AddContext.Provider value={value}>{children}</AddContext.Provider>
    )
}