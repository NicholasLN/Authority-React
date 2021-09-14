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
const Party = lazy(() => import("../Pages/Party"));
const NoMatch = lazy(() => import("../Pages/NoMatch"));
const PoliticalParties = lazy(() => import("../Pages/PoliticalParties"));
const CreateParty = lazy(() => import("../Pages/CreateParty"));
const Actions = lazy(() => import("../Pages/Actions/Actions"));
const PartyCommittee = lazy(() => import("../Pages/PartyCommittee/PartyCommittee"));
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

        <Route path="/politicalActions">
          <Suspense fallback={<Loading />}>
            <Actions />
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
