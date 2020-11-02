import React, { useState, useEffect } from 'react';
import './Add.scss';
import KanbanDB from 'kanbandb/dist/KanbanDB';

function AddButton(props) {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState('TODO');

  const newCard = {
    name: text,
    status: selected,
    description: '',
  };

  return (
    <div className='add-button-container'>
      <input
        placeholder='e.g Bug: TextPoll not dispatching half stars'
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select onChange={(e) => setSelected(e.target.value)}>
        <option value='TODO'>To Do</option>
        <option value='DOING'>In Progress</option>
        <option value='DONE'>Done</option>
      </select>
      <button
        onClick={() => {
          props.addItem(newCard);
          setText('');
        }}
      >
        ADD NEW
      </button>
    </div>
  );
}

export default AddButton;
