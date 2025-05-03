import React, { createContext, useState, useEffect } from 'react';

// Sample data for states and cities
export const statesWithCities = {
  "California": ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
  "New York": ["New York City", "Buffalo", "Albany", "Rochester"],
  "Texas": ["Houston", "Austin", "Dallas", "San Antonio"],
  "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville"],
  "Illinois": ["Chicago", "Springfield", "Peoria", "Naperville"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubli"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"]
};

export const PersonContext = createContext();

export const PersonContextProvider = ({ children }) => {
  const [persons, setPersons] = useState(() => {
    const savedPersons = localStorage.getItem('persons');
    return savedPersons ? JSON.parse(savedPersons) : [];
  });
  
  const [editPerson, setEditPerson] = useState(null);

  useEffect(() => {
    localStorage.setItem('persons', JSON.stringify(persons));
  }, [persons]);

  const addPerson = (person) => {
    const newPerson = {
      ...person,
      id: Date.now().toString()
    };
    setPersons([...persons, newPerson]);
  };

  const updatePerson = (updatedPerson) => {
    setPersons(persons.map(person => 
      person.id === updatedPerson.id ? updatedPerson : person
    ));
    setEditPerson(null);
  };

  const deletePerson = (id) => {
    setPersons(persons.filter(person => person.id !== id));
  };

  const startEdit = (person) => {
    setEditPerson(person);
  };

  const cancelEdit = () => {
    setEditPerson(null);
  };

  return (
    <PersonContext.Provider value={{
      persons,
      addPerson,
      updatePerson,
      deletePerson,
      editPerson,
      startEdit,
      cancelEdit
    }}>
      {children}
    </PersonContext.Provider>
  );
};