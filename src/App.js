import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./App.scss";
import location from "./images/location.svg";
import humidity from "./images/humidity.svg";
import uv from "./images/uv.svg";
import windy from "./images/windy.svg";
import WeatherProperty from "./components/WeatherProperty/WeatherProperty";
import Days from "./components/Days/Days";
import Hours from "./components/Hours/Hours";
import cloudRain from "./images/cloud-rain.svg";
import rainGif from "./images/rain.gif";
import thundery from "./images/thundery.gif";
import overcast from "./images/overcast.gif";
import fog from "./images/fog.gif";
import snow from "./images/snow.gif";
import background from "./images/background.jpg";
import clouds from "./images/clouds-gif.gif";
import sunnyGif from "./images/sunny-gif.gif";
import $ from "jquery";
import Loading from "./components/Loading/Loading";
import Input from "./components/Input/Input";
import removeVietnamese from "./common/removeVietnamese";

const key = "97fa134ece674729a8750505201210";
const url = "https://api.weatherapi.com/v1/forecast.json";

function getLongDay(time) {
  return new Date(time).toLocaleString("vi", {
    weekday: "long",
  });
}

function scrollHour(element) {
  const scroller = $(element);
  let isDown = false;
  let startX;
  let scrollLeft;
  const limitScroll = scroller.offset();
  const minScroll = limitScroll.left;
  const maxScroll =
    limitScroll.left -
    (scroller.width() - $(".containerWeather__bottom__hours").width());
  const positionCurrentTime = -(
    $(".block-time.active").offset().left -
    ($(".block-time.4").offset().left + minScroll)
  );

  if (positionCurrentTime >= minScroll) {
    scroller.offset({ left: minScroll });
  } else if (positionCurrentTime <= maxScroll) {
    scroller.offset({ left: maxScroll });
  } else {
    scroller.offset({ left: positionCurrentTime });
  }

  scroller.on("mousedown", (e) => {
    isDown = true;
    scroller.addClass("active");
    startX = e.pageX - scroller.offset().left;
    scrollLeft = scroller.offset().left;
  });

  scroller.on("mouseleave", () => {
    isDown = false;
    scroller.removeClass("active");
  });

  scroller.on("mouseup", () => {
    isDown = false;
    scroller.removeClass("active");
  });

  scroller.on("mousemove", (e) => {
    e.preventDefault();
    if (!isDown) {
      return;
    }
    const traversed = (e.pageX - scroller.offset().left - startX) * 1;
    const scrollTo = scrollLeft + traversed;
    if (scrollTo > minScroll || scrollTo < maxScroll) {
      return;
    }
    scroller.offset({ left: scrollTo });
  });
}

