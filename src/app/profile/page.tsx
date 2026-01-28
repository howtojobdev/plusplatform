import Navbar from "@/features/laningPage/presentation/Navbar";
import { CourseWorkView } from "@/features/user/presentation/CourseWorkView";
import { ProfileNavbar } from "@/features/user/presentation/ProfileNavbar";
import { UserDetailsBar } from "@/features/user/presentation/UserDetailsBar";

const ProfilePage = () => {
    return (
        <>
            <Navbar></Navbar>
            <UserDetailsBar></UserDetailsBar>
            <CourseWorkView></CourseWorkView>
            <ProfileNavbar></ProfileNavbar>
        </>
    )
};

export default ProfilePage;