import React, { useState } from "react";
import { Appbar, BottomNavigation } from "react-native-paper";
import LoginScreen from "./LoginScreen";

const HomeRoute = () => <LoginScreen />;
const SecondRoute = () => <></>;
const ThirdRoute = () => <></>;

const HomePage = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "home", title: "Home", focusedIcon: "home", unfocusedIcon: "home-outline" },
        { key: "second", title: "Driver", focusedIcon: "car" },
        { key: "third", title: "Passenger", focusedIcon: "seat-passenger" },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        home: HomeRoute,
        second: SecondRoute,
        third: ThirdRoute,
    })

    return (
        <>
            <Appbar.Header>
                <Appbar.Content icon="home" title="Home" />
                <Appbar.Action icon="magnify" onPress={() => console.log("Search Pressed")} />
                <Appbar.Action icon="cog" onPress={() => console.log("More Pressed")} />
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