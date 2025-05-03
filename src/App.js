import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PersonAdd from './components/PersonAdd';
import PersonList from './components/PersonList';
import PersonHome from './components/PersonHome';
import Layout from './components/Layout';
import { PersonContextProvider } from './components/PersonContext';


function App() {
  return (
    <PersonContextProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<PersonHome />} />
          <Route path="/list" element={<PersonList />} />
          <Route path="/add" element={<PersonAdd />} />
        </Routes>
      </Layout>
    </PersonContextProvider>
  );
}

export default App;