import React from "react";
import keplerGlReducer from "kepler.gl/reducers";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { taskMiddleware } from "react-palm/tasks";
import { Provider, useDispatch } from "react-redux";
import KeplerGl from "kepler.gl";
import { addDataToMap } from "kepler.gl/actions";
import useSwr from "swr";
import {createRoot} from 'react-dom/client';
const reducers = combineReducers({
  keplerGl: keplerGlReducer
});

const store = createStore(reducers, {}, applyMiddleware(taskMiddleware));

export function Map() {
  const dispatch = useDispatch();
  const { data } = useSwr("covid", async () => {
    const response = await fetch(
      "https://gist.githubusercontent.com/leighhalliday/a994915d8050e90d413515e97babd3b3/raw/a3eaaadcc784168e3845a98931780bd60afb362f/covid19.json"
    );
    const data = await response.json();
    return data;
  });

  React.useEffect(() => {
   console.log(data)
   if(data){
    
    dispatch(
      addDataToMap({
        datasets: {
          info: {
            label: "COVID-19",
            id: "covid19"
          },
          datasets:data
        },
        option: {
          centerMap: true,
          readOnly: false
        },
        config: {}
      })
    );
   }
  }, [dispatch, data]);

  return (
    <KeplerGl
      id="covid"
      mapboxApiAccessToken={'pk.eyJ1Ijoia2FyZWxpYSIsImEiOiJjbGdrd3VwYTMwNGRwM2VxaWlvcW1nZTZhIn0.B4XP49caw1VVRVpjSh-nTQ'}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}

export function App() {
  return (
    <Provider store={store}>
      <Map />
    </Provider>
  );
}

export function renderToDOM(container) {
    const root = createRoot(container);
    root.render(<App />)
  }