function App() {
  const [query, setQuery] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [dataRes, setDataRes] = useState(null);
  const [limitedScroll, setLimitedScroll] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search).get(
      "location"
    );
    if (urlParams !== null) {
      setQuery(removeVietnamese(urlParams));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let { latitude, longitude } = position.coords;
          setQuery(`${latitude}, ${longitude}`);
        },
        (err) => {
          setQuery("da nang");
        }
      );
    }
  }, []);

  useEffect(() => {
    if (query) {
      Axios.get(`${url}?key=${key}&q=${query}&days=3&lang=vi`)
        .then((res) => {
          const { data } = res;
          setDataRes(data);
          setTimeout(() => {
            const info = {
              location: {
                country: data.location.country,
                name: data.location.name,
                localtime: data.location.localtime,
              },
              temp_c: data.current.temp_c,
              uv: data.current.uv,
              humidity: data.current.humidity,
              daily_chance_of_rain:
                data.forecast.forecastday[0].day.daily_chance_of_rain,
              wind_kph: data.current.wind_kph,
              condition: data.current.condition,
              days: data.forecast.forecastday.map((item) => {
                if (
                  getLongDay(item.date) === getLongDay(data.location.localtime)
                ) {
                  return "Hôm nay";
                }
                return getLongDay(item.date);
              }),
              dayActive: "Hôm nay",
              hours: data.forecast.forecastday.find((item) => {
                return (
                  getLongDay(item.date) === getLongDay(data.location.localtime)
                );
              }),
            };
            setWeatherInfo(info);
          }, 1000);
        })
        .catch(() => {
          alert("Địa điểm này không tồn tại");
          navigator.geolocation.getCurrentPosition((position) => {
            let { latitude, longitude } = position.coords;
            setQuery(`${latitude}, ${longitude}`);
          });
        });
    }
  }, [query]);

  useEffect(() => {
    if (weatherInfo) {
      const statusOfWeather = weatherInfo.condition.text.toLowerCase();
      if (
        statusOfWeather.includes("sấm") ||
        statusOfWeather.includes("giông")
      ) {
        $("#container").css("background-image", `url(${thundery})`);
      } else if (statusOfWeather.includes("mưa")) {
        $("#container").css("background-image", `url(${rainGif})`);
      } else if (statusOfWeather.includes("u ám")) {
        $("#container").css("background-image", `url(${overcast})`);
      } else if (statusOfWeather.includes("sương")) {
        $("#container").css("background-image", `url(${fog})`);
      } else if (statusOfWeather.includes("tuyết")) {
        $("#container").css("background-image", `url(${snow})`);
      } else if (
        statusOfWeather.includes("nắng") ||
        statusOfWeather.includes("quang")
      ) {
        $("#container").css("background-image", `url(${sunnyGif})`);
      } else if (statusOfWeather.includes("mây")) {
        $("#container").css("background-image", `url(${clouds})`);
      } else {
        $("#container").css("background-image", `url(${background})`);
      }
    }

    if (limitedScroll === null && weatherInfo !== null) {
      setLimitedScroll("limited");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherInfo]);

  useEffect(() => {
    if (limitedScroll !== null) {
      scrollHour("#blockHours");
    }
  }, [limitedScroll]);

  const onHandleDay = (e) => {
    const dayActive = $(e.target).text();
    if (dayActive === "Hôm nay") {
      const info = {
        location: {
          country: dataRes.location.country,
          name: dataRes.location.name,
          localtime: dataRes.location.localtime,
        },
        temp_c: dataRes.current.temp_c,
        uv: dataRes.current.uv,
        humidity: dataRes.current.humidity,
        daily_chance_of_rain:
          dataRes.forecast.forecastday[0].day.daily_chance_of_rain,
        wind_kph: dataRes.current.wind_kph,
        condition: dataRes.current.condition,
        days: dataRes.forecast.forecastday.map((item) => {
          if (
            getLongDay(item.date) === getLongDay(dataRes.location.localtime)
          ) {
            return "Hôm nay";
          }
          return getLongDay(item.date);
        }),
        dayActive: "Hôm nay",
        hours: dataRes.forecast.forecastday.find((item) => {
          return (
            getLongDay(item.date) === getLongDay(dataRes.location.localtime)
          );
        }),
      };
      setWeatherInfo(info);
    } else {
      const objDay = dataRes.forecast.forecastday.find((item) => {
        return getLongDay(item.date) === dayActive;
      });
      const info = {
        location: {
          country: dataRes.location.country,
          name: dataRes.location.name,
          localtime: dataRes.location.localtime,
        },
        temp_c: objDay.day.avgtemp_c,
        uv: objDay.day.uv,
        humidity: objDay.day.avghumidity,
        daily_chance_of_rain: objDay.day.daily_chance_of_rain,
        wind_kph: objDay.day.maxwind_kph,
        condition: objDay.day.condition,
        days: dataRes.forecast.forecastday.map((item) => {
          if (
            getLongDay(item.date) === getLongDay(dataRes.location.localtime)
          ) {
            return "Hôm nay";
          }
          return getLongDay(item.date);
        }),
        dayActive: getLongDay(objDay.date),
        hours: {
          hour: objDay.hour,
        },
      };
      setWeatherInfo(info);
    }
  };

  return (
    <>
      {weatherInfo ? (
        <div className="App">
          <div className="containerWeather" id="container">
            <div className="containerWeather__background"></div>
            <div className="d-flex justify-content-between containerWeather__content">
              <div className="d-flex flex-column">
                <img
                  src={weatherInfo.condition.icon}
                  alt="clouds"
                  className="icons"
                />
                <h3 className="mb-0">{weatherInfo.condition.text}</h3>
                <h6>{`${weatherInfo.location.name} - ${weatherInfo.location.country}`}</h6>
                <h1 className="font-weight-bolder">{weatherInfo.temp_c} °C</h1>
                <div className="d-flex align-items-center cursor-poiter">
                  <img
                    src={location}
                    alt="location"
                    className="icons icons--small"
                  />
                  <p
                    className="mb-0 ml-2"
                    onClick={() => {
                      $("#locationForm").slideToggle();
                      $("#locationForm").find("input").focus();
                    }}
                  >
                    Thay đổi địa điểm
                  </p>
                </div>
                <form id="locationForm">
                  <Input label="Location" name="location" />
                </form>
              </div>
              <div className="d-flex flex-column mt-4">
                <WeatherProperty
                  icon={uv}
                  title="UV"
                  content={weatherInfo.uv}
                />
                <WeatherProperty
                  icon={humidity}
                  title="Độ ẩm"
                  content={weatherInfo.humidity + " %"}
                />
                <WeatherProperty
                  icon={cloudRain}
                  title="Có thể mưa"
                  content={weatherInfo.daily_chance_of_rain + " %"}
                />
                <WeatherProperty
                  icon={windy}
                  title="Tốc độ gió"
                  content={weatherInfo.wind_kph + " km/h"}
                />
              </div>
            </div>
            <div className="d-flex flex-column align-items-baseline containerWeather__bottom">
              <div className="d-flex">
                {weatherInfo.days.map((item, index) => (
                  <Days
                    day={item}
                    active={item === weatherInfo.dayActive ? true : false}
                    key={index}
                    onHandleDay={onHandleDay}
                  />
                ))}
              </div>
              <div className="containerWeather__bottom__hours">
                <div className="d-flex mb-3" id="blockHours">
                  {weatherInfo.hours.hour.map((item) => {
                    const currentDate = new Date(dataRes.location.localtime);
                    const timeLine = new Date(item.time);
                    return (
                      <Hours
                        time={item.time}
                        temperature={item.temp_c}
                        feelLike={item.feelslike_c}
                        rain={item.chance_of_rain}
                        image={item.condition.icon}
                        key={item.time_epoch}
                        active={
                          currentDate.getDate() !== timeLine.getDate()
                            ? false
                            : currentDate.getHours() === timeLine.getHours()
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default App;
