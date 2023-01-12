import React, { useState } from "react";
import { Appbar, BottomNavigation, Divider, Menu } from "react-native-paper";
import TransitionScreen from "./TransitionScreen";
import Passenger from "./Passenger";

const HomeRoute = () => <TransitionScreen/>;
const SecondRoute = () => <></>;
const ThirdRoute = () => <Passenger />;

const HomePage = ({ setLoggedIn }) => {
    const [menuVisibility, setMenuVisibility] = useState(false);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "home", title: "Home", focusedIcon: "home", unfocusedIcon: "home-outline" },
        { key: "second", title: "Driver", focusedIcon: "car", unfocusedIcon: "car-outline" },
        { key: "third", title: "Passenger", focusedIcon: "seat-passenger" },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        home: HomeRoute,
        second: SecondRoute,
        third: ThirdRoute,
    })

    const openMenu = () => setMenuVisibility(true);
    const closeMenu = () => setMenuVisibility(false);

    return (
        <>
            <Appbar.Header>
                <Appbar.Content icon="home" title="Home" />
                <Appbar.Action icon="magnify" onPress={() => console.log("Search Pressed")} />

                <Menu
                    visible={menuVisibility}
                    onDismiss={closeMenu}
                    anchor={
                        <Appbar.Action icon="cog" onPress={openMenu} />
                    }
                >
                    <Menu.Item onPress={() => {}} title="Settings" />
                    <Divider style={{ marginVertical: 5 }} />
                    <Menu.Item leadingIcon="exit-to-app" onPress={() => setLoggedIn(false)} title="Log Out"/>
                </Menu>
            </Appbar.Header>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </>
    );
}


export default HomePage;