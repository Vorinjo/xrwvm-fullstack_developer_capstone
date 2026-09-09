import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../Header/Header";
import reviewIcon from "../assets/reviewicon.png";
import "../assets/style.css";
import "./Dealers.css";


const Dealers = () => {
  const navigate = useNavigate();
  const { state: stateFromUrl } = useParams();
  const initialState = stateFromUrl ? decodeURIComponent(stateFromUrl) : "All";
  const [dealers, setDealers] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = Boolean(sessionStorage.getItem("username"));

  const loadDealers = async (state = "All") => {
    setLoading(true);
    const suffix = state === "All" ? "" : "/" + encodeURIComponent(state);
    const response = await fetch("/djangoapp/get_dealers" + suffix);
    const result = await response.json();
    if (result.status === 200) {
      const dealerList = Array.from(result.dealers || []);
      setDealers(dealerList);
      if (state === "All") {
        setStates(
          Array.from(new Set(dealerList.map((dealer) => dealer.state))).sort()
        );
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const initialize = async () => {
      const response = await fetch("/djangoapp/get_dealers");
      const result = await response.json();
      const allDealers = Array.from(result.dealers || []);
      setStates(
        Array.from(new Set(allDealers.map((dealer) => dealer.state))).sort()
      );
      if (initialState === "All") {
        setDealers(allDealers);
        setLoading(false);
      } else {
        await loadDealers(initialState);
      }
    };
    initialize();
  }, []);

  const filterDealers = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    navigate(state === "All" ? "/dealers" : `/dealers/${encodeURIComponent(state)}`);
    loadDealers(state);
  };

  return (
    <div>
      <Header />
      <main className="dealer-page">
        <div className="dealer-heading">
          <div>
            <p className="eyebrow">Nationwide dealer network</p>
            <h1>Find a Best Cars dealership</h1>
            <p>Browse all branches or filter the list by state.</p>
            <p className="endpoint-label">Endpoint: {window.location.pathname}</p>
          </div>
          <label className="state-filter">
            Filter by state
            <select
              name="state"
              id="state"
              value={selectedState}
              onChange={filterDealers}
            >
              <option value="All">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <p className="loading-message">Loading dealerships...</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Dealer Name</th>
                  <th>City</th>
                  <th>Address</th>
                  <th>Zip</th>
                  <th>State</th>
                  {isLoggedIn && <th>Review Dealer</th>}
                </tr>
              </thead>
              <tbody>
                {dealers.map((dealer) => (
                  <tr key={dealer.id}>
                    <td>{dealer.id}</td>
                    <td>
                      <a href={"/dealer/" + dealer.id}>{dealer.full_name}</a>
                    </td>
                    <td>{dealer.city}</td>
                    <td>{dealer.address}</td>
                    <td>{dealer.zip}</td>
                    <td>{dealer.state}</td>
                    {isLoggedIn && (
                      <td>
                        <a
                          href={"/postreview/" + dealer.id}
                          aria-label={"Review " + dealer.full_name}
                        >
                          <img
                            src={reviewIcon}
                            className="review_icon"
                            alt="Review Dealer"
                          />
                        </a>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dealers;
