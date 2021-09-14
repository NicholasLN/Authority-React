create table countries (
    id int auto_increment primary key,
    name varchar(255) default '' not null
) charset = utf8;
create table demoPositions (
    id int auto_increment primary key,
    demoID int null,
    type text null,
    `-5` float null,
    `-4` double null,
    `-3` double null,
    `-2` double null,
    `-1` double null,
    `0` double null,
    `1` double null,
    `2` double null,
    `3` double null,
    `4` double null,
    `5` float null
);
create table demographicPolls (
    poll_id int auto_increment primary key,
    user_id int null,
    poll_compressed text null,
    date_held int null
);
create table demographics (
    demoID int auto_increment primary key,
    State text null,
    Race text null,
    Population bigint null,
    Gender text null,
    EcoPosMean double default 0 null,
    SocPosMean double default 0 null,
    Polarization varchar(10) default '1.5' not null
);
create table fundRequests (
    id int auto_increment primary key,
    party int default 0 not null,
    requester int default 0 not null,
    requesting int default 0 not null,
    reason varchar(50) default '' not null,
    fulfilled int default 0 null,
    secret varchar(50) null
);
create table parties (
    id int auto_increment primary key,
    partyBio varchar(1000) default '' null,
    partyPic varchar(900) default 'https://firebasestorage.googleapis.com/v0/b/authorityimagestorage.appspot.com/o/partyPics%2Fdefault.png?alt=media&token=1658ffc3-add7-4701-86b1-52673b5e0dee' null,
    nation varchar(50) null,
    name varchar(60) null,
    initialEcoPos double null,
    initialSocPos double null,
    ecoPos double null,
    socPos double null,
    partyRoles mediumtext null,
    discord varchar(16) default '0' null,
    partyTreasury double default 0 null,
    fees double unsigned default '0' not null,
    votes int default 250 null
);
create table partyVotes (
    id int auto_increment primary key,
    author int null,
    party int null,
    name varchar(65) null,
    actions longtext null,
    ayes varchar(900) default '[]' null,
    nays varchar(900) default '[]' null,
    passed int default 0 null,
    expiresAt int null,
    delay int default 0 null
);
create table states (
    id int auto_increment primary key,
    name varchar(255) not null,
    abbreviation varchar(255) not null,
    active int default 0 null,
    country varchar(255) null,
    flag text null
) charset = utf8;
create table users (
    id int auto_increment primary key,
    admin int default 0 null,
    username text not null,
    password text not null,
    regCookie varchar(255) not null,
    currentCookie varchar(255) not null,
    regIP text not null,
    currentIP text not null,
    hsi double default 10 not null,
    politicianName varchar(55) not null,
    lastOnline varchar(500) default '0' not null,
    profilePic varchar(2500) default 'https://firebasestorage.googleapis.com/v0/b/authorityimagestorage.appspot.com/o/userPics%2Fdefault.jpg?alt=media&token=554a387f-ee3c-4224-bfd8-47562c223a77' null,
    bio varchar(2500) default 'I am gay!' not null,
    state varchar(255) not null,
    nation varchar(255) not null,
    ecoPos double default 0 not null,
    socPos double default 0 not null,
    authority double default 50 null,
    campaignFinance bigint default 50000 null,
    party int default 0 null,
    partyInfluence double default 0 null,
    partyVotingFor int default 0 null
) charset = utf8;