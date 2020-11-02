import React, { useState, useEffect } from 'react';
import './App.scss';
import KanbanDB from 'kanbandb/dist/KanbanDB';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AiFillDelete, AiOutlineEdit } from 'react-icons/ai';
import AddButton from './Components/AddButton/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-modal/styles.css';
import ModalPopup from './Components/Modal/Modal';

function initialize() {
  KanbanDB.connect();
}

function App() {
  const [columns, setColumns] = useState({
    todo: {
      title: 'To-do',
      items: [],
    },
    doing: {
      title: 'In Progress',
      items: [],
    },
    done: {
      title: 'Done',
      items: [],
    },
  });
  const initalCards = [
    {
      name: 'Laundry',
      description: "Finish brother's laundry tonight",
      status: 'TODO',
      id: '',
      lastUpdated: 0,
      created: 0,
    },
    {
      name: 'Take Out the Garbage',
      description: 'Tomorrow is garbage pickup',
      status: 'TODO',
      id: '',
      lastUpdated: 0,
      created: 0,
    },
    {
      name: 'Cooking',
      description: 'In cooking mode',
      status: 'DOING',
      id: '',
      lastUpdated: 0,
      created: 0,
    },
    {
      name: "Zaid's ADP Project",
      description: 'Hopefully this project lands me the position at ADP',
      status: 'DONE',
      id: '',
      lastUpdated: 0,
      created: 0,
    },
  ];

  const [data, setData] = useState(initalCards);
  useEffect(() => {
    initialize();
    initalCards.map((card) => {
      KanbanDB.addCard(card)
        .then((cardId) => console.log('success'))
        .catch((err) => console.error(err.message));
    });
    KanbanDB.getCards()
      .then((cards) => {
        setData(cards);
        Object.entries(columns).map(([columnName, column]) => {
          cards.map((card) => {
            if (columnName === card.status.toLowerCase()) {
              setColumns((prevState) => ({
                ...prevState,
                [columnName]: {
                  ...prevState[columnName],
                  items: [...prevState[columnName].items, card],
                },
              }));
            }
          });
        });
      })
      .catch((err) => console.error(err.message));
  }, []);

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }
    const itemCopy = { ...columns[source.droppableId].items[source.index] };
    setColumns((prev) => {
      prev = { ...prev };
      prev[source.droppableId].items.splice(source.index, 1);
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );
      return prev;
    });
  };

  const handleDelete = (id, status, index) => {
    KanbanDB.deleteCardById(id).then((card) => {
      setColumns((prev) => {
        prev = { ...prev };
        prev[status.toLowerCase()].items.splice(index, 1);
        return prev;
      });
    });
  };

  const [open, setOpen] = useState({ open: false, id: '' });
  const onOpenModal = (id) => {
    setOpen({
      open: true,
      id,
    });
  };
  const closeModal = () => {
    setOpen({
      open: false,
      id: '',
    });
  };

  const addCard = (newCard) => {
    if (!newCard.name) {
      toast.error('🦄 You need to enter something!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    KanbanDB.addCard(newCard)
      .then((cardId) => {
        KanbanDB.getCardById(cardId).then((card) => {
          setColumns((prev) => {
            prev = { ...prev };
            prev[card.status.toLowerCase()].items.push(card);
            return prev;
          });
        });
      })

      .catch((err) => console.error(err.message));
  };

  const handleUpdateCard = (text, cardData) => {
    KanbanDB.updateCardById(cardData.id, cardData)
      .then((card) => {
        closeModal();
        setColumns((prev) => {
          let card = prev[cardData.status.toLowerCase()].items.findIndex(
            (card) => card.id === cardData.id
          );
          prev = { ...prev };
          console.log(
            prev[cardData.status.toLowerCase()].items[card].description,
            text
          );
          prev[cardData.status.toLowerCase()].items[card].description = text;
          console.log(
            prev[cardData.status.toLowerCase()].items[card].description,
            text
          );
          return prev;
        });
      })
      .catch((err) => console.error(err.message));
  };

  return (
    <div className='App'>
      <ToastContainer />
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(columns).map(([columnName, column]) => {
          return (
            <div key={columnName} className='kanbanColumns'>
              <h3 style={{ color: '#1d5572', paddingTop: 20 }}>
                {column.title}
              </h3>
              <Droppable droppableId={columnName} key={columnName}>
                {(provided, snapshot) => {
                  return (
                    <div
                      ref={provided.innerRef}
                      className='droppable-column'
                      style={{
                        paddin: 4,
                        width: '70%',
                        height: '100%',
                      }}
                      {...provided.droppableProps}
                    >
                      {columns[columnName].items.map((card, index) => {
                        return (
                          <Draggable
                            key={card.id}
                            index={index}
                            draggableId={card.id}
                          >
                            {(provided, snapshot) => {
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className='draggable-item'
                                  style={{
                                    userSelect: 'none',
                                    backgroundColor: 'white',
                                    padding: 16,
                                    margin: '5px auto 8px',
                                    minHeight: '50px',
                                    color: '#253031',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                    }}
                                  >
                                    <div>{card.name}</div>

                                    <h6>Description</h6>
                                    <div>{card.description}</div>
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                    }}
                                  >
                                    <AiFillDelete
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        handleDelete(
                                          card.id,
                                          card.status,
                                          index
                                        )
                                      }
                                    />
                                    <AiOutlineEdit
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => onOpenModal(card.id)}
                                    />
                                  </div>
                                  {open.open && card.id === open.id ? (
                                    <ModalPopup
                                      card={card}
                                      id={card.id}
                                      desc={card.description}
                                      openModal={open}
                                      handleUpdateCard={handleUpdateCard}
                                      close={() => closeModal()}
                                    />
                                  ) : (
                                    ''
                                  )}
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
      <AddButton addItem={addCard} />
    </div>
  );
}

export default App;
