import React, { Component, Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";

/**
 * Import all page components here.
 */
const Index = lazy(() => import("../Index/Index"));
const Register = lazy(() => import("../Pages/Register"));
const Login = lazy(() => import("../Pages/Login"));
const EditProfile = lazy(() => import("../Pages/EditProfile"));
const Politician = lazy(() => import("../Pages/Politician/Politician"));
const Party = lazy(() => import("../Pages/Party/Party"));
const NoMatch = lazy(() => import("../Pages/NoMatch"));
const PoliticalParties = lazy(() => import("../Pages/PoliticalParties"));
const CreateParty = lazy(() => import("../Pages/CreateParty"));
const Actions = lazy(() => import("../Pages/Actions/Actions"));
const PartyCommittee = lazy(() => import("../Pages/PartyCommittee/PartyCommittee"));
const PartyVote = lazy(() => import("../Pages/PartyCommittee/PartyVote"));
const StateOverview = lazy(() => import("../Pages/State/StateOverview"));
const DemographicOverview = lazy(() => import("../Pages/Demographics/DemographicOverview"));
const Poll = lazy(() => import("../Pages/Demographics/Poll"));
const Legislatures = lazy(() => import("../Pages/Legislatures/LegislatureOverview"));
const LegislatureVote = lazy(() => import("../Pages/Legislatures/LegislatureVote"));
const Credits = lazy(() => import("../Pages/Credits"));

import Loading from "../Misc/Loading";
//import Politician from "../Pages/Politician/Politician";

class Routes extends Component {
  render() {
    return (
      <Switch>
        {/*Home Page*/}
        <Route exact path="/">
          <Suspense fallback={<Loading />}>
            <Index />
          </Suspense>
        </Route>

        <Route exact path="/credits">
          <Suspense fallback={<Loading />}>
            <Credits />
          </Suspense>
        </Route>

        {/*Register Page*/}
        <Route path="/register">
          <Suspense fallback={<Loading />}>
            <Register />
          </Suspense>
        </Route>

        {/*Login Page*/}
        <Route path="/login">
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        </Route>

        {/*Edit Profile Page*/}
        <Route path="/editprofile">
          <Suspense fallback={<Loading />}>
            <EditProfile />
          </Suspense>
        </Route>

        {/*Politician Pages*/}
        <Route exact path="/politician">
          <Suspense fallback={<Loading />}>
            <Politician noRequestId={true} />
          </Suspense>
        </Route>

        {/*Politician, with provided ID*/}
        <Route path="/politician/:userId">
          <Suspense fallback={<Loading />}>
            <Politician />
          </Suspense>
        </Route>

        {/*Party*/}
        <Route path={["/party/:partyId/:mode?", "/party"]}>
          <Suspense fallback={<Loading />}>
            <Party />
          </Suspense>
        </Route>

        {/*Political Parties*/}
        <Route path={["/politicalParties/:country", "/politicalParties"]}>
          <Suspense fallback={<Loading />}>
            <PoliticalParties />
          </Suspense>
        </Route>

        {/*Legislature Overview*/}
        <Route path="/legislatures/:country/:legislatureId?/:mode?">
          <Suspense fallback={<Loading />}>
            <Legislatures />
          </Suspense>
        </Route>

        {/*Legislature Vote*/}
        <Route path="/legislatureVote/:voteId">
          <Suspense fallback={<Loading />}>
            <LegislatureVote />
          </Suspense>
        </Route>

        {/*Party Committee*/}
        <Route path="/partyCommittee/:partyId/:mode?">
          <Suspense fallback={<Loading />}>
            <PartyCommittee />
          </Suspense>
        </Route>

        <Route path="/createParty">
          <Suspense fallback={<Loading />}>
            <CreateParty />
          </Suspense>
        </Route>

        <Route path="/partyVote/:voteId?">
          <Suspense fallback={<Loading />}>
            <PartyVote />
          </Suspense>
        </Route>

        <Route path="/politicalActions">
          <Suspense fallback={<Loading />}>
            <Actions />
          </Suspense>
        </Route>

        <Route path="/state/:stateId">
          <Suspense fallback={<Loading />}>
            <StateOverview />
          </Suspense>
        </Route>

        <Route path="/demographics/:country?/:state?/:race?/:gender?">
          <Suspense fallback={<Loading />}>
            <DemographicOverview />
          </Suspense>
        </Route>

        <Route path="/poll">
          <Suspense fallback={<Loading />}>
            <Poll />
          </Suspense>
        </Route>

        {/*Not Found Route*/}
        <Route path="*">
          <Suspense fallback={<Loading />}>
            <NoMatch />
          </Suspense>
        </Route>
      </Switch>
    );
  }
}

export default Routes;
