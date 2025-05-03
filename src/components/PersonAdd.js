// PersonAdd.js
import React from 'react';
import PersonForm from './PersonForm';
import PersonList from './PersonList';

const PersonAdd = () => {
  return (
    <div className="container py-5">
      <h2 className="mb-4">Manage Persons</h2>
      <div className="row">
        <div className="col-lg-5 mb-4 mb-lg-0">
          <PersonForm />
        </div>
        <div className="col-lg-7">
          <PersonList />
        </div>
      </div>
    </div>
  );
};

export default PersonAdd;