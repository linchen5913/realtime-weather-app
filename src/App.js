import styled from "@emotion/styled";
import React, { useState, useEffect, useMemo } from "react";
import WeatherCard from "./views/WeatherCard";
import useWeatherAPI from "./hook/useWeatherAPI";
import WeatherSetting from "./views/WeatherSetting";
import { ThemeProvider } from "emotion-theming";
import { getMoment, findLocation } from "./utils/helper";

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AUTHORIZATION_KEY = "CWB-7326B42F-8AAE-4BE6-96A3-2031E4BC6F33";

function App() {
  const storageCity = localStorage.getItem("cityName") || "臺北市";
  const [currentPage, setCurrentPage] = useState("WeatherCard");
  const [currentTheme, setCurrentTheme] = useState("light");
  const [currentCity, setCurrentCity] = useState(storageCity);
  const { cityName, locationName, sunriseCityName } = useMemo(
    () => findLocation(currentCity),
    [currentCity]
  );
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };

  const handleCurrentCityChange = (cityName) => {
    setCurrentCity(cityName);
  };

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={cityName}
            weatherElement={weatherElement}
            fetchData={fetchData}
            moment={moment}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            handleCurrentPageChange={handleCurrentPageChange}
            handleCurrentCityChange={handleCurrentCityChange}
            cityName={cityName}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